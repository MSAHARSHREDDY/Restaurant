import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../components/Reveal";
import { ArrowRight, Star, Quote, Utensils, PlaneTakeoff, Trophy, Clock, Bell, Flame } from "lucide-react";
import { useRef } from "react";

export function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="w-full">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-dark-950/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2500&auto=format&fit=crop"
            alt="Aircraft interior during flight"
            className="w-full h-full object-cover object-center scale-110"
          />
        </motion.div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <Reveal direction="down" duration={1}>
            <p className="text-gold-500 tracking-[0.3em] uppercase text-sm md:text-base font-semibold mb-6">
              Welcome Aboard
            </p>
          </Reveal>
          <Reveal delay={0.2} duration={1.2}>
            <h1 className="heading-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Elevate Your <br />
              <span className="italic text-gold-400">Dining</span> Experience
            </h1>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-light mb-10 leading-relaxed">
              Experience the luxury of first-class aviation dining without leaving the ground. A cinematic journey of flavors awaits you.
            </p>
          </Reveal>
          <Reveal delay={0.6} direction="up" className="flex items-center gap-6 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-gold-500 text-dark-950 hover:bg-gold-400 transition-all font-semibold uppercase tracking-wider text-sm flex items-center gap-2"
            >
              Reserve a Seat <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/menu"
              className="px-8 py-4 border border-white/20 text-white hover:bg-white/5 transition-all font-semibold uppercase tracking-wider text-sm backdrop-blur-md"
            >
              Explore Menu
            </Link>
          </Reveal>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold-500 to-transparent" />
        </motion.div>
      </section>

      {/* Feature / Why Choose Us Section */}
      <section className="py-32 relative z-20 layout-section bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal className="text-center mb-20">
            <h2 className="text-gold-500 text-sm tracking-[0.2em] uppercase mb-4">First Class Amenities</h2>
            <h3 className="heading-serif text-4xl md:text-5xl">The Captain's Promise</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: PlaneTakeoff, title: "Authentic Ambiance", desc: "Dine inside a meticulously reconstructed A380 cabin featuring premium leather seating and ambient lighting." },
              { icon: Utensils, title: "Michelin-Grade Menu", desc: "Our executive chef crafts exquisite global cuisines inspired by the finest international destinations." },
              { icon: Trophy, title: "Award-Winning Service", desc: "Experience attentive 'flight attendant' style service tailored to your every dining need." },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.2} direction="up">
                <div className="glass-panel p-10 rounded-2xl text-center group hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-gold-500" />
                  </div>
                  <h4 className="heading-serif text-2xl text-white mb-4">{feature.title}</h4>
                  <p className="text-gray-400 leading-relaxed font-light">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <motion.div style={{ y: y2 }} className="absolute inset-0">
          <div className="absolute inset-0 bg-dark-950/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1569154941061-e231b47fb261?q=80&w=2000&auto=format&fit=crop"
            alt="Window View"
            className="w-full h-full object-cover scale-125"
          />
        </motion.div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center glass-panel p-8 md:p-12 rounded-2xl mx-auto backdrop-blur-xl border-white/10">
              {[
                { number: "15k+", label: "Passengers Served" },
                { number: "50+", label: "Destinations Flavors" },
                { number: "12", label: "Expert Chefs" },
                { number: "4.9", label: "Average Rating" },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-gold-500 text-4xl md:text-5xl font-bold heading-serif mb-2">{stat.number}</div>
                  <div className="text-gray-300 text-sm tracking-widest uppercase">{stat.label}</div>
                </Reveal>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-32 relative z-20 bg-transparent border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <Reveal>
                <h2 className="text-gold-500 text-sm tracking-[0.2em] uppercase mb-4">In-Flight Menu Highlights</h2>
                <h3 className="heading-serif text-4xl md:text-5xl">Gourmet Selections</h3>
              </Reveal>
              <Reveal delay={0.2} direction="left">
                <Link to="/menu" className="text-gold-500 flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-wider text-sm font-medium">
                  View Full Menu <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: "Chicken Biryani", price: "₹280", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&auto=format&fit=crop" },
                { name: "Kadai Paneer", price: "₹190", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuZWVyfGVufDB8fDB8fHww" }
              ].map((dish, i) => (
                <Reveal key={i} delay={i * 0.2} className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer">
                  <img src={dish.img} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80" />
                  <div className="absolute bottom-0 inset-x-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-between items-center">
                      <h4 className="heading-serif text-2xl text-white">{dish.name}</h4>
                      <span className="text-gold-500 text-xl font-medium">{dish.price}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative z-20 bg-transparent">
         <div className="max-w-4xl mx-auto px-6 text-center">
           <Reveal>
             <Quote className="w-16 h-16 text-gold-500/20 mx-auto mb-8" />
             <p className="heading-serif text-2xl md:text-4xl text-white leading-relaxed mb-10">
               "The most unique dining experience I've ever had. From the moment you receive your 'boarding pass' to the impeccable service, KVR Flight transports you to a world of culinary luxury."
             </p>
             <div className="flex items-center justify-center gap-1 mb-4 text-gold-500">
               {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
             </div>
             <div className="text-gray-400 uppercase tracking-widest text-sm">— Sarah Jenkins, Food Critic</div>
           </Reveal>
         </div>
      </section>
    </div>
  );
}

