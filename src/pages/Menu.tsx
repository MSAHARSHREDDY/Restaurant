import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMenuCategories, getMenuItems } from "../api/client";
import { Reveal } from "../components/Reveal";
import { Clock, Flame, Loader2, Search } from "lucide-react";
import { cn } from "../utils/cn";
import { useCart } from "../context/CartContext";

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();

  const { data: categories, isLoading: isCatsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getMenuCategories,
  });

  const { data: items, isLoading: isItemsLoading } = useQuery({
    queryKey: ['items', activeCategory],
    queryFn: () => getMenuItems(activeCategory),
  });

  // Client-side search filtration
  const filteredItems = items?.filter((item: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  }) || [];

  return (
    <div className="pt-32 pb-32 min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <h2 className="text-gold-500 text-sm tracking-[0.2em] uppercase mb-4">First Class Cuisine</h2>
          <h1 className="heading-serif text-5xl md:text-6xl text-white">In-Flight Menu</h1>
        </Reveal>

        {/* Search Bar Component */}
        <Reveal delay={0.1} className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search gourmet dishes or profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-900/60 border border-white/10 rounded-full pl-11 pr-12 py-3 text-sm text-white focus:border-gold-500 outline-none transition-all placeholder-gray-500 shadow-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500 hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </Reveal>

        {/* Categories Tab */}
        <Reveal delay={0.2} className="flex flex-wrap justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-6 py-2 rounded-full border text-sm uppercase tracking-wider transition-all cursor-pointer",
              activeCategory === "all"
                ? "bg-gold-500 text-dark-950 border-gold-500 font-semibold"
                : "border-white/20 text-gray-300 hover:border-gold-500 hover:text-gold-500"
            )}
          >
            All Items
          </button>
          
          {isCatsLoading ? (
             <div className="flex gap-4">
               {[1,2,3].map(i => <div key={i} className="w-24 h-10 bg-white/5 rounded-full animate-pulse" />)}
             </div>
          ) : (
             categories?.map((cat: any) => (
               <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-6 py-2 rounded-full border text-sm uppercase tracking-wider transition-all cursor-pointer",
                    activeCategory === cat.id
                      ? "bg-gold-500 text-dark-950 border-gold-500 font-semibold"
                      : "border-white/20 text-gray-300 hover:border-gold-500 hover:text-gold-500"
                  )}
                >
                  {cat.name}
                </button>
             ))
          )}
        </Reveal>

        {/* Menu Grid */}
        {isItemsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-white/5" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-white/5 w-3/4 rounded" />
                    <div className="h-4 bg-white/5 w-full rounded" />
                    <div className="h-4 bg-white/5 w-1/2 rounded" />
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-20 text-center text-gray-400 font-mono text-sm max-w-md mx-auto bg-dark-900/40 border border-white/5 p-8 rounded-2xl">
                <p className="text-gray-300 font-serif text-lg mb-2">No Cuisine Matches Found</p>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">No gourmet configurations listed on the current flight match your search criteria. Try adjusting your query search terms.</p>
              </div>
            ) : (
              filteredItems.map((item: any, i: number) => (
                <Reveal key={item.id} delay={i * 0.1}>
                  <div className="relative group p-[1px] rounded-[17px] h-full overflow-hidden">
                    {/* Animated Glowing Border Component */}
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-gradient-to-r group-hover:from-gold-600 group-hover:via-gold-400 group-hover:to-gold-600 bg-[length:200%_auto] transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:animate-[gradient-xy_2s_linear_infinite]" />
                    
                    {/* Inner Content Card */}
                    <div className="relative bg-dark-900/95 backdrop-blur-3xl rounded-2xl overflow-hidden flex flex-col h-full z-10 transition-transform duration-500 group-hover:-translate-y-1 shadow-2xl group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                      
                      {/* Spotlight overlay effect inside the card */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />
                      
                      <div className="relative h-64 overflow-hidden shrink-0 cursor-pointer">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-dark-950/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-30">
                           <span className="text-gold-500 font-medium tracking-wide">₹{item.price}</span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow relative z-30">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="heading-serif text-xl text-white group-hover:text-gold-400 transition-colors cursor-pointer">{item.name}</h3>
                          {item.spicy && <Flame className="w-5 h-5 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
                        </div>
                        <p className="text-gray-400 font-light text-sm mb-6 flex-grow">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 relative">
                          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium tracking-wide">
                             <Clock className="w-4 h-4 text-gold-500" />
                             <span>{item.prepTime}</span>
                          </div>
                          <button 
                            onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                            className="text-gold-500 text-sm tracking-widest uppercase font-semibold hover:text-white transition-colors flex items-center gap-2 group-hover:gap-3 cursor-pointer"
                          >
                            <span>Add</span>
                            <span className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-dark-950 transition-colors ml-1">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

