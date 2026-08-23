import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import API from "./api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const eventId = searchParams.get("eventId");
  const tickets = searchParams.get("tickets");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${eventId}`);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  return (
    <>
      <AppNavbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800 flex items-center justify-center px-4">

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top Success Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h1 className="text-white text-2xl font-extrabold">
              Payment Successful
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Your booking is confirmed!
            </p>
          </div>

          {/* Content */}
          <div className="p-6">

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <>
                {/* Event Info */}
                {event && (
                  <div className="mb-6 text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      📍 {event.location}
                    </p>
                  </div>
                )}

                {/* Details Card */}
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-3 mb-6">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tickets</span>
                    <span className="font-semibold">{tickets}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-semibold text-emerald-600">
                      ₹{amount}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="font-bold text-emerald-600">
                      Confirmed ✅
                    </span>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">

                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    View My Bookings
                  </button>

                  <button
                    onClick={() => navigate("/events")}
                    className="w-full border border-purple-200 text-purple-600 font-semibold py-3 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    Browse More Events
                  </button>

                </div>

              </>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentSuccess;