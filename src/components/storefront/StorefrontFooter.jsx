import React from 'react'
import { Link } from 'react-router-dom'
import { Flame, ShieldCheck, Truck, MessageSquare, Heart } from 'lucide-react'
import { OWNER_WHATSAPP } from '../../lib/clerkClient'

export default function StorefrontFooter() {
  return (
    <footer className="mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-black/5 text-[#6B6B6B]">
      
      {/* Guarantees Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-[#C9E4C5] flex items-center justify-center text-[#111111] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111]">100% Authentic Merch</h4>
            <p className="text-[11px] text-[#6B6B6B]">Official Tokyo imported scale figures</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-[#F5E7A8] flex items-center justify-center text-[#111111] flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111]">Safe All-India Shipping</h4>
            <p className="text-[11px] text-[#6B6B6B]">Dispatched in 24h with armored bubble wrap</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-[#E3EFE1] flex items-center justify-center text-[#111111] flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111111]">WhatsApp UPI Payment</h4>
            <p className="text-[11px] text-[#6B6B6B]">Pay securely via GPay, PhonePe or Paytm</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#111111] flex items-center justify-center text-white">
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <span className="font-black text-sm text-[#111111] font-display">AnimeMax</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
            India's dedicated destination for premium anime statues, authentic apparel, and collector merchandise.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-bold text-[#111111] mb-2 uppercase text-[10px] tracking-wider">Collections</h5>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link to="/?category=figures" className="hover:text-[#111111] transition-colors">Scale Figures & Statues</Link></li>
            <li><Link to="/?category=clothing" className="hover:text-[#111111] transition-colors">Hoodies & Tapestry Cloaks</Link></li>
            <li><Link to="/?category=posters" className="hover:text-[#111111] transition-colors">Holographic Wall Scrolls</Link></li>
            <li><Link to="/?category=accessories" className="hover:text-[#111111] transition-colors">Replica Katanas & Props</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="font-bold text-[#111111] mb-2 uppercase text-[10px] tracking-wider">Customer Support</h5>
          <p className="text-[11px] mb-2">Have a question about an order or restock?</p>
          <a
            href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent('Hi AnimeMax! I have a question about merchandise.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Store Admin shortcut */}
        <div>
          <h5 className="font-bold text-[#111111] mb-2 uppercase text-[10px] tracking-wider">Store Admin</h5>
          <p className="text-[11px] mb-2">Shopkeeper & inventory management portal</p>
          <Link
            to="/admin"
            className="text-[11px] font-bold text-[#111111] hover:underline"
          >
            Open Admin Dashboard →
          </Link>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6B6B] gap-2">
        <p>© {new Date().getFullYear()} AnimeMax Store. Designed for anime fans.</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>for otaku culture</span>
        </div>
      </div>

    </footer>
  )
}
