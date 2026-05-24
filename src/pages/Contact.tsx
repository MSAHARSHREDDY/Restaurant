import { useState, useEffect } from "react";
import { Reveal } from "../components/Reveal";
import { Plane, Calendar, Users, MapPin, Phone, Mail, CheckCircle2, Clock } from "lucide-react";
import { submitReservation } from "../api/client";
import toast from "react-hot-toast";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [availableTables, setAvailableTables] = useState<number>(10);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/reservations/available-tables?date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setAvailableTables(data.remaining);
        }
      } catch (err) {
        console.error("Failed to load available tables:", err);
      }
    };
    fetchAvailability();
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (availableTables <= 0) {
      toast.error("Sorry, we are fully booked for this date.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      await submitReservation(data);
      
      // Fetch updated table count immediately
      if (selectedDate) {
        try {
          const checkResponse = await fetch(`/api/reservations/available-tables?date=${selectedDate}`);
          if (checkResponse.ok) {
            const checkData = await checkResponse.json();
            setAvailableTables(checkData.remaining);
          }
        } catch (innerErr) {
          console.error(innerErr);
        }
      }
      
      // Trigger email to customer via mailto
      const subject = encodeURIComponent("KVR Flight Restaurant - Reservation Confirmation");
      const body = encodeURIComponent(`Dear ${data.name},\n\nYour reservation for ${data.guests} passenger(s) and ${data.tables || 1} table(s) on ${data.date} at ${data.time} is confirmed.\n\nThank you for choosing KVR Flight Restaurant.\n\nSpecial Requests: ${data.notes || 'None'}\n\nBest regards,\nKVR Flight Team\nHCJC+39Q, Gandi Maisamma, Hyderabad\n0120 524 4540`);
      
      const mailtoLink = `mailto:${data.email}?subject=${subject}&body=${body}`;
      // Use hidden anchor to trigger mailto to avoid iframe restrictions
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reservation confirmed dynamically in database!");
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to book. Please check availability.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="text-gold-500 text-sm tracking-[0.2em] uppercase mb-4">Book Your Flight</h2>
          <h1 className="heading-serif text-5xl md:text-6xl text-white">Reservations</h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <Reveal direction="right" className="space-y-12">
             <div>
               <h3 className="heading-serif text-3xl text-white mb-6">Terminal Information</h3>
               <p className="text-gray-400 font-light leading-relaxed mb-8">
                 Conveniently located in the heart of the city, KVR Flight Restaurant offers complimentary valet parking for all first-class passengers. Please arrive 15 minutes before your scheduled boarding time.
               </p>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                     <MapPin className="w-5 h-5 text-gold-500" />
                   </div>
                   <div>
                     <h4 className="text-white font-medium mb-1">Location</h4>
                     <p className="text-gray-400 text-sm">HCJC+39Q, Gandi Maisamma,<br/>Hyderabad, Telangana 500043</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                     <Phone className="w-5 h-5 text-gold-500" />
                   </div>
                   <div>
                     <h4 className="text-white font-medium mb-1">Contact</h4>
                     <a href="tel:01205244540" className="text-gray-400 text-sm hover:text-gold-500 transition-colors cursor-pointer">0120 524 4540</a>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                     <Mail className="w-5 h-5 text-gold-500" />
                   </div>
                   <div>
                     <h4 className="text-white font-medium mb-1">Email inquiries</h4>
                     <a href="mailto:reservations@kvrflight.com" className="text-gray-400 text-sm hover:text-gold-500 transition-colors cursor-pointer">reservations@kvrflight.com</a>
                   </div>
                 </div>
               </div>
             </div>

               <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-gold-500">
                 <h4 className="heading-serif text-xl text-white mb-4">Boarding Hours</h4>
                 <ul className="space-y-2 text-gray-400 text-sm">
                   <li className="flex justify-between"><span>Monday - Sunday</span> <span>11:00 AM - 12:00 AM</span></li>
                 </ul>
               </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.2} direction="left">
            <div className="glass-panel p-8 md:p-10 rounded-2xl relative overflow-hidden">
               {isSuccess ? (
                 <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-10">
                   <CheckCircle2 className="w-16 h-16 text-gold-500 mb-4" />
                   <h3 className="heading-serif text-3xl text-white mb-2">Boarding Pass Confirmed</h3>
                   <p className="text-gray-400 mb-6">Your reservation request has been received. A confirmation email has been sent to your registered email address.</p>
                   <button 
                     onClick={() => setIsSuccess(false)}
                     className="px-6 py-2 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-950 transition-colors uppercase tracking-widest text-sm font-medium cursor-pointer"
                   >
                     Book Another
                   </button>
                 </div>
               ) : null}

               <h3 className="heading-serif text-2xl text-white mb-8 flex items-center gap-3">
                 <Plane className="w-6 h-6 text-gold-500" />
                 Request Boarding Pass
               </h3>

               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm text-gray-400 uppercase tracking-wider">Full Name</label>
                     <input required name="name" type="text" className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm text-gray-400 uppercase tracking-wider">Email</label>
                     <input required name="email" type="email" className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="john@example.com" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm text-gray-400 uppercase tracking-wider">Phone</label>
                     <input required name="phone" type="tel" className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="+91 9876543210" />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2"><Calendar className="w-4 h-4"/> Date</label>
                     <input required name="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors min-h-[50px] [color-scheme:dark]" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2"><Clock className="w-4 h-4"/> Time</label>
                     <input required name="time" type="time" min="11:00" max="23:30" className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors min-h-[50px] [color-scheme:dark]" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm text-gray-400 uppercase tracking-wider flex items-center gap-2"><Users className="w-4 h-4"/> Passengers</label>
                     <select required name="guests" className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none min-h-[50px]">
                       {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>)}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm text-gold-500 uppercase tracking-wider flex items-center gap-2"><Plane className="w-4 h-4"/> Tables to Reserve</label>
                     <select required name="tables" className="w-full bg-dark-950/20 border border-gold-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none min-h-[50px]">
                       {availableTables > 0 ? (
                         Array.from({ length: Math.min(10, availableTables) }, (_, i) => i + 1).map(n => (
                           <option key={n} value={n} className="bg-dark-950">{n} {n === 1 ? 'Table' : 'Tables'}</option>
                         ))
                       ) : (
                         <option value="0" className="bg-dark-950" disabled>Fully Booked</option>
                       )}
                     </select>
                   </div>
                 </div>

                 <div className="flex items-center gap-2 text-sm">
                   <div className={`w-2 h-2 rounded-full ${availableTables > 5 ? 'bg-green-500' : availableTables > 0 ? 'bg-orange-500' : 'bg-red-500 animate-pulse'}`}></div>
                   <span className={availableTables > 0 ? "text-gray-300" : "text-red-400"}>
                     {availableTables > 0 ? `${availableTables} tables currently available` : "Fully booked for today"}
                   </span>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm text-gray-400 uppercase tracking-wider">Special Requests / Allergies</label>
                   <textarea name="notes" rows={4} className="w-full bg-dark-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" placeholder="Any dietary requirements or special occasions?"></textarea>
                 </div>

                 <button 
                   disabled={isSubmitting}
                   className="w-full py-4 bg-gold-500 text-dark-950 font-semibold uppercase tracking-widest text-sm hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-14 cursor-pointer"
                 >
                   {isSubmitting ? <div className="w-6 h-6 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" /> : "Confirm Reservation"}
                 </button>
               </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

