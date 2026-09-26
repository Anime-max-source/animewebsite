import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import HelpModal from './HelpModal'
import { X } from 'lucide-react'

export default function AdminLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#F5F6F8] text-[#111827] font-sans antialiased">
      {/* Desktop Fixed Left Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col">
            <div className="flex justify-end p-2 border-b border-[#EDEDED]">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AdminSidebar 
                isCollapsed={false}
                onOpenHelp={() => {
                  setMobileSidebarOpen(false)
                  setIsHelpOpen(true)
                }}
                onMobileClose={() => setMobileSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Column: Top Bar + Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F5F6F8]">
        <AdminTopBar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Help & Support Modal */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
    </div>
  )
}
