import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../assets/api";

const fmtDate = (raw) => {
  if (!raw) return "";

  const d = new Date(raw);

  return isNaN(d)
    ? raw
    : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const fmtPrice = (p) => {
  const price = String(p || "").toLowerCase();

  return price === "0" || price === "free"
    ? "Free"
    : `₹${p}`;
};

const Eventcard = ({ event, refreshEvents, onClick }) => {
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await API.delete(`/events/${event._id}`, {
        withCredentials: true,
      });

      refreshEvents();
    } catch (err) {
      alert("Failed to delete event.");
      setDeleting(false);
    }
  };

  const price = fmtPrice(event.price);

  const ticketsSold = event.ticketsSold || 0;
  const revenue = event.revenue || 0;

  return (
    <>
      <div
        onClick={onClick}
        className="
          grid grid-cols-1
          sm:grid-cols-12
          items-center
          gap-4
          px-4 sm:px-5
          py-4
          border-b-2 border-purple-200
          last:border-0
          hover:bg-purple-50/40
          transition-colors
          cursor-pointer
        "
      >

        {/* IMAGE */}
        <div
          className="
            w-full
            h-40
            sm:w-auto
            sm:h-16
            sm:col-span-1
            rounded-xl
            overflow-hidden
            bg-purple-50
          "
        >
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🎟️
            </div>
          )}
        </div>


        {/* EVENT INFO */}
        <div className="min-w-0 sm:col-span-4">

          <div className="flex items-center gap-2 mb-1 flex-wrap">

            {event.category && (
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  bg-purple-100
                  text-purple-700
                  px-2
                  py-0.5
                  rounded-full
                "
              >
                {event.category}
              </span>
            )}

            <span
              className={`
                text-[10px]
                font-bold
                px-2
                py-0.5
                rounded-full
                ${
                  price === "Free"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-violet-100 text-violet-700"
                }
              `}
            >
              {price}
            </span>

          </div>

          <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] truncate">
            {event.title}
          </h3>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">

            {event.location && (
              <p className="text-xs text-gray-500">
                📍 {event.location}
              </p>
            )}

            {event.date && (
              <p className="text-xs text-gray-500">
                📅 {fmtDate(event.date)}
                {event.time ? ` · ${event.time}` : ""}
              </p>
            )}

            {event.duration && (
              <p className="text-xs text-gray-500">
                ⏱ {event.duration}
              </p>
            )}

          </div>

        </div>

        
       <div className="flex gap-2 sm:contents">

  {/* Tickets sold */}
  <div className="flex-1 sm:flex-none sm:col-span-2 text-center bg-blue-50 sm:bg-transparent rounded-xl py-2 sm:py-0">
    <p className="text-lg font-extrabold text-blue-700">{ticketsSold}</p>
    <p className="text-[10px] text-gray-400 font-medium">tickets sold</p>
  </div>

  {/* Revenue */}
  <div className="flex-1 sm:flex-none sm:col-span-2 text-center bg-amber-50 sm:bg-transparent rounded-xl py-2 sm:py-0">
    <p className="text-lg font-extrabold text-amber-700">
      {revenue === 0 ? "—" : `₹${revenue.toLocaleString("en-IN")}`}
    </p>
    <p className="text-[10px] text-gray-400 font-medium">revenue</p>
  </div>

</div>

        {/* ACTIONS */}
        <div
          className="
            sm:col-span-3
            flex
            items-center
            gap-2
            w-full
            sm:w-auto
            sm:justify-end
          "
          onClick={(e) => e.stopPropagation()}
        >

          <button
            onClick={() => navigate(`/events/edit/${event._id}`)}
            className="
              flex-1
              sm:flex-initial
              flex
              items-center
              justify-center
              gap-1.5
              border
              border-purple-200
              hover:border-purple-500
              hover:text-purple-600
              text-gray-700
              text-xs
              font-semibold
              px-4
              py-2
              rounded-full
              transition-all
            "
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="
              flex-1
              sm:flex-initial
              flex
              items-center
              justify-center
              gap-1.5
              border
              border-red-200
              hover:border-red-400
              hover:text-red-600
              text-gray-500
              text-xs
              font-semibold
              px-4
              py-2
              rounded-full
              transition-all
            "
          >
            🗑️ Delete
          </button>

        </div>

      </div>


      {/* DELETE MODAL */}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmDelete(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm z-10">

            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>

            <h3 className="text-center font-bold text-gray-900 text-lg mb-1">
              Delete Event?
            </h3>

            <p className="text-center text-gray-500 text-sm mb-6">
              <span className="font-semibold text-gray-700">
                "{event.title}"
              </span>{" "}
              will be permanently deleted. This cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setConfirmDelete(false)}
                className="
                  flex-1
                  border
                  border-gray-200
                  hover:border-gray-400
                  text-gray-600
                  font-semibold
                  py-2.5
                  rounded-xl
                  text-sm
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="
                  flex-1
                  bg-red-500
                  hover:bg-red-600
                  disabled:bg-red-300
                  text-white
                  font-bold
                  py-2.5
                  rounded-xl
                  text-sm
                "
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Eventcard;