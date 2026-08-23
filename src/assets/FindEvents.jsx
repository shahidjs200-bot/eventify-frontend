import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import API from "./api";

const CATEGORY_OPTIONS = ["Business","Music","Food & Drink","Health","Arts","Nightlife","Sports","Wellness","Hobbies","Dating"];
const DATE_OPTIONS     = ["Today","Tomorrow","This weekend","This week","Next week"];
const LANGUAGE_OPTIONS = ["English","Hindi","Marathi","Tamil","Telugu","French","Spanish"];

// ✅ Price options now have label (display) + value (sent to backend)
const PRICE_OPTIONS = [
  { label: "Free",         value: "free"      },
  { label: "Under ₹500",  value: "0-500"     },
  { label: "₹500 – ₹1K",  value: "500-1000"  },
  { label: "₹1K – ₹2K",   value: "1000-2000" },
  { label: "₹2K+",        value: "2000+"     },
];

const fmtDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d) ? raw : d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
};

const fmtPrice = (p) => {
  const n = Number(p);
  return (!p || n === 0) ? "Free" : `₹${p}`;
};

// Helper: get display label from a price value like "500-1000"
const getPriceLabel = (val) => {
  const found = PRICE_OPTIONS.find(o => o.value === val);
  return found ? found.label : val;
};

