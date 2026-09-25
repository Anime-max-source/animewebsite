import React from 'react'

export default function Loader({ size = 'md', text = 'Loading AnimeMax...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-slate-700 border-t-[#ff3366] border-r-[#8b5cf6] animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#ff3366] animate-ping"></div>
        </div>
      </div>
      {text && <p className="text-sm font-medium text-slate-400 tracking-wide">{text}</p>}
    </div>
  )
}
