import React from 'react'

const BookingHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span 
              className="text-2xl font-semibold text-gray-900 cursor-pointer" 
            >
              Hotel Aiko
            </span>
          </div>
          <nav className="flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600">My Bookings</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Sign In</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default BookingHeader