import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, ChatCircle, Heart } from '@phosphor-icons/react'
import { OWNER_WHATSAPP } from '../../lib/clerkClient'
import AnimaxLogo from './AnimaxLogo'

export default function StorefrontFooter() {
  return (
    <footer
      className="mt-12 bg-[#F8F8F6] border border-[#E5E5E5] rounded-[12px] p-6 sm:p-8"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >

      {/* ── Guarantees Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#E5E5E5]">
        <div className="flex items-center gap-3 p-4 rounded-[12px] bg-white border border-[#E5E5E5]">
          <div className="w-10 h-10 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-[#111111]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111111]">Quality Assured</h4>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Curated collectible merchandise</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-[12px] bg-white border border-[#E5E5E5]">
          <div className="w-10 h-10 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
            <Truck size={20} className="text-[#111111]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111111]">Safe All-India Shipping</h4>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Dispatched in 24h with protective packaging</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-[12px] bg-white border border-[#E5E5E5]">
          <div className="w-10 h-10 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
            <ChatCircle size={20} className="text-[#111111]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#111111]">WhatsApp UPI Payment</h4>
            <p className="text-xs text-[#6B6B6B] mt-0.5">Pay via GPay, PhonePe or Paytm</p>
          </div>
        </div>
      </div>

      {/* ── Footer Links ────────────────────────────────────────────────── */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">

        {/* Brand */}
        <div className="space-y-3">
          <AnimaxLogo className="text-xl" />
          <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-[45ch]">
            India's dedicated destination for premium anime statues, authentic apparel, and collector merchandise.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h5 className="font-semibold text-[#111111] mb-3 text-xs uppercase tracking-widest">Collections</h5>
          <ul className="space-y-2 text-xs text-[#6B6B6B]">
            <li><Link to="/?category=figures" className="hover:text-[#DC2626] transition-colors">Scale Figures &amp; Statues</Link></li>
            <li><Link to="/?category=clothing" className="hover:text-[#DC2626] transition-colors">Hoodies &amp; Tapestry Cloaks</Link></li>
            <li><Link to="/?category=posters" className="hover:text-[#DC2626] transition-colors">Holographic Wall Scrolls</Link></li>
            <li><Link to="/?category=accessories" className="hover:text-[#DC2626] transition-colors">Replica Katanas &amp; Props</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="font-semibold text-[#111111] mb-3 text-xs uppercase tracking-widest">Customer Support</h5>
          <p className="text-xs text-[#6B6B6B] mb-3 leading-relaxed">
            Have a question about an order or restock?
          </p>
          <a
            href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent('Hi AnimeMax! I have a question about merchandise.')}`}
            target="_blank"
            rel="noreferrer"
            className="sf-btn-secondary text-xs h-9 px-4 inline-flex items-center gap-2"
            style={{ height: '36px', minHeight: 'unset', fontSize: '12px' }}
          >
            <ChatCircle size={16} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Account */}
        <div>
          <h5 className="font-semibold text-[#111111] mb-3 text-xs uppercase tracking-widest">Account</h5>
          <ul className="space-y-2 text-xs text-[#6B6B6B]">
            <li><Link to="/signin" className="hover:text-[#DC2626] transition-colors">Sign In</Link></li>
            <li><Link to="/signup" className="hover:text-[#DC2626] transition-colors">Create Account</Link></li>
            <li><Link to="/orders" className="hover:text-[#DC2626] transition-colors">Order History</Link></li>
            <li><Link to="/account" className="hover:text-[#DC2626] transition-colors">My Profile</Link></li>
          </ul>
        </div>
      </div>

      {/* ── Copyright ───────────────────────────────────────────────────── */}
      <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B6B] gap-2">
        <p>© {new Date().getFullYear()} AnimeMax Store. Designed for anime fans.</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart size={12} className="text-[#DC2626] fill-[#DC2626] inline" weight="fill" />
          <span>for otaku culture</span>
        </div>
      </div>

    </footer>
  )
}