// ─── Single filter radio row ──────────────────────────────────────────────────
// Works for both plain strings (category/date/language) and { label, value } objects (price)
const FilterOption = ({ label, value, selected, onToggle }) => (
  <div onClick={() => onToggle(value)} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
      ${selected === value ? "border-purple-600" : "border-gray-300 group-hover:border-purple-400"}`}>
      {selected === value && <div className="w-2 h-2 rounded-full bg-purple-600" />}
    </div>
    <span className={`text-sm transition-colors select-none
      ${selected === value ? "text-purple-700 font-semibold" : "text-gray-600"}`}>
      {label}
    </span>
  </div>
);

// ─── Collapsible filter group ─────────────────────────────────────────────────
const FilterGroup = ({ title, options, selected, onToggle }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-purple-50 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-3">
        <span className="text-sm font-bold text-gray-800">{title}</span>
        <span className={`text-gray-400 text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="space-y-2.5">
          {options.map(opt => {
            // opt is either a plain string OR { label, value } object
            const label = typeof opt === "object" ? opt.label : opt;
            const value = typeof opt === "object" ? opt.value : opt;
            return (
              <FilterOption
                key={value}
                label={label}
                value={value}
                selected={selected}
                onToggle={onToggle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Event result card ────────────────────────────────────────────────────────
const EventResultCard = ({ event }) => {
  const navigate = useNavigate();
  const price    = fmtPrice(event.price);

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="bg-white border border-purple-100 rounded-2xl overflow-hidden
                  flex flex-col sm:flex-row hover:shadow-lg hover:shadow-purple-100
                  hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Image */}
      <div className="sm:w-[180px] md:w-[210px] flex-shrink-0 h-44 sm:h-auto">
        {event.image
          ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center text-5xl">🎟️</div>
        }
      </div>

      {/* Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              {event.category && (
                <span className="inline-block text-[10px] font-bold tracking-wider uppercase
                                 bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full mb-2">
                  {event.category}
                </span>
              )}
              <h3 className="font-bold text-gray-900 text-[15px] sm:text-base leading-snug">{event.title}</h3>
            </div>
            <span className={`flex-shrink-0 text-[13px] font-bold px-3 py-1 rounded-full
              ${price === "Free" ? "bg-emerald-50 text-emerald-600" : "bg-purple-50 text-purple-700"}`}>
              {price}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 mt-2">
            {event.location && <span>📍 {event.location}</span>}
            {event.date     && <span>📅 {fmtDate(event.date)}{event.time ? ` · ${event.time}` : ""}</span>}
            {event.duration && <span>⏱ {event.duration}</span>}
            {event.language && <span>🗣 {event.language}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-50">
          <span className="text-xs text-gray-400">Eventify</span>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}`); }}
            className="text-xs sm:text-sm font-semibold text-white bg-purple-600
                       hover:bg-purple-700 px-4 py-1.5 sm:py-2 rounded-full transition-all"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ResultSkeleton = () => (
  <div className="bg-white border border-purple-50 rounded-2xl overflow-hidden flex flex-col sm:flex-row animate-pulse">
    <div className="sm:w-[180px] h-44 sm:h-auto bg-purple-50 flex-shrink-0" />
    <div className="flex-1 p-5 space-y-3">
      <div className="h-3 bg-purple-50 rounded-full w-1/4" />
      <div className="h-4 bg-purple-50 rounded-full w-3/4" />
      <div className="h-3 bg-purple-50 rounded-full w-1/2" />
      <div className="h-3 bg-purple-50 rounded-full w-2/3" />
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const FindEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const eventQuery    = searchParams.get("event")    || "";
  const locationQuery = searchParams.get("location") || "";
  const categoryQuery = searchParams.get("category") || "";
  const dateQuery     = searchParams.get("date")     || "";
  const priceQuery    = searchParams.get("price")    || "";
  const languageQuery = searchParams.get("language") || "";

  const [events, setEvents]                       = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(categoryQuery || null);
  const [selectedDate,     setSelectedDate]     = useState(dateQuery     || null);
  const [selectedPrice,    setSelectedPrice]    = useState(priceQuery    || null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageQuery || null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await API.get("/events", {
          params: {
            event:    eventQuery,
            location: locationQuery,
            category: categoryQuery,
            date:     dateQuery,
            price:    priceQuery,   // e.g. "free", "0-500", "500-1000"
            language: languageQuery,
          },
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [eventQuery, locationQuery, categoryQuery, dateQuery, priceQuery, languageQuery]);

  const toggle = (value, setter) => setter(prev => prev === value ? null : value);

  const handleApply = () => {
    setSearchParams({
      event:    eventQuery,
      location: locationQuery,
      category: selectedCategory || "",
      date:     selectedDate     || "",
      price:    selectedPrice    || "",   // sends "free", "0-500" etc. to backend
      language: selectedLanguage || "",
    });
    setMobileFiltersOpen(false);
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedDate(null);
    setSelectedPrice(null);
    setSelectedLanguage(null);
    setSearchParams({ event: eventQuery, location: locationQuery });
  };

  // Remove a single filter chip
  const removeFilter = (type) => {
    const updates = {
      category: selectedCategory,
      date:     selectedDate,
      price:    selectedPrice,
      language: selectedLanguage,
    };
    if (type === "category") { setSelectedCategory(null); updates.category = ""; }
    if (type === "date")     { setSelectedDate(null);     updates.date     = ""; }
    if (type === "price")    { setSelectedPrice(null);    updates.price    = ""; }
    if (type === "language") { setSelectedLanguage(null); updates.language = ""; }
    setSearchParams({
      event:    eventQuery,
      location: locationQuery,
      category: updates.category || "",
      date:     updates.date     || "",
      price:    updates.price    || "",
      language: updates.language || "",
    });
  };

  const activeCount = [selectedCategory, selectedDate, selectedPrice, selectedLanguage].filter(Boolean).length;

  // Active chips data — each chip knows its type, display label, and value
  const activeChips = [
    selectedCategory && { type: "category", label: selectedCategory },
    selectedDate     && { type: "date",     label: selectedDate     },
    selectedPrice    && { type: "price",    label: getPriceLabel(selectedPrice) },
    selectedLanguage && { type: "language", label: selectedLanguage },
  ].filter(Boolean);

  // Shared filter panel — used in both desktop sidebar and mobile drawer
  const FiltersContent = () => (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-gray-900">Filters</span>
        {activeCount > 0 && (
          <button onClick={handleClearAll} className="text-xs text-purple-600 font-medium hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup
        title="Category"
        options={CATEGORY_OPTIONS}
        selected={selectedCategory}
        onToggle={v => toggle(v, setSelectedCategory)}
      />
      <FilterGroup
        title="Date"
        options={DATE_OPTIONS}
        selected={selectedDate}
        onToggle={v => toggle(v, setSelectedDate)}
      />
      {/* ✅ Price filter — options are objects { label, value } */}
      <FilterGroup
        title="Price"
        options={PRICE_OPTIONS}
        selected={selectedPrice}
        onToggle={v => toggle(v, setSelectedPrice)}
      />
      <FilterGroup
        title="Language"
        options={LANGUAGE_OPTIONS}
        selected={selectedLanguage}
        onToggle={v => toggle(v, setSelectedLanguage)}
      />

      <button
        onClick={handleApply}
        className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
      >
        Apply Filters {activeCount > 0 && `(${activeCount})`}
      </button>
    </>
  );

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#faf8ff]">

        {/* ── Header banner ── */}
        <div className="bg-gradient-to-r from-purple-700 to-violet-700 py-8 sm:py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {locationQuery ? `Events in ${locationQuery}` : "Find Events"}
            </h1>
            <p className="text-purple-200 text-sm">
              Discover free & paid events happening near you
            </p>
            {(eventQuery || locationQuery) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {eventQuery    && <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">🔍 "{eventQuery}"</span>}
                {locationQuery && <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">📍 {locationQuery}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ── Mobile: top bar ── */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <p className="text-sm text-gray-600 font-medium">
              {loading ? "Loading..." : `${events.length} event${events.length !== 1 ? "s" : ""} found`}
            </p>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 border border-purple-200 bg-white
                         px-4 py-2 rounded-full text-sm font-semibold text-purple-700
                         hover:border-purple-500 transition-all"
            >
              <span>⚙️ Filters</span>
              {activeCount > 0 && (
                <span className="bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Mobile filter drawer ── */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-gray-900 text-base">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg w-7 h-7 flex items-center justify-center">✕</button>
                </div>
                <FiltersContent />
              </div>
            </div>
          )}

          {/* ── Layout: sidebar + results ── */}
          <div className="flex gap-6 lg:gap-8 items-start">

            {/* Desktop sidebar */}
            <aside className="hidden md:block w-52 lg:w-60 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-purple-100 p-4 lg:p-5 sticky top-24">
                <FiltersContent />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">

              {/* Result count (desktop) */}
              <div className="hidden md:flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600 font-medium">
                  {loading ? "Loading events..." : `${events.length} event${events.length !== 1 ? "s" : ""} found`}
                </p>
              </div>

              {/* ✅ Active filter chips — price shows "Under ₹500" not "0-500" */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeChips.map(({ type, label }) => (
                    <span
                      key={type}
                      className="flex items-center gap-1.5 bg-purple-100 text-purple-700
                                 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {label}
                      <button
                        onClick={() => removeFilter(type)}
                        className="text-purple-400 hover:text-purple-700 text-xs ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {activeChips.length > 1 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => <ResultSkeleton key={i} />)}
                </div>
              )}

              {/* Empty state */}
              {!loading && events.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-purple-100">
                  <p className="text-5xl mb-4">🎟️</p>
                  <p className="text-lg font-bold text-gray-700 mb-2">No events found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                  {activeCount > 0 && (
                    <button onClick={handleClearAll} className="mt-4 px-5 py-2 text-sm bg-purple-600 text-white rounded-full">
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {/* Events list */}
              {!loading && events.length > 0 && (
                <div className="space-y-4">
                  {events.map(event => <EventResultCard key={event._id} event={event} />)}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindEvents;