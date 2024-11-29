import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingHeader from '../../layout/BookingHeader/BookingHeader'
import BookingBanner from '../../layout/BookingBanner/BookingBanner'
import BookingSearchBar from '../../layout/BookingSearchBar/BookingSearchBar'
import BookingRoomCard from '../../layout/BookingRoomCard/BookingRoomCard';

const rooms = [
  {
    title: "Deluxe King Room",
    description: "Spacious room with city view and premium amenities",
    price: 175,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    amenities: ["Free WiFi", "Breakfast", "Non-smoking"],
    maxOccupancy: 2,
    size: 40
  },
  {
    title: "Premium Suite",
    description: "Luxury suite with separate living area and panoramic views",
    price: 300,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    amenities: ["Free WiFi", "Breakfast", "Non-smoking"],
    maxOccupancy: 3,
    size: 65
  },
  {
    title: "Executive Club Room",
    description: "Access to exclusive club lounge with premium services",
    price: 250,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    amenities: ["Free WiFi", "Breakfast", "Non-smoking"],
    maxOccupancy: 2,
    size: 45
  }
];

const Booking = () => {
  return (
    <>
      <BookingHeader/>
      <BookingBanner/>
      <BookingSearchBar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <BookingRoomCard key={index} {...room} />
          ))}
        </div>
      </main>
    </>
  )
}

export default Booking