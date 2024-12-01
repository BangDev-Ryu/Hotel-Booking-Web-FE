import React from 'react'

const BookingBanner = () => {
  return (
    <div className="relative h-[500px]">
      <img
        src="/images/banners/banner1.jpg"
        alt="hotel aiko"
        className="w-full h-full object-cover z-50"
      />
      <div className="absolute inset-0 bg-opacity-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Experience Luxury Like Never Before
            </h1>
            <p className="mt-4 text-xl md:text-2xl max-w-2xl">
              Discover our handpicked selection of luxury hotels with exclusive amenities and world-class service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingBanner