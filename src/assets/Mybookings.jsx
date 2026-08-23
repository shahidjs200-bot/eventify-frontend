import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Footer   from "../components/Footer";
import API      from "./api";

const fmtDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d) ? raw : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const fmtPrice = (p) =>
  !p || p === "0" || p?.toLowerCase() === "free" ? "Free" : `₹${p}`;

// ─── Single booking card ───────────────────────────────────────────────────────
const BookingCard = ({ booking, onCancel }) => {
  const navigate    = useNavigate();
  const [expanded,  setExpanded]  = useState(false);
  const [cancelling,setCancelling]= useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const event = booking.event;
  if (!event) return null;

  const handleDownload = () => {
    const link    = document.createElement("a");
    link.href     = booking.qrCode;
    link.download = `ticket-${event.title}-${booking._id}.png`;
    link.click();
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await API.delete(`/bookings/${booking._id}`);
      onCancel(booking._id);
    } catch {
      alert("Could not cancel booking. Try again.");
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm
                    hover:shadow-md hover:shadow-purple-100 transition-all">
      {/* Top strip */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-500" />

      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Event image */}
          <div className="sm:w-28 h-20 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-purple-50">
            {event.image
              ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-3xl">🎟️</div>
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                {event.category && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider
                                   bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mb-1.5">
                    {event.category}
                  </span>
                )}
                <h3
                  className="font-bold text-gray-900 text-[15px] leading-tight line-clamp-1"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {event.title}
                </h3>
              </div>
              <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                ✅ Confirmed
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
              {event.date     && <span>📅 {fmtDate(event.date)}{event.time ? ` · ${event.time}` : ""}</span>}
              {event.location && <span>📍 {event.location}</span>}
              <span>🎟️ {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}</span>
              <span>💳 {booking.totalAmount === 0 ? "Free" : `₹${booking.totalAmount} paid`}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="text-xs font-semibold text-purple-600 border border-purple-200
                           px-3 py-1.5 rounded-full hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                View Event →
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-semibold text-gray-600 border border-gray-200
                           px-3 py-1.5 rounded-full hover:border-purple-300 transition-all"
              >
                {expanded ? "Hide Ticket" : "Show QR Ticket"}
              </button>
              {booking.qrCode && (
                <button
                  onClick={handleDownload}
                  className="text-xs font-semibold text-gray-600 border border-gray-200
                             px-3 py-1.5 rounded-full hover:border-purple-300 transition-all"
                >
                  ⬇️ Download QR
                </button>
              )}
              <button
                onClick={() => setConfirmCancel(true)}
                className="text-xs font-semibold text-red-500 border border-red-200
                           px-3 py-1.5 rounded-full hover:border-red-400 hover:bg-red-50 transition-all"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>

        {/* Expanded QR code */}
        {expanded && booking.qrCode && (
          <div className="mt-4 pt-4 border-t border-purple-50 flex flex-col sm:flex-row items-center gap-4">
            <img src={booking.qrCode} alt="QR Code" className="w-32 h-32 rounded-xl border border-purple-100" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Your Entry QR Code</p>
              <p className="text-xs text-gray-500 mb-3">Show this at the event entry gate. Booking ID: {booking._id}</p>
              <button onClick={handleDownload}
                className="text-xs font-bold bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all">
                ⬇️ Download Ticket
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel confirmation */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmCancel(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl">
            <p className="text-4xl text-center mb-3">⚠️</p>
            <h3 className="font-bold text-gray-900 text-center text-lg mb-1">Cancel Booking?</h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Cancel your booking for <span className="font-semibold text-gray-700">"{event.title}"</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmCancel(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm">
                Keep Booking
              </button>
              <button onClick={handleCancel} disabled={cancelling}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────
const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        setBookings(data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = (id) => setBookings(prev => prev.filter(b => b._id !== id));

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#faf8ff]">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-violet-700 py-8 sm:py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              My Bookings
            </h1>
            <p className="text-purple-200 text-sm">All your event tickets in one place</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-purple-50 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-28 h-20 bg-purple-50 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-purple-50 rounded-full w-1/4" />
                      <div className="h-4 bg-purple-50 rounded-full w-3/4" />
                      <div className="h-3 bg-purple-50 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && bookings.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-purple-100">
              <p className="text-5xl mb-4">🎟️</p>
              <p className="text-xl font-bold text-gray-700 mb-2">No bookings yet</p>
              <p className="text-gray-500 text-sm mb-6">Find an event and book your first ticket!</p>
              <button onClick={() => navigate("/events")}
                className="px-7 py-3 bg-purple-600 text-white font-bold rounded-full text-sm
                           hover:bg-purple-700 transition-all hover:-translate-y-0.5">
                Browse Events →
              </button>
            </div>
          )}

          {/* Booking list */}
          {!loading && bookings.length > 0 && (
            <>
              <p className="text-sm text-gray-500 font-medium mb-4">
                {bookings.length} booking{bookings.length > 1 ? "s" : ""} found
              </p>
              <div className="space-y-4">
                {bookings.map(b => (
                  <BookingCard key={b._id} booking={b} onCancel={handleCancel} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyBookings;