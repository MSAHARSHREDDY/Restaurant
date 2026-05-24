import { Reveal } from "../components/Reveal";
import { motion } from "framer-motion";
import { Crown, Star, Coffee, Wine } from "lucide-react";

export function About() {
  return (
    <div className="w-full bg-transparent">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-dark-950/60 z-10" />
         <img
            src="https://images.unsplash.com/photo-1540331547168-8b6310ce21e5?q=80&w=2500&auto=format&fit=crop"
            alt="Aircraft interior"
            className="absolute inset-0 w-full h-full object-cover z-0"
         />
         <div className="relative z-20 text-center px-6">
           <Reveal direction="down">
              <h2 className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-4">Our Story</h2>
           </Reveal>
           <Reveal delay={0.2}>
              <h1 className="heading-serif text-5xl md:text-7xl text-white">The Journey Begins</h1>
           </Reveal>
         </div>
      </section>

      {/* Story Sections */}
      <section className="py-32 relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <Reveal direction="right" className="relative group">
            <div className="absolute inset-0 bg-gold-500/20 rounded-2xl translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1500&auto=format&fit=crop" 
              alt="Founders" 
              className="rounded-2xl w-full h-[500px] object-cover"
            />
          </Reveal>
          <Reveal direction="left" className="space-y-6">
            <h3 className="heading-serif text-4xl text-white mb-6">A Vision of Luxury Altitude</h3>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              KVR Flight Restaurant was born from a simple yet ambitious idea: to capture the unparalleled romance, luxury, and exclusivity of first-class air travel, and ground it in an accessible dining experience.
            </p>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              Our founders, a former aviation engineer and a Michelin-starred chef, collaborated to design an environment where every detail—from the curvature of the cabin walls to the acoustic dampening algorithms—mimics cruising at 35,000 feet.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
          <Reveal direction="left" className="relative group lg:order-2">
            <div className="absolute inset-0 bg-gold-500/20 rounded-2xl -translate-x-4 translate-y-4 -z-10 transition-transform group-hover:-translate-x-6 group-hover:translate-y-6" />
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1500&auto=format&fit=crop" 
              alt="Dining Experience" 
              className="rounded-2xl w-full h-[500px] object-cover"
            />
          </Reveal>
          <Reveal direction="right" className="space-y-6 lg:order-1">
            <h3 className="heading-serif text-4xl text-white mb-6">The Culinary Captains</h3>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              Led by Executive Chef Marcus Arling, our culinary team treats every plate as a destination. The menus are curated to represent the finest stops on a hypothetical world tour, utilizing hyper-seasonal ingredients.
            </p>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              Our "flight attendants" are rigorously trained sommeliers and hospitality experts, ensuring your journey is turbulence-free and utterly indulgent.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <Reveal className="text-center mb-16">
              <h3 className="heading-serif text-4xl text-white">The Flight Manifesto</h3>
           </Reveal>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Crown, title: "Uncompromising Luxury", text: "Premium materials, bespoke service, absolute comfort." },
                { icon: Wine, title: "Curated Pairings", text: "A world-class cellar tailored for altitude-simulated flavors." },
                { icon: Star, title: "Michelin Standards", text: "Execution precision in every dish that leaves the galley." },
                { icon: Coffee, title: "Cabin Comfort", text: "Pre-boarding experiences that set the perfect tone." },
              ].map((val, i) => (
                <Reveal key={i} delay={i * 0.15} direction="up" className="glass-panel p-8 rounded-2xl text-center">
                   <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center mb-6 text-gold-500">
                     <val.icon className="w-6 h-6" />
                   </div>
                   <h4 className="heading-serif text-xl text-white mb-3">{val.title}</h4>
                   <p className="text-gray-400 text-sm leading-relaxed">{val.text}</p>
                </Reveal>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}

