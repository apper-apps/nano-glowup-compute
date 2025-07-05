import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/molecules/BottomNav'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout