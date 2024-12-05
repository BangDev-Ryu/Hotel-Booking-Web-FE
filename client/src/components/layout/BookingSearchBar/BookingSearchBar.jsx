import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const BookingSearchBar = ({ onDateRangeChange, onOptionsChange }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
      adult: 1,
      children: 0,
      room: 1
    });
    const [dateRange, setDateRange] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    const [openDate, setOpenDate] = useState(false);

    const handleOption = (name, operation) => {
      setOptions((prev) => {return {
        ...prev, 
        [name]: operation === "+" ? options[name] + 1 : options[name] - 1

      }});
    }
  
    useEffect(() => {
      if (typeof onDateRangeChange === 'function') {
        onDateRangeChange(dateRange);
      }
      if (typeof onOptionsChange === 'function') {
        onOptionsChange(options);
      }
    }, [dateRange, options]);
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dates</label>
            <div className="mt-1 relative">
              <span
                onClick={() => setOpenDate(!openDate)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <CalendarMonthIcon/>
                {`Check in date: ${format(dateRange[0].startDate, "dd/MM/yyyy")} - Check out date: ${format(
                  dateRange[0].endDate,
                  "dd/MM/yyyy"
                )}`}
              </span>
              {openDate && (
                <div className="absolute top-full left-0 z-50">
                  <DateRange
                    editableDateInputs={true}
                    onChange={item => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    minDate={new Date()}
                    className="shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 relative">
            <label className="block text-sm font-medium text-gray-700">Guests</label>
            <div className="mt-1 relative">
              
              <span
                className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
                onClick={() => {setOpenOptions(!openOptions)}}
              >{`${options.adult} adult, ${options.children} children, ${options.room} room`}</span>

              { openOptions && <div className="block absolute w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="">Adult</span>
                  <div className="flex items-center">
                    <button className="border border-gray-300 px-2" disabled={options.adult <= 1} onClick={() => {handleOption("adult", "-")}}>-</button>
                    <span className="mx-2">{options.adult}</span>
                    <button className="border border-gray-300 px-2" onClick={() => {handleOption("adult", "+")}}>+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="">Children</span>
                  <div className="flex items-center">
                    <button className="border border-gray-300 px-2" disabled={options.children <= 0} onClick={() => {handleOption("children", "-")}}>-</button>
                    <span className="mx-2">{options.children}</span>
                    <button className="border border-gray-300 px-2" onClick={() => {handleOption("children", "+")}}>+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="">Room</span>
                  <div className="flex items-center">
                    <button className="border border-gray-300 px-2" disabled={options.room <= 1} onClick={() => {handleOption("room", "-")}}>-</button>
                    <span className="mx-2">{options.room}</span>
                    <button className="border border-gray-300 px-2" onClick={() => {handleOption("room", "+")}}>+</button>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
            <button className="mt-1 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Search
            </button>
          </div>
        </div>
      </div>
    );
}

export default BookingSearchBar