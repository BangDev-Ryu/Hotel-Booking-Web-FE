import React from 'react'
import PropTypes from 'prop-types'

const BookingRoomCard = ({ title, description, price, image, amenities, maxOccupancy, size }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={image} alt={title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="mr-4">{maxOccupancy} Guests max</span>
              <span>{size} sq m</span>
            </div>
    
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center text-gray-500">
                {/* <Wifi className="h-5 w-5 mr-1" /> */}
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center text-gray-500">
                {/* <Coffee className="h-5 w-5 mr-1" /> */}
                <span>Breakfast</span>
              </div>
              <div className="flex items-center text-gray-500">
                {/* <Ban className="h-5 w-5 mr-1" /> */}
                <span>No Smoking</span>
              </div>
            </div>
    
            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">${price}</span>
                <span className="text-gray-500 ml-2">per night</span>
              </div>
              <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Book Now
              </button>
            </div>
          </div>
        </div>
      );
}

BookingRoomCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    amenities: PropTypes.arrayOf(PropTypes.string).isRequired,
    maxOccupancy: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired
}

export default BookingRoomCard