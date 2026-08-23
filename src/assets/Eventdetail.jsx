import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Footer    from "../components/Footer";
import API       from "./api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d)
    ? raw
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const fmtPrice = (p) => {
  if (!p || Number(p) === 0) return "Free";
  return `₹${p}`;
};

// ─── Skeleton — shown while event loads ───────────────────────────────────────
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-[220px] sm:h-[340px] md:h-[420px] bg-purple-100" />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-purple-100 rounded-full w-3/4" />
          <div className="grid grid-cols-2 gap-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-purple-50 rounded-xl" />
            ))}
          </div>
          <div className="h-40 bg-purple-50 rounded-2xl" />
        </div>
        <div className="lg:w-80 space-y-3">
          <div className="h-48 bg-purple-50 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const EventDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

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

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-[#faf8ff]">
          <DetailSkeleton />
        </div>
      </>
    );
  }

  if (!event) return null;

  const price  = fmtPrice(event.price);
  const isFree = price === "Free";

  // Info rows shown in the grid
  const infoItems = [
    { icon: "📅", label: "Date & Time",  value: `${fmtDate(event.date)}${event.time ? ` · ${event.time}` : ""}` },
    { icon: "📍", label: "Location",     value: event.location  },
    { icon: "⏱",  label: "Duration",     value: event.duration  },
    { icon: "🗣",  label: "Language",     value: event.language  },
    { icon: "🏷️", label: "Category",     value: event.category  },
    { icon: "👤", label: "Organizer",     value: event.organizer?.email },
  ].filter(item => item.value); // only show fields that have a value

const handleBooking = () => {
  navigate(`/payment/${event._id}`);
};

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#faf8ff] pb-16">

        {/* ── Hero Image ── */}
        <div className="relative w-full h-[220px] sm:h-[340px] md:h-[420px] overflow-hidden">

          {/* Shimmer shown until image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-purple-100 animate-pulse" />
          )}

          <img
            src={event.image}
            alt={event.title}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
          />

          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-2
                       bg-white/20 backdrop-blur-md border border-white/30
                       text-white text-sm font-medium px-3 py-1.5 rounded-full
                       hover:bg-white/30 transition-all"
          >
            ← Back
          </button>

          {/* Category + price badges — bottom left of hero */}
          <div className="absolute bottom-4 left-4 sm:left-6 flex gap-2 flex-wrap">
            {event.category && (
              <span className="text-[11px] font-bold uppercase tracking-wider
                               bg-purple-600 text-white px-3 py-1 rounded-full">
                {event.category}
              </span>
            )}
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full
              ${isFree ? "bg-emerald-500 text-white" : "bg-white text-purple-700"}`}>
              {price}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left column: details + description ── */}
            <div className="flex-1 min-w-0">

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {infoItems.map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-4 bg-white border border-purple-100 rounded-xl"
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description — only shown if organizer filled it in */}
              {event.description && (
                <div className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-3">About this event</h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              )}

            </div>

            {/* ── Right column: booking card (UI only) ── */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="sticky top-24">

                <div className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-6 shadow-sm">

                  {/* Price */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        {isFree ? "Entry" : "Price per ticket"}
                      </p>
                      <p className="text-3xl font-extrabold text-purple-700">
                        {isFree ? "Free" : `₹${event.price}`}
                      </p>
                    </div>
                    {isFree && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        Free entry
                      </span>
                    )}
                  </div>

                  {/* Event quick info inside card */}
                  <div className="space-y-2 mb-5 pb-5 border-b border-purple-50">
                    {event.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📅</span>
                        <span>{fmtDate(event.date)}{event.time ? ` · ${event.time}` : ""}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Book Ticket button — UI only, no action for now */}
                  <button
  onClick={handleBooking}
  className="w-full bg-purple-600 text-white py-3 rounded-xl"
>
  {isFree ? "Book Free Ticket" : "Proceed to Pay"}
</button>

                  <p className="text-[11px] text-gray-400 text-center mt-3">
                    {isFree ? "No payment required" : "Secure checkout"}
                  </p>

                </div>

                {/* Share card */}
                <div className="mt-4 bg-white border border-purple-100 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-700 mb-3">Share this event</p>
                  <div className="flex gap-2">
                    {["WhatsApp", "Twitter", "Copy Link"].map(platform => (
                      <button
                        key={platform}
                        className="flex-1 text-[11px] font-semibold text-gray-600
                                   border border-gray-200 hover:border-purple-300
                                   hover:text-purple-600 py-2 rounded-lg transition-all"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetail;