"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  onEnquireClick?: () => void;
}

const navLinks = [
  { label: "The Stay", href: "#stay" },
  { label: "Experience", href: "/experience" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

export default function Navigation({ onEnquireClick }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 sm:px-10 py-6 sm:py-8 pb-12 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
      >
        {/* Brand + desktop nav */}
        <div className="flex items-center space-x-12">
          <span className="text-xs tracking-[0.4em] font-bold uppercase text-on-surface">
            Nature Kingdom
          </span>
          <nav className="hidden lg:flex space-x-8">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[10px] tracking-[0.3em] uppercase text-[#F4E7D6] hover:text-[#e9c349] transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#e9c349] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
        </div>

        {/* Right cluster */}
        <div className="flex items-center space-x-4 sm:space-x-8">
          <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] font-mono text-on-surface/60">
            Chikkamagaluru — 13.31° N, 75.77° E
          </span>
          <button
            onClick={onEnquireClick}
            className="hidden lg:inline-flex btn-editorial px-6 py-2.5 text-[10px] tracking-[0.3em] uppercase text-[#e9c349]"
          >
            Enquire
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-on-surface"
            aria-label="Open navigation menu"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-y-auto"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-7 flex-shrink-0">
              <span className="text-xs tracking-[0.4em] font-bold uppercase text-[#F4E7D6]">
                Nature Kingdom
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-[#F4E7D6]/50 hover:text-[#F4E7D6] transition-colors"
                aria-label="Close navigation"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mx-6 h-px bg-[#C8A97E]/15" />

            {/* Nav links */}
            <nav className="flex flex-col px-6 pt-6 flex-1" aria-label="Mobile navigation">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-baseline justify-between py-5 border-b border-white/5 text-[#F4E7D6]/70 hover:text-[#C8A97E] transition-colors duration-300"
                >
                  <span className="font-headline text-[1.9rem] leading-tight tracking-tight">
                    {item.label}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] font-mono text-[#F4E7D6]/20 group-hover:text-[#C8A97E]/40 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.a>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06 + 0.1, duration: 0.4 }}
                onClick={() => { onEnquireClick?.(); setMobileOpen(false); }}
                className="mt-10 self-start border border-[#C8A97E]/30 px-8 py-4 text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] hover:border-[#C8A97E]/70 hover:bg-[#C8A97E]/5 transition-all duration-300"
              >
                Enquire Now
              </motion.button>
            </nav>

            {/* Bottom coordinates */}
            <div className="px-6 py-8 flex-shrink-0">
              <p className="text-[9px] tracking-[0.22em] font-mono text-[#F4E7D6]/20 uppercase">
                Chikkamagaluru — 13.31° N, 75.77° E
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
