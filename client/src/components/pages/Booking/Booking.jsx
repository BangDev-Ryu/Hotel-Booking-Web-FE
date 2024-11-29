import React from 'react'

const Booking = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <Hotel className="h-8 w-8 text-blue-600" /> */}
            <span className="text-2xl font-semibold text-gray-900">LuxStay Hotels</span>
          </div>
          <nav className="flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">My Bookings</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">USD</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Sign In</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Booking