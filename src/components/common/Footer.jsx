import React from 'react'
import { Link } from 'react-router-dom'
import { Flame, MessageSquare, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react'
import { OWNER_WHATSAPP } from '../../lib/clerkClient'

export default function Footer() {
  return (
    <footer className="bg-[#07090e] border-t border-slate-800/80 text-slate-400 mt-20">
      {/* Trust guarantees banner */}
      <div className="border-b border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-[#ff3366] flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">100% Authentic Merch</h4>
                <p className="text-xs text-slate-400 mt-0.5">Licensed scale figures & premium apparel</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Safe All-India Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dispatched within 24 hours with bubble wrap</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">WhatsApp UPI Payment</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pay via GPay, PhonePe, Paytm after QR sent</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0c14] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#ff3366]" />
                </div>
              </div>
              <span className="text-xl font-extrabold anime-gradient-text font-display">
                ANIME<span className="text-white">MAX</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's dedicated destination for premium anime statues, authentic apparel, oversized wall scrolls, and collector accessories.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent('Hi AnimeMax! I have a question about merchandise.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Owner on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/?category=figures" className="hover:text-rose-400 transition-colors">Anime Scale Figures</Link></li>
              <li><Link to="/?category=clothing" className="hover:text-rose-400 transition-colors">Hoodies & Cloaks</Link></li>
              <li><Link to="/?category=posters" className="hover:text-rose-400 transition-colors">Holographic Wall Scrolls</Link></li>
              <li><Link to="/?category=accessories" className="hover:text-rose-400 transition-colors">Katanas & Music Boxes</Link></li>
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">How To Order</h4>
            <ol className="space-y-2 text-xs text-slate-400 list-decimal list-inside">
              <li>Add items to cart & checkout</li>
              <li>No upfront card needed</li>
              <li>Receive UPI QR on WhatsApp</li>
              <li>Pay via GPay / PhonePe / Paytm</li>
              <li>Receive live dispatch tracking</li>
            </ol>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-display">Owner Contact</h4>
            <p className="text-xs text-slate-400 mb-2">
              Orders and queries are personally managed by the shopkeeper.
            </p>
            <p className="text-xs text-slate-300 font-mono">WhatsApp: {OWNER_WHATSAPP}</p>
            <p className="text-xs text-slate-300 font-mono mt-1">UPI: animemax@upi</p>

          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AnimeMax Store. Designed for anime fans.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for Otaku culture</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
