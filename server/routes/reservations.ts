import express from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.js";
import { Reservation } from "../models/Reservation.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to check if a user is an admin
const isAdminUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    return user?.isAdmin || false;
  } catch (e) {
    return false;
  }
};

// GET /api/reservations/available-tables - Dynamic remaining tables count tracker
router.get("/available-tables", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }
    const reservationsOnDate = await Reservation.find({ date: String(date) });
    const totalBookedTables = reservationsOnDate.reduce((sum: number, r: any) => sum + (r.tables || 1), 0);
    const capacity = 10; // total tables limit
    const remaining = Math.max(0, capacity - totalBookedTables);
    return res.json({ total: capacity, booked: totalBookedTables, remaining });
  } catch (error) {
    console.error("Error fetching available tables:", error);
    res.status(500).json({ error: "Failed to fetch table availability" });
  }
});

// GET /api/reservations - Fetch reservations.
// If the user is an admin, returns all reservations.
// If the user is a registered passenger, returns only their reservations.
// Guest requests without headers can fall back to empty or query by email if passed.
router.get("/", optionalAuthMiddleware, async (req: any, res) => {
  try {
    if (req.user?.userId) {
      const admin = await isAdminUser(req.user.userId);
      if (admin) {
        // Admins can see all reservations, newest first
        const allRes = await Reservation.find().sort({ createdAt: -1 });
        return res.json(allRes);
      } else {
        // Authenticated passenger only sees their own
        const user = await User.findById(req.user.userId);
        const myRes = await Reservation.find({
          $or: [
            { userId: req.user.userId },
            { email: user?.email }
          ]
        }).sort({ createdAt: -1 });
        return res.json(myRes);
      }
    }

    // Unauthenticated fallback or query by email
    const { email } = req.query;
    if (email) {
      const emailRes = await Reservation.find({ email: String(email) }).sort({ createdAt: -1 });
      return res.json(emailRes);
    }

    // Default empty array for unauth users with no queries
    return res.json([]);
  } catch (error) {
    console.error("Fetch reservations error:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

// POST /api/reservations - Submit/Create a passenger reservation
router.post("/", optionalAuthMiddleware, async (req: any, res) => {
  try {
    const { name, email, phone, date, time, guests, classType, seatNumber, tables } = req.body;

    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing required passenger fields." });
    }

    const tablesToBook = Number(tables) || 1;

    // Check dynamic capacity
    const reservationsOnDate = await Reservation.find({ date: String(date) });
    const totalBookedTables = reservationsOnDate.reduce((sum: number, r: any) => sum + (r.tables || 1), 0);
    const capacity = 10;
    const remaining = Math.max(0, capacity - totalBookedTables);
    if (tablesToBook > remaining) {
      return res.status(400).json({ error: `Not enough tables available. Only ${remaining} tables remaining.` });
    }

    const finalPhone = phone || "Not Provided";

    const randomSeatLetters = ['A', 'F', 'B', 'C', 'D', 'K'];
    const randomSeatNum = Math.floor(Math.random() * 24) + 1;
    const finalSeatNumber = seatNumber || `${randomSeatNum}${randomSeatLetters[Math.floor(Math.random() * randomSeatLetters.length)]}`;

    const reservationData: any = {
      name,
      email,
      phone: finalPhone,
      date,
      time,
      guests: Number(guests) || 1,
      tables: tablesToBook,
      classType: classType || "First Class",
      seatNumber: finalSeatNumber,
      status: "Pending"
    };

    if (req.user?.userId) {
      reservationData.userId = req.user.userId;
    }

    const newReservation = new Reservation(reservationData);
    await newReservation.save();

    // Prepare food reservation / dining flight boarding email
    const mailOptions = {
      from: `"KVR Flight Gourmet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Flight Reservation Confirmed! Seat ${finalSeatNumber}`,
      text: `Dear ${name},\n\nWe are delighted to confirm your gourmet flight reservation.\n\nDetails:\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nTables: ${tablesToBook}\nClass: ${classType}\nSeat Number: ${finalSeatNumber}\n\nThank you for choosing KVR Flight Gourmet!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; background-color: #0d0d0e; color: #ffffff; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #d4af37; font-family: 'Playfair Display', serif; margin: 0;">KVR Flight Gourmet</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Your Boarding & Dining Confirmation</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #1f1f23; margin: 20px 0;" />
          <p style="font-size: 16px; color: #cbd5e1;">Dear <strong style="color: #ffffff;">${name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">We are absolutely thrilled to confirm your reservation for our high-altitude culinary simulation. Your exclusive dining seat has been locked into our database system.</p>
          
          <div style="background-color: #1a1a1d; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #d4af37; margin-top: 0; font-size: 16px; border-bottom: 1px solid rgba(212, 175, 55, 0.1); padding-bottom: 10px; text-transform: uppercase;">Reservation Specifications</h3>
            <table style="width: 100%; border-collapse: collapse; color: #cbd5e1; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 40%;">Seat Assignment:</td>
                <td style="padding: 6px 0; color: #d4af37; font-weight: bold; font-family: monospace; font-size: 16px;">${finalSeatNumber}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Travel Class:</td>
                <td style="padding: 6px 0;">${classType}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Reservation Date:</td>
                <td style="padding: 6px 0;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Select Hour:</td>
                <td style="padding: 6px 0;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Passenger(s):</td>
                <td style="padding: 6px 0;">${guests} Guest(s)</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Tables Reserved:</td>
                <td style="padding: 6px 0; color: #d4af37; font-weight: bold;">${tablesToBook} Table(s)</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Contact Phone:</td>
                <td style="padding: 6px 0;">${finalPhone}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">Please verify your details upon arrival. If you need any adjustments to your boarding options or class tier, please reach out to our service desk.</p>
          <hr style="border: 0; border-top: 1px solid #1f1f23; margin: 20px 0;" />
          <div style="text-align: center; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">Thank you for reserving a flight session with KVR Flight Gourmet.</p>
            <p style="margin: 5px 0 0 0; color: #d4af37;">Wishing you a sublime culinary journey!</p>
          </div>
        </div>
      `
    };

    // Send confirmation email helper
    transporter.sendMail(mailOptions, (mailErr, info) => {
      if (mailErr) {
        console.error("Failed to send reservation confirmation email:", mailErr);
      } else {
        console.log("Reservation confirmation email sent successfully:", info.response);
      }
    });

    res.status(201).json({ success: true, reservation: newReservation });
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ error: "Failed to register reservation" });
  }
});

// PUT /api/reservations/:id - Update reservation properties (Admin/Staff only or owner)
router.put("/:id", optionalAuthMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Update permissible fields
    const fields = ['name', 'email', 'phone', 'date', 'time', 'guests', 'tables', 'seatNumber', 'status', 'classType'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'guests' || field === 'tables') {
          reservation[field] = Number(req.body[field]);
        } else {
          reservation[field] = req.body[field];
        }
      }
    });

    // Validate table count changes
    if (req.body.tables !== undefined || req.body.date !== undefined) {
      const checkDate = reservation.date;
      const reservationsOnDate = await Reservation.find({ date: String(checkDate), _id: { $ne: reservation._id } });
      const otherBooked = reservationsOnDate.reduce((sum: number, r: any) => sum + (r.tables || 1), 0);
      const capacity = 10;
      if ((reservation.tables || 1) > (capacity - otherBooked)) {
        return res.status(400).json({ error: `Cannot update reservation: Exceeds remaining capacity of ${capacity - otherBooked} tables.` });
      }
    }

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({ error: "Failed to update reservation" });
  }
});

// DELETE /api/reservations/:id - Delete a seat booking (Cancel and Purge)
router.delete("/:id", optionalAuthMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ message: "Reservation deleted successfully", id });
  } catch (error) {
    console.error("Delete reservation error:", error);
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});

export default router;
