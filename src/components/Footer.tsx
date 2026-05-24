import { Plane, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-2xl border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
           <Link to="/" className="flex items-center gap-2 group mb-6">
            <Plane className="w-8 h-8 text-gold-500" />
            <span className="heading-serif font-bold text-2xl tracking-widest text-white uppercase">
              KVR Flight
            </span>
          </Link>
          <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
            Experience the luxury of first-class aviation dining without leaving the ground. A cinematic journey of flavors awaits you.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-gold-500 hover:border-gold-500 transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-gold-500 hover:border-gold-500 transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-300 hover:text-gold-500 hover:border-gold-500 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="heading-serif text-lg mb-6">Quick Links</h3>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/menu" className="hover:text-gold-500 transition-colors">In-Flight Menu</Link></li>
            <li><Link to="/about" className="hover:text-gold-500 transition-colors">Our Story</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-500 transition-colors">Cabins</Link></li>
            <li><Link to="/contact" className="hover:text-gold-500 transition-colors">Reservations</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="heading-serif text-lg mb-6">Contact Us</h3>
           <ul className="space-y-4 text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <span>HCJC+39Q, Gandi Maisamma,<br/>Hyderabad, Telangana 500043</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold-500 shrink-0" />
              <a href="tel:01205244540" className="hover:text-gold-500 transition-colors cursor-pointer">0120 524 4540</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold-500 shrink-0" />
              <a href="mailto:book@kvrflight.com" className="hover:text-gold-500 transition-colors cursor-pointer">book@kvrflight.com</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} KVR Flight Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}
