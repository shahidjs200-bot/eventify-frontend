import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Eventcard from "../components/Eventcard";
import API from "./api";

const Myevent = () => {
  const navigate            = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      // ✅ my-events now returns ticketsSold + revenue per event
      const res = await API.get("/events/my-events", { withCredentials: true });
      setEvents(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats computed from events array ─────────────────────────────────────
  const totalEvents    = events.length;
  const freeEvents     = events.filter(e => !e.price || Number(e.price) === 0).length;
  const paidEvents     = totalEvents - freeEvents;
  const totalTickets   = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
  const totalRevenue   = events.reduce((sum, e) => sum + (e.revenue || 0), 0);

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#faf8ff]">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-violet-700 py-8 sm:py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Events</h1>
              <p className="text-purple-200 text-sm mt-1">Manage all your created events</p>
            </div>
            <button
              onClick={() => navigate("/create-event")}
              className="self-start sm:self-auto flex items-center gap-2 bg-white text-purple-700
                         font-bold px-5 py-2.5 rounded-full text-sm hover:bg-purple-50 transition-all
                         hover:-translate-y-0.5 shadow-lg shadow-purple-900/20"
            >
              + Create Event
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ── Stats row — 5 cards ── */}
          {!loading && totalEvents > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: "Total Events",   value: totalEvents,               bg: "bg-purple-50",  text: "text-purple-700",  icon: "🎟️" },
                { label: "Free Events",    value: freeEvents,                bg: "bg-emerald-50", text: "text-emerald-700", icon: "🎉" },
                { label: "Paid Events",    value: paidEvents,                bg: "bg-violet-50",  text: "text-violet-700",  icon: "💳" },
                { label: "Tickets Sold",   value: totalTickets,              bg: "bg-blue-50",    text: "text-blue-700",    icon: "🎫" },
                { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString('en-IN')}`, bg: "bg-amber-50", text: "text-amber-700", icon: "💰" },
              ].map(({ label, value, bg, text, icon }) => (
                <div key={label} className={`${bg} rounded-2xl p-3 sm:p-4 text-center border border-white shadow-sm`}>
                  <p className="text-xl sm:text-2xl mb-0.5">{icon}</p>
                  <p className={`font-extrabold text-lg sm:text-2xl ${text}`}>{value}</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Search bar */}
          {!loading && totalEvents > 0 && (
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="flex-1 flex items-center gap-2 bg-white border border-purple-100
                              hover:border-purple-400 focus-within:border-purple-500 focus-within:ring-2
                              focus-within:ring-purple-100 rounded-full px-4 py-2.5 transition-all">
                <span className="text-gray-400 text-sm flex-shrink-0">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search your events..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0">✕</button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-purple-50 last:border-0 animate-pulse">
                  <div className="w-24 h-16 rounded-xl bg-purple-50 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-purple-50 rounded-full w-1/2" />
                    <div className="h-3 bg-purple-50 rounded-full w-1/3" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-purple-50 rounded-full" />
                    <div className="h-8 w-16 bg-purple-50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && totalEvents === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-purple-100">
              <p className="text-5xl mb-4">🎟️</p>
              <p className="text-xl font-bold text-gray-700 mb-2">No events yet</p>
              <p className="text-gray-500 text-sm mb-6">You haven't created any events. Start by creating your first one!</p>
              <button
                onClick={() => navigate("/create-event")}
                className="px-7 py-3 bg-purple-600 text-white font-bold rounded-full text-sm
                           hover:bg-purple-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-200"
              >
                + Create your first event
              </button>
            </div>
          )}

          {/* Empty search */}
          {!loading && totalEvents > 0 && filtered.length === 0 && (
            <div className="text-center py-14 bg-white rounded-2xl border border-purple-100">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-700">No events match "{search}"</p>
              <button onClick={() => setSearch("")} className="mt-3 text-sm text-purple-600 underline">Clear search</button>
            </div>
          )}

          {/* Events list */}
          {!loading && filtered.length > 0 && (
            <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm">

              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 items-center gap-2 px-5 py-3 bg-purple-50/60 border-b-2 border-purple-200">
                <div className="col-span-1" />
                <div className="col-span-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event</div>
                <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tickets Sold</div>
                <div className="col-span-2 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Revenue</div>
                <div className="col-span-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right pr-2">Actions</div>
              </div>

              {filtered.map(event => (
                <Eventcard
                  onClick={() =>  navigate(`/events/${event._id}`)}
                  key={event._id}
                  event={event}
                  refreshEvents={fetchEvents}
                />
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && search && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              Showing {filtered.length} of {totalEvents} events
            </p>
          )}

        </div>
      </div>
    </>
  );
};

export default Myevent;