import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md w-full">
      {/* Desktop / large */}
      <div className="hidden lg:flex justify-center items-center w-full mx-auto px-8 py-3 gap-5 md:gap-8">
        <div className="flex items-center gap-8 w-full max-w-6xl">
          <Link to="/" className="text-3xl font-bold text-purple-600">
            Eventify
          </Link>

          <div className="flex-1 border-[2px] border-gray-300 rounded-full">
            <input
              type="text"
              placeholder="Search Events..."
              className="py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-full"
            />
          </div>

          <div className="flex items-center gap-8 text-sm lg:text-base xl:text-lg font-semibold">
            <NavLink to="/events" className={({ isActive }) => isActive ? "text-purple-600" : "hover:text-purple-600"}>
              Find Events
            </NavLink>

            <NavLink to="/create-event" className={({ isActive }) => isActive ? "text-purple-600" : "hover:text-purple-600"}>
              Create Event
            </NavLink>

            <Link to="/login" className="hover:text-purple-600 whitespace-nowrap">Login</Link>
            <Link to="/register" className="hover:text-purple-600 whitespace-nowrap">Sign-Up</Link>
          </div>
        </div>
      </div>

      {/* Medium */}
      <div className="hidden md:flex lg:hidden justify-center items-center w-full mx-auto px-6 py-2 gap-5">
        <div className="flex items-center w-full max-w-4xl gap-4">
          <Link to="/" className="text-xl font-bold text-purple-600">Eventify</Link>

          <div className="flex-1 border-[2px] border-gray-300 rounded-full">
            <input
              type="text"
              placeholder="Search Events..."
              className="py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-full"
            />
          </div>

          <div className="flex gap-6 font-semibold">
            <Link to="/login" className="hover:text-purple-600">Login</Link>
            <Link to="/register" className="hover:text-purple-600">Register</Link>
            <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl text-purple-600">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
             {menuOpen && (
          <div className="absolute right-0 top-10 mt-3 bg-white rounded-lg shadow p-4 text-center space-y-3">
            <NavLink to="/events" onClick={() => setMenuOpen(false)} className="flex items-center justify-start hover:text-purple-600">Find Events</NavLink>
            <NavLink to="/create-event" onClick={() => setMenuOpen(false)} className="block hover:text-purple-600">Create Event</NavLink>
          </div>
        )}

            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col items-center mx-auto px-6 py-2">
        <div className="w-full flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-purple-600">Eventify</Link>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm hover:text-purple-600">Login</Link>
            <Link to="/register" className="text-sm hover:text-purple-600">Sign-Up</Link>
            <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-purple-600">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
            
             {menuOpen && (
          <div className="absolute right-0 top-10 mt-3 bg-white rounded-lg shadow p-4 text-center space-y-3">
            <NavLink to="/events" onClick={() => setMenuOpen(false)} className="flex items-center justify-start hover:text-purple-600">Find Events</NavLink>
            <NavLink to="/create-event" onClick={() => setMenuOpen(false)} className="flex items-center justify-start hover:text-purple-600">Create Event</NavLink>
          </div>
        )}
            </div>
          </div>
        </div>

        <div className="w-full mt-3 border-[2px] border-gray-300 rounded-full">
          <input
            type="text"
            placeholder="Search Events..."
            className="py-2 px-6 w-full focus:outline-none focus:ring-2 focus:ring-purple-600 rounded-full"
          />
        </div>

        {/* Mobile slide-down menu */}
        {/* {menuOpen && (
          <div className="w-full mt-3 bg-white rounded-lg shadow p-4 text-center space-y-3">
            <NavLink to="/events" onClick={() => setMenuOpen(false)} className="block hover:text-purple-600">Find Events</NavLink>
            <NavLink to="/create-event" onClick={() => setMenuOpen(false)} className="block hover:text-purple-600">Create Event</NavLink>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
