import { Notification } from "../models/Notification.js";
import { sseBroadcast } from "./sse.js";

interface NotificationParams {
  type: string; // 'new_order', 'new_reservation', etc.
  title: string;
  message: string;
  metadata?: any;
}

export async function notifyAdmin({ type, title, message, metadata }: NotificationParams) {
  try {
    const notification = new Notification({
      type,
      title,
      message,
      metadata,
    });
    await notification.save();
    
    // Broadcast real-time
    sseBroadcast("admin_notification", notification);
    console.log(`[Notification] Success broadcasting notification: "${title}"`);
    return notification;
  } catch (err) {
    console.error(`[Notification] Failed to create or broadcast:`, err);
  }
}
