import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import usericon from "../assets/user.png";
import locationicon from "../assets/pin.png";
import searchicon from "../assets/search (2).png";
import useAuth from './../hooks/useAuth.js';
import { useNavigate } from "react-router-dom";
import API from "../assets/api.js";

const Navbar2 = () => {
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [searchEvent,     setsearchEvent]     = useState("");
  const [searchLocation,  setsearchLocation]  = useState("");
  const { User } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/events?event=${searchEvent}&location=${searchLocation}`);
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // ✅ w-full instead of w-screen — fixes horizontal scrollbar
    <nav className="sticky top-0 z-50 flex items-center justify-center bg-white shadow-md w-full">

      {/* ── Desktop ── */}
      <div className="hidden lg:flex justify-center items-center h-full w-full px-8 py-3 gap-5">
        <div className="flex items-center gap-8 w-full h-full max-w-[1400px]">
          <Link to="/" className="text-3xl font-bold text-purple-600 flex-shrink-0">
            Eventify
          </Link>

          <div className="flex flex-1 border-[2px] border-gray-300 hover:border-purple-600 rounded-full overflow-hidden">
            <div className="flex items-center w-1/2">
              <img src={searchicon} className="w-5 h-5 ml-4 flex-shrink-0" />
              <input type="text" placeholder="Search by keyword only..."
                className="px-4 w-full rounded-full focus:outline-none text-sm"
                onChange={(e) => setsearchEvent(e.target.value)} />
            </div>
            <div className="w-px bg-gray-200 my-2" />
            <div className="flex items-center w-1/2">
              <img src={locationicon} className="w-5 h-5 ml-4 flex-shrink-0" />
              <input type="text" placeholder="Location"
                className="py-2 px-4 w-full rounded-full focus:outline-none text-sm"
                onChange={(e) => setsearchLocation(e.target.value)} />
              <div onClick={handleSearch}
                className="w-10 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-purple-600 mr-2 cursor-pointer hover:bg-purple-700 transition-colors">
                <img src={searchicon} className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 h-full text-sm font-semibold whitespace-nowrap flex-shrink-0">
            <NavLink to="/create-event" className={({ isActive }) => isActive ? "text-purple-600" : "hover:text-purple-600"}>
              Create Event
            </NavLink>
            <NavLink to="/my-events" className={({ isActive }) => isActive ? "text-purple-600" : "hover:text-purple-600"}>
              My Events
            </NavLink>

            {/* User dropdown */}
            <div onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}
              className="relative h-16 flex items-center hover:bg-gray-100 px-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <img src={usericon} className="w-7 flex-shrink-0" />
                <span className="text-sm max-w-[140px] truncate">{User?.email}</span>
              </div>
              {menuOpen && (
                <div className="absolute right-0 top-full w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                  <NavLink to="/events" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    Find Events
                  </NavLink>
                  <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    My Bookings
                  </NavLink>
                  <div className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600 cursor-pointer">
                    Account Setting
                  </div>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <div onClick={handleLogout}
                      className="flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                      Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tablet ── */}
      {/* ✅ w-full instead of w-screen */}
      <div className="hidden md:flex lg:hidden flex-col w-full px-6 py-2">
        <div className="flex justify-between items-center w-full mt-2">
          <Link to="/" className="text-2xl font-bold text-purple-600">Eventify</Link>
          <div className="flex items-center gap-4">
            <NavLink to="/create-event" className={({ isActive }) => isActive ? "text-purple-600 text-sm font-semibold" : "text-sm font-semibold hover:text-purple-600"}>
              Create Event
            </NavLink>
            <NavLink to="/my-events" className={({ isActive }) => isActive ? "text-purple-600 text-sm font-semibold" : "text-sm font-semibold hover:text-purple-600"}>
              My Events
            </NavLink>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-purple-600">
                {menuOpen ? <FiX /> : <FiMenu />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                  <NavLink to="/events" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    Find Events
                  </NavLink>
                  <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    My Bookings
                  </NavLink>
                  <div className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600 cursor-pointer">
                    Account Setting
                  </div>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <div onClick={handleLogout}
                      className="flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                      Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex w-full border-[2px] border-gray-300 hover:border-purple-600 rounded-full mt-3 mb-2 overflow-hidden">
          <div className="flex items-center w-1/2">
            <img src={searchicon} className="w-5 h-5 ml-4 flex-shrink-0" />
            <input type="text" placeholder="Search by keyword only..."
              className="px-3 w-full focus:outline-none text-sm py-2"
              onChange={(e) => setsearchEvent(e.target.value)} />
          </div>
          <div className="w-px bg-gray-200 my-2" />
          <div className="flex items-center w-1/2">
            <img src={locationicon} className="w-5 h-5 ml-3 flex-shrink-0" />
            <input type="text" placeholder="Location"
              className="px-3 w-full focus:outline-none text-sm py-2"
              onChange={(e) => setsearchLocation(e.target.value)} />
            <div onClick={handleSearch}
              className="w-9 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-purple-600 mr-2 cursor-pointer">
              <img src={searchicon} className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      {/* ✅ w-full instead of w-screen */}
      <div className="md:hidden flex flex-col w-full px-4 py-2">
        <div className="flex justify-between items-center w-full mt-1">
          <Link to="/" className="text-xl font-bold text-purple-600">Eventify</Link>
          <div className="flex items-center gap-3">
            <NavLink to="/create-event" className={({ isActive }) => isActive ? "text-purple-600 text-xs font-semibold" : "text-xs font-semibold hover:text-purple-600"}>
              Create
            </NavLink>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-purple-600">
                {menuOpen ? <FiX /> : <FiMenu />}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                  <NavLink to="/events" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    Find Events
                  </NavLink>
                  <NavLink to="/my-events" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    My Events
                  </NavLink>
                  <NavLink to="/my-bookings" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-600">
                    My Bookings
                  </NavLink>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <div onClick={handleLogout}
                      className="flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer">
                      Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="flex w-full mt-2 mb-1 border-[2px] border-gray-300 rounded-full overflow-hidden">
          <div className="flex items-center flex-1">
            <img src={searchicon} className="w-4 h-4 ml-3 flex-shrink-0" />
            <input type="text" placeholder="Search by keyword only..."
              className="py-2 px-3 w-full focus:outline-none text-sm"
              onChange={(e) => setsearchEvent(e.target.value)} />
          </div>
          <div onClick={handleSearch}
            className="w-9 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-purple-600 mr-1 my-auto cursor-pointer">
            <img src={searchicon} className="w-4 h-4" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;