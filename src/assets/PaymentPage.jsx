import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import API from "./api";
import {toast} from "react-hot-toast";

const fmtPrice = (p) => (!p || Number(p) === 0 ? "Free" : `₹${p}`);

const PaymentPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying,  setPaying]  = useState(false);
  const [tickets, setTickets] = useState(1);

  // Load event details
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);
      } catch {
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) return resolve(true);

      const script    = document.createElement("script");
      script.src      = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload   = () => resolve(true);
      script.onerror  = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      // Step 1 — create order on backend
      const { data } = await API.post("/bookings/create-order", {
        eventId: id,
        tickets,
      });

      // Free event — directly create booking, skip Razorpay
      if (data.free) {
        await API.post("/bookings", { eventId: id, tickets });
        navigate(`/payment-success?eventId=${id}&tickets=${tickets}&amount=0`);
        return;
      }

      // Step 2 — load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
         toast.error(
        "Razorpay failed to load. Check your internet connection."
      );

        setPaying(false);
        return;
      }

      // Step 3 — open Razorpay popup
      const options = {
        key:         data.keyId,
        amount:      data.amountPaise,
        currency:    data.currency,
        name:        "Eventify",
        description: event?.title,
        order_id:    data.orderId,

        // Step 4 — this runs after successful payment
        handler: async (response) => {
          try {
            // Verify payment on backend + create booking
            await API.post("/bookings/verify-payment", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              eventId:             id,
              tickets,
            });

            navigate(
              `/payment-success?eventId=${id}&tickets=${tickets}&amount=${data.amount}`
            );
          } catch (err) {
            console.log("Payment verification error:", err);
            toast.error(
            err.response?.data?.message ||
            "Payment verification failed. Please contact support."
          );
          }
        },

        prefill: {
          email: data.userEmail,
        },

        theme: {
          color: "#7C3AED",  // purple to match your app
        },

        // User closed the popup
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.log("Payment error:", err);
      toast.error(
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!event) return null;

  const price      = Number(event.price || 0);
  const isFree     = price === 0;
  const totalPrice = price * tickets;

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#faf8ff] pb-16">
        <div className="max-w-lg mx-auto px-4 pt-8 sm:pt-12">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition mb-6"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />

            <div className="p-6 sm:p-8">
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">Checkout</h1>
              <p className="text-sm text-gray-500 mb-6">Review your order before paying</p>

              {/* Event summary card */}
              <div className="flex gap-4 bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{event.title}</p>
                  {event.date     && <p className="text-xs text-gray-500 mt-1">📅 {event.date}{event.time ? ` · ${event.time}` : ""}</p>}
                  {event.location && <p className="text-xs text-gray-500">📍 {event.location}</p>}
                </div>
              </div>

              {/* Ticket quantity selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTickets(t => Math.max(1, t - 1))}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-purple-400
                               text-gray-600 font-bold text-lg flex items-center justify-center transition-all"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-6 text-center">{tickets}</span>
                  <button
                    onClick={() => setTickets(t => Math.min(10, t + 1))}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:border-purple-400
                               text-gray-600 font-bold text-lg flex items-center justify-center transition-all"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400 ml-1">Max 10 tickets</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border border-purple-100 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per ticket</span>
                  <span className="font-semibold">{isFree ? "Free" : `₹${price}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tickets</span>
                  <span className="font-semibold">× {tickets}</span>
                </div>
                <div className="border-t border-purple-50 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-purple-700 text-lg">
                    {isFree ? "Free" : `₹${totalPrice}`}
                  </span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300
                           text-white font-bold py-3.5 rounded-xl transition-all text-sm
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200"
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Processing...
                  </span>
                ) : isFree ? "Book Free Ticket" : `Pay ₹${totalPrice}`}
              </button>

              {/* Razorpay note */}
              {!isFree && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 Secured by Razorpay — use test card <span className="font-mono">4111 1111 1111 1111</span>
                </p>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;