import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  MoreVertical, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  ArrowUpRight, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatPrice } from '../../utils/formatPrice'

export default function Dashboard() {
  const { products, orders } = useApp()
  const [dateRange, setDateRange] = useState('Today')
  const [salesFilter, setSalesFilter] = useState('Monthly')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredBar, setHoveredBar] = useState(null)

  // Calculations
  const totalProducts = products.length
  const inStockProducts = products.filter((p) => p.in_stock && p.stock > 0).length
  const stockHealthRatio = totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 100

  // Revenue & Orders
  const confirmedOrders = orders.filter((o) => o.status === 'payment_confirmed' || o.status === 'shipped')
  const totalRevenue = confirmedOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0)
  const totalOrdersCount = orders.length
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / (confirmedOrders.length || 1)) : 0

  // Status breakdown
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const confirmedCount = orders.filter((o) => o.status === 'payment_confirmed').length
  const shippedCount = orders.filter((o) => o.status === 'shipped').length
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length

  const totalStatusOrders = totalOrdersCount || 1
  const pendingPct = Math.round((pendingOrders / totalStatusOrders) * 100)
  const confirmedPct = Math.round((confirmedCount / totalStatusOrders) * 100)
  const shippedPct = Math.round((shippedCount / totalStatusOrders) * 100)
  const cancelledPct = Math.round((cancelledCount / totalStatusOrders) * 100)

  // Dot matrix configuration (4 rows x 8 columns = 32 dots)
  const totalDots = 32
  const filledDotsCount = Math.round((stockHealthRatio / 100) * totalDots)

  // Monthly Sales Bar Chart Data
  const monthlyData = [
    { month: 'Jun', amount: 14200, orders: 12 },
    { month: 'Jul', amount: 18900, orders: 15 },
    { month: 'Aug', amount: 16500, orders: 14 },
    { month: 'Sept', amount: 22400, orders: 19 },
    { month: 'Oct', amount: 21100, orders: 18 },
    { month: 'Nov', amount: 28300, orders: 24 },
    { month: 'Dec', amount: 34890, orders: 31, isCurrent: true },
  ]

  const maxBarAmount = 38000

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-12">
      
      {/* 1. Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input Pill */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search products, orders, buyers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-full pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#8A8A8A] shadow-sm focus:outline-none focus:border-[#111111] transition-all"
          />
          <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3" />
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Notification Bell with Badge */}
          <Link
            to="/admin/orders"
            className="relative p-2.5 rounded-full bg-white border border-slate-200/80 text-[#111111] hover:bg-slate-50 transition-colors shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingOrders > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#D6FF4A] text-black border-2 border-white rounded-full text-[9px] font-black flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </Link>

          {/* Quick Add Product Button */}
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Add Product</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#D6FF4A]" />
          </Link>
        </div>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-display">
            Shop Overview
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1 font-medium">
            Track your store's performance today.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative inline-block self-start sm:self-auto">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none bg-white border border-slate-200/80 text-xs font-semibold text-[#111111] rounded-full pl-4 pr-9 py-2 shadow-sm focus:outline-none focus:border-[#111111] cursor-pointer"
          >
            <option value="Today">Today ▾</option>
            <option value="This Week">This Week ▾</option>
            <option value="This Month">This Month ▾</option>
            <option value="All Time">All Time ▾</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 3. Stat Cards (Top Row — 3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Revenue Today */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#D6FF4A]/30 flex items-center justify-center text-black">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <button className="text-[#8A8A8A] hover:text-[#111111] p-1 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-display">
                {formatPrice(totalRevenue)}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#D6FF4A] text-black">
                +12%
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] font-medium">
              Revenue {dateRange} • vs. previous period
            </p>
          </div>
        </div>

        {/* Card 2: Orders Today */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#B8A4FF]/30 flex items-center justify-center text-black">
              <ShoppingBag className="w-5 h-5 text-black" />
            </div>
            <button className="text-[#8A8A8A] hover:text-[#111111] p-1 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-display">
                {totalOrdersCount}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#D6FF4A] text-black">
                +8%
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] font-medium">
              Orders {dateRange} • AOV: <strong className="text-[#111111]">{formatPrice(aov)}</strong>
            </p>
          </div>
        </div>

        {/* Card 3: Stock Health (Dot Matrix Grid) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-black">
              <Package className="w-5 h-5 text-[#111111]" />
            </div>
            <button className="text-[#8A8A8A] hover:text-[#111111] p-1 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-display">
                  {stockHealthRatio}%
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#D6FF4A] text-black">
                  Healthy
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] font-medium">
                Stock Health • {inStockProducts}/{totalProducts} Active
              </p>
            </div>

            {/* Dot-matrix Grid Visual (4 rows x 8 cols) */}
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#F5F5F3] rounded-xl shrink-0" title={`${stockHealthRatio}% items in stock`}>
              {Array.from({ length: totalDots }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx < filledDotsCount
                      ? 'bg-[#D6FF4A] shadow-[0_0_4px_rgba(214,255,74,0.6)]'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Order Status Breakdown (Nested Circle Chart & Progress Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Nested Circles Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#111111]">Order Status Breakdown</h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">Distribution across fulfillment stages</p>
            </div>
            <span className="text-xs font-semibold text-[#8A8A8A] bg-[#F5F5F3] px-2.5 py-1 rounded-full">
              {totalOrdersCount} Total
            </span>
          </div>

          {/* Large Nested / Overlapping Colored Circles SVG */}
          <div className="relative flex items-center justify-center py-4">
            <svg className="w-56 h-56" viewBox="0 0 200 200">
              {/* Outer circle: Lavender for Shipped */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="#B8A4FF"
                fillOpacity="0.85"
                className="transition-all hover:scale-105 transform origin-center"
              />
              
              {/* Middle circle: Near-black for Payment Confirmed */}
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="#111111"
                className="transition-all hover:scale-105 transform origin-center"
              />

              {/* Inner circle: Lime Green for Pending QR */}
              <circle
                cx="100"
                cy="100"
                r="35"
                fill="#D6FF4A"
                className="transition-all hover:scale-105 transform origin-center"
              />

              {/* Center text */}
              <text
                x="100"
                y="96"
                textAnchor="middle"
                fontSize="12"
                fontWeight="900"
                fill="#111111"
                fontFamily="sans-serif"
              >
                {pendingOrders}
              </text>
              <text
                x="100"
                y="110"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#555555"
                letterSpacing="0.5"
                fontFamily="sans-serif"
              >
                PENDING
              </text>
            </svg>
          </div>

          {/* Mini Legend */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D6FF4A]" />
              <span className="text-[#111111]">Pending ({pendingOrders})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
              <span className="text-[#111111]">Confirmed ({confirmedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8A4FF]" />
              <span className="text-[#111111]">Shipped ({shippedCount})</span>
            </div>
          </div>
        </div>

        {/* Right: Horizontal Progress Bars */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#111111]">Fulfillment Pipeline</h2>
            <p className="text-xs text-[#8A8A8A] mt-0.5">Real-time status progression of placed orders</p>
          </div>

          <div className="space-y-4">
            {/* 1. Pending */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D6FF4A]" />
                  <span className="text-[#111111]">Pending QR</span>
                </div>
                <span className="text-[#111111] font-mono">{pendingPct}% ({pendingOrders})</span>
              </div>
              <div className="w-full h-3 bg-[#F5F5F3] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#D6FF4A] rounded-full transition-all duration-700"
                  style={{ width: `${pendingPct}%` }}
                />
              </div>
            </div>

            {/* 2. Confirmed */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#111111]" />
                  <span className="text-[#111111]">Payment Confirmed</span>
                </div>
                <span className="text-[#111111] font-mono">{confirmedPct}% ({confirmedCount})</span>
              </div>
              <div className="w-full h-3 bg-[#F5F5F3] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#111111] rounded-full transition-all duration-700"
                  style={{ width: `${confirmedPct}%` }}
                />
              </div>
            </div>

            {/* 3. Shipped */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8A4FF]" />
                  <span className="text-[#111111]">Dispatched / Shipped</span>
                </div>
                <span className="text-[#111111] font-mono">{shippedPct}% ({shippedCount})</span>
              </div>
              <div className="w-full h-3 bg-[#F5F5F3] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#B8A4FF] rounded-full transition-all duration-700"
                  style={{ width: `${shippedPct}%` }}
                />
              </div>
            </div>

            {/* 4. Cancelled */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8A8A8A]" />
                  <span className="text-[#8A8A8A]">Cancelled</span>
                </div>
                <span className="text-[#8A8A8A] font-mono">{cancelledPct}% ({cancelledCount})</span>
              </div>
              <div className="w-full h-3 bg-[#F5F5F3] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#8A8A8A] rounded-full transition-all duration-700"
                  style={{ width: `${cancelledPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-[#8A8A8A]">Need to send UPI QRs?</span>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* 5. Sales Analysis Panel (Bottom, Full Width) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#111111]">Sales Analysis</h2>
            
            {/* Two headline stats with colored square markers */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[3px] bg-[#D6FF4A]" />
                <span className="font-bold text-[#111111]">92% Orders Fulfilled</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-[3px] bg-[#B8A4FF]" />
                <span className="font-bold text-[#111111]">₹18,400 Avg Monthly Revenue</span>
              </div>
            </div>
          </div>

          {/* Monthly Filter Dropdown */}
          <div className="relative inline-block self-start sm:self-auto">
            <select
              value={salesFilter}
              onChange={(e) => setSalesFilter(e.target.value)}
              className="appearance-none bg-[#F5F5F3] border border-slate-200 text-xs font-semibold text-[#111111] rounded-full pl-4 pr-8 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="Monthly">Monthly ▾</option>
              <option value="Quarterly">Quarterly ▾</option>
              <option value="Yearly">Yearly ▾</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Bar Chart SVG */}
        <div className="pt-4">
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
              <defs>
                {/* Diagonal subtle stripes pattern for muted bars */}
                <pattern id="diagonalStripes" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#262626" strokeWidth="2.5" />
                  <line x1="0" y1="0" x2="6" y2="0" stroke="#161616" strokeWidth="2.5" />
                </pattern>
              </defs>

              {/* Grid guide lines */}
              <line x1="40" y1="30" x2="680" y2="30" stroke="#F0F0EE" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="80" x2="680" y2="80" stroke="#F0F0EE" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="130" x2="680" y2="130" stroke="#F0F0EE" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="180" x2="680" y2="180" stroke="#F0F0EE" strokeWidth="1" />

              {/* Y-axis labels */}
              <text x="30" y="34" textAnchor="end" fontSize="10" fill="#8A8A8A">₹40k</text>
              <text x="30" y="84" textAnchor="end" fontSize="10" fill="#8A8A8A">₹25k</text>
              <text x="30" y="134" textAnchor="end" fontSize="10" fill="#8A8A8A">₹15k</text>
              <text x="30" y="184" textAnchor="end" fontSize="10" fill="#8A8A8A">₹0</text>

              {/* Bars */}
              {monthlyData.map((item, idx) => {
                const barWidth = 44
                const gap = 85
                const x = 75 + idx * gap
                const barHeight = Math.round((item.amount / maxBarAmount) * 150)
                const y = 180 - barHeight

                if (item.isCurrent) {
                  // Standout two-tone bar: top half lime-green (#D6FF4A), bottom half lavender (#B8A4FF)
                  const halfHeight = barHeight / 2
                  return (
                    <g 
                      key={item.month} 
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredBar(item)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Lavender Bottom Half */}
                      <rect
                        x={x}
                        y={y + halfHeight}
                        width={barWidth}
                        height={halfHeight}
                        fill="#B8A4FF"
                      />
                      {/* Lime-Green Top Half with rounded top corners */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={halfHeight}
                        rx="8"
                        ry="8"
                        fill="#D6FF4A"
                        className="transition-all group-hover:brightness-105"
                      />
                      {/* Current Month Highlight Badge */}
                      <rect
                        x={x - 8}
                        y={y - 24}
                        width={barWidth + 16}
                        height="18"
                        rx="9"
                        fill="#111111"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={y - 12}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#D6FF4A"
                      >
                        {formatPrice(item.amount)}
                      </text>
                      {/* Month Label */}
                      <text
                        x={x + barWidth / 2}
                        y="204"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#111111"
                      >
                        {item.month}
                      </text>
                    </g>
                  )
                }

                // Regular Muted Striped Dark Bar
                return (
                  <g 
                    key={item.month} 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredBar(item)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="8"
                      ry="8"
                      fill="url(#diagonalStripes)"
                      stroke="#222222"
                      strokeWidth="1"
                      className="transition-all group-hover:opacity-80"
                    />
                    {/* Month Label */}
                    <text
                      x={x + barWidth / 2}
                      y="204"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="500"
                      fill="#8A8A8A"
                    >
                      {item.month}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredBar && (
              <div className="absolute top-2 right-4 p-3 bg-[#111111] text-white rounded-xl shadow-xl text-xs space-y-0.5 pointer-events-none">
                <p className="font-bold text-[#D6FF4A]">{hoveredBar.month} Performance</p>
                <p>Revenue: <strong>{formatPrice(hoveredBar.amount)}</strong></p>
                <p className="text-[11px] text-[#8A8A8A]">{hoveredBar.orders} orders processed</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
