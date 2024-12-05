import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BookingRoomCard = ({ title, price, image, onClick, onBookNow }) => {
    return (
        <div className="bg-white rounded-lg shadow-md cursor-pointer flex" onClick={onClick}>
          <img 
            src={`${image}`} 
            alt={title} 
            className="w-full h-64 object-cover hover:opacity-80" 
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            
            <div className="mt-6 flex items-center justify-between flex-col">
              <div>
                <span className="text-xl font-bold text-gray-900">{price.toLocaleString("vi-VN") + "đ"}</span>
                <span className="text-gray-500 ml-2">/ đêm</span>
              </div>
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn sự kiện onClick của thẻ cha
                  onBookNow();
                }}
              >
                Thêm phòng
              </button>
            </div>
          </div>
        </div>
      );
}

BookingRoomCard.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
}

export default BookingRoomCard