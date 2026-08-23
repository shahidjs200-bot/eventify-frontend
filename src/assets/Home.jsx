import React from 'react'
import AppNavbar from './../components/AppNavbar';
import { useEffect,useState,useRef } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import API from './api';

const CATEGORIES = [
  { label: "All",          icon: "✦"  },
  { label: "Music",        icon: "🎵" },
  { label: "Nightlife",    icon: "🌃" },
  { label: "Arts",         icon: "🎨" },
  { label: "Food & Drink", icon: "🍽️" },
  { label: "Hobbies",      icon: "🎮" },
  { label: "Dating",       icon: "❤️" },
  { label: "Holidays",     icon: "🎄" },
  { label: "Wellness",     icon: "🧘" },
];

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80",
    tag:   "Featured Event",
    title: "Feel the Beat,\nLive the Moment",
    sub:   "Thousands of live events across Mumbai this season",
  },
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
    tag:   "Workshops & More",
    title: "Learn Something\nNew Today",
    sub:   "Photography, pottery, coding & lots more near you",
  },
  {
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=80",
    tag:   "New Year's Eve",
    title: "Ring in the New Year\nWith a Bang",
    sub:   "Exclusive parties, rooftop galas & countdown events",
  },
];

const NEARBY_CITIES = [
  "Pune", "Surat", "Navi Mumbai", "Thane", "Nashik", "Aurangabad", "Pimpri-Chinchwad",
];

const GlobalStyle = () => (
  <style>
    {
      `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      
      /* Skeleton loading shimmer — needs @keyframes, Tailwind can't do this */
    .shimmer {
      background: linear-gradient(90deg, #f3f0ff 25%, #ede9fe 50%, #f3f0ff 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0;  }
      100% { background-position: -200% 0; }
    }

      .overlay{
      background: linear-gradient(
        90deg,
        rgba(10,0,30,0.92) 0%,
        rgba(10,0,30,0.55) 45%,
        transparent 100%
      );}
      @media (max-width: 640px) {
      .hero-overlay {
        background: linear-gradient(
          180deg,
          rgba(10,0,30,0.2) 0%,
          rgba(10,0,30,0.92) 100%
        );
      }
    }

    .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .hide-scroll::-webkit-scrollbar { display: none; } 
    
    .fade-in { animation: fadeUp 0.6s ease both; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0);    }
    }`
    }
  </style>
)

const fmtPrice = (p) => 
    !p || String(p) === "0" || String(p).toLocaleLowerCase() === "free" ? "Free" : `₹${p}`;

const fmtDate = (raw) => {
    if (!raw) return "";
    const d = new Date(raw);
    return isNaN(d) ? raw : d.toLocaleDateString("en-IN", { day: "numeric", month: "short"})
};

const SkelPoster = () => (
  <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px]">
    <div className="shimmer rounded-xl h-[200px] sm:h-[230px] md:h-[248px]" />
    <div className="mt-2.5 space-y-2">
      <div className="shimmer h-3 rounded-full w-4/5" />
      <div className="shimmer h-3 rounded-full w-1/2" />
    </div>
  </div>
);

const SkelWide = () => (
  <div className="flex-shrink-0 w-[260px] sm:w-[300px]">
    <div className="shimmer rounded-xl h-[145px]" />
    <div className="mt-2.5 space-y-2">
      <div className="shimmer h-3 rounded-full w-4/5" />
      <div className="shimmer h-3 rounded-full w-1/2" />
    </div>
  </div>
);

const PosterCard = ({event , index = 0}) => {
  const [saved, setsaved] = useState(false);
  const navigate = useNavigate();

  const price = fmtPrice(event.price);

  return (
    <div 
    className='flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px] cursor-pointer fade-in  '
    style={{ animationDelay: `${index * 55}ms` }}>
      <div
      onClick={()=> navigate(`/events/${event._id}`)}  
      className='transition-transform duration-200 hover:-translate-y-2'>
      <div className='relative h-[200px] sm:h-[230px] md:h-[250px] rounded-xl overflow-hidden group transition-shadow duration-200 hover:shadow-xl hover:shadow-purple-200/60'>
        {
          event.image 
          ? <img src={event.image} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
          : <div className='w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-purple-50 to-violet-100'>🎟️</div>  
        }

<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {event.category && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold
                           tracking-wider uppercase bg-purple-600 text-white
                           px-2.5 py-0.5 rounded-full">
            {event.category}
          </span>
        )}

        <button onClick={(e)=>{e.stopPropagation(); setsaved(!saved);}} className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full backdrop-blur-sm shadow flex items-center justify-center text-xs hover:scale-110 transition-transform">
          {saved ? "❤️" : "🤍"}
        </button>

        <div className='absolute bottom-2.5 left-2.5 '>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full 
            ${price === "Free" 
              ? "bg-emerald-500 text-white" 
              : "bg-emerald-500 text-white"}`}>
              {price}
          </span>
        </div>
      </div>
      <div className='mt-2 px-0.5'>
        <h3 className='font-semibold text-[12px] sm:text-[14px] text-gray-900 leading-tight line-clamp-2 mb-1'
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
          {event.title}</h3>
        <p className="text-[10px] sm:text-[11px] text-gray-500">
          {fmtDate(event.date)}
          {event.location ? ` . ${event.location.split(",")[0]}` : ""}
          </p>
      </div>
      </div>
    </div>
  )
}


// ─── 6. WIDE CARD ─────────────────────────────────────────────────────────────
// Landscape card — used in "Trending" row
// Extracted because it repeats 8 times

const WideCard = ({ event, index = 0 }) => {
  const navigate = useNavigate();
  const price    = fmtPrice(event.price);

  return (
    <div
      className="flex-shrink-0 w-[260px] sm:w-[300px] rounded-2xl overflow-hidden
                 bg-white border border-purple-100 cursor-pointer fade-in
                 transition-all duration-200 hover:-translate-y-1
                 hover:shadow-xl hover:shadow-purple-200/60"
      style={{ animationDelay: `${index * 65}ms` }}
      onClick={() => navigate(`/events/${event._id}`)}
    >
      {/* Image */}
      <div className="relative h-[145px]">
        {event.image
          ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-purple-50 flex items-center justify-center text-4xl">🎟️</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {event.category && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold
                           tracking-wider uppercase bg-purple-600 text-white
                           px-2.5 py-0.5 rounded-full">
            {event.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 sm:p-3.5">
        <h3 className="font-bold text-gray-900 text-[13px] sm:text-[14px]
                       leading-snug line-clamp-1 mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {event.title}
        </h3>
        <p className="text-[11px] sm:text-[12px] text-gray-500 mb-3 flex items-center gap-1">
          <span>📍</span>
          <span className="truncate">{event.location || "Mumbai"}</span>
          {event.date && <><span>·</span><span className="flex-shrink-0">{fmtDate(event.date)}</span></>}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-purple-50">
          <span className={`font-bold text-[13px] sm:text-[14px]
            ${price === "Free" ? "text-emerald-600" : "text-purple-700"}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {price}
            {price !== "Free" && (
              <span className="text-[10px] font-normal text-gray-400 ml-1">onwards</span>
            )}
          </span>
          <span className="text-[11px] text-purple-600 font-semibold">Book now →</span>
        </div>
      </div>
    </div>
  );
};


const SectionRow = ({title , link , children , loading , skelCount= 6 , skelType = "Poster"}) => {
  const rowRef = useRef(null)
  const Scroll = (dir) => rowRef.current?.scrollBy({left : dir * 480, behavior: "smooth"})
  return (
    <section className='mb-10 sm:mb-12'>
      <div className='flex justify-between items-center mb-3 sm:mb-4'>
         <h2 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h2>
         <div className='flex items-center justify-center gap-2'>
         <button 
         className='hidden md:flex items-center justify-center w-8 h-8 border border-purple-200 rounded-full text-purple-400 hover:border-purple-500 hover:text-purple-600'
         onClick={() => Scroll(-1)}>‹</button>
         <button 
         className='hidden md:flex items-center justify-center w-8 h-8 border border-purple-200 rounded-full text-purple-400 hover:border-purple-500 hover:text-purple-600'
         onClick={() => Scroll(1)} >›</button>
         {link && (
           <Link to={link} className="text-purple-600 text-xs sm:text-sm font-semibold hover:underline whitespace-nowrap">See all →</Link>
         )
         }

         </div>
      </div>
      <div ref={rowRef} 
      className="overflow-x-auto hide-scroll"
      style={{ overflowY: "visible" }}>
        <div className='flex gap-3 pb-1.5 py-2'>
         {loading 
          ? Array(skelCount).fill(0).map((_ , i)=> 
           skelType === "wide" ? <SkelWide key={i}/> : <SkelPoster key={i}/>
        ) : children }
        </div>
      </div>
    </section>
  )
}

const HeroSlider = () => {
  const [cur, setcur] = useState(0);
  const navigate = useNavigate();

   useEffect(() => {
      const t = setInterval(() => setcur(p => (p + 1) % HERO_SLIDES.length), 5000);
      return () => clearInterval(t);
    }, []);
  
  const slide = HERO_SLIDES[ cur ];
  
  return (
    <div className='relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl mb-8 '>
      {
        HERO_SLIDES.map( (s,i) => (
          <img src={s.image} key={i}
          className='absolute inset-0 w-full h-full object-cover transition-opacity duration-700'
          style={{opacity: i === cur ? 1 : 0}} />
        ))
      }
      <div className='absolute inset-0 overlay ' />
      <div className='absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 border border-white/20 rounded-full px-2.5 py-1 bg-white/10 backdrop:blur-md font-medium text-white '>
        <span className='w-2 h-2 rounded-full bg-purple-600 animate-pulse' />
        <span className='hidden sm:inline '>Events live now</span>
        <span className='sm:hidden'>Live</span>
      </div>
      <div className='absolute bottom-0 left-0 right-0 p-4 text-white  '>
        <span className='inline-block text-[9px] sm:text-[10px] tracking-[2px] uppercase text-purple-300 bg-purple-500/20 border border-purple-400/30 px-2.5 sm:px-3 py-0.5 sm:py-2 mb-2 sm:mb-3 rounded-full'>{slide.tag}</span>
        <h1 className='font-extrabold leading-tight mb-2 sm:mb-3'
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
          whiteSpace: "pre-line",
        }}>{slide.title}</h1>
        <p className='text-gray-300 text-xs sm:text-sm mb-3 sm:mb-5 hidden sm:block'>{slide.sub}</p>
        <div className='flex items-center gap-2 sm:gap-3'>
          <button
          onClick={() => navigate('/events')} 
          className='rounded-full bg-purple-600 text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-6 hover:bg-purple-700  transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-900/40  '
          style={{fontFamily:"'Plus Jakarta Sans', sans-serif"}}>Browse Events</button>
          <button
          onClick={() => navigate('/create-event')}
          className='text-xs sm:text-sm font-medium text-white/80 border border-white/25 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 '>+ Host Events</button>
        </div>
      </div>

      <div className='absolute bottom-3 sm:bottom-4 right-3 sm:right-4 lg:right-1/2 flex gap-1.5'>
        {HERO_SLIDES.map((_,i)=>(
          <button 
           key={i} 
           onClick={() => setcur(i)} 
           className={`rounded-full transition-all duration-300 
            ${i === cur ? 'w-6 sm:w-7 h-1.5 bg-purple-400' : "w-2 h-2 bg-purple-400"}`} />
        ))}
      </div>
    </div>
  );
}

const Home = () => {
  const [activeCategory, setactiveCategory] = useState("All");
  const [allEvents, setallEvents] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      setloading(true);
      seterror(null);
      try{
        const res = await API.get('/events');
        const data = Array.isArray(res.data) ? res.data : res.data.events || [];
        setallEvents(data);
      }
      catch(err){
        seterror("Could not load events. Please try again.");
      }finally{
        setloading(false);
      }
    };
  
  loadEvents();  
  }, [])
  
  const filtered = activeCategory === "All" 
  ? allEvents 
  : allEvents.filter( e => e.category === activeCategory);
 
  const freeEvents = allEvents.filter( e => !e.price || String(e.price) === "0" || String(e.price).toLowerCase() === "free");
  const recentEvents = allEvents.slice(0,12);
  const trending = [...allEvents].reverse().slice(0,8);
  return (
    <>
    <GlobalStyle />
    <div className='min-h-screen bg-[#faf8ff]'>
      <AppNavbar />
      <main className='max-w-7xl mx-auto px-3 pt-4 pb-16'>
        <HeroSlider />
        <div className='flex gap-2.5 overflow-x-auto hide-scroll mb-8 sm:mb-10 '>
          {CATEGORIES.map((cat)=>(
            <button
             key={cat.label}
             onClick={() => setactiveCategory(cat.label)}
             className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-150 whitespace-nowrap 
              ${activeCategory === cat.label 
                ? "bg-purple-600 text-white border-purple-600" 
                : "bg-white border-purple-200 text-gray-600 hover:border-purple-600 hover:text-purple-600"}`}>
              <span className='text-xs sm:text-sm'>{cat.icon}</span>
             {cat.label } 
            </button>
          )) }
        </div>

        {
          error && (
            <div>
              <p className="text-4xl sm:text-5xl mb-3">😕</p>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 text-sm bg-purple-600 text-white rounded-full
                           hover:bg-purple-700 transition-all"
              >
                Retry
              </button>
            </div>
          )
        }

        {
          !error && (
            <>
             {activeCategory !== "All" && (
               <SectionRow title={`${activeCategory}Events`} link={"/events"} loading={loading} skelCount={5} >
                {filtered.length === 0 
                 ? (<div className="flex flex-col items-center w-full py-12 gap-2 text-gray-400">
                        <span className="text-4xl">🎟️</span>
                        <p className="font-medium text-gray-600 text-sm sm:text-base">
                          No {activeCategory} events yet
                        </p>
                        <button
                          onClick={() => navigate("/create-event")}
                          className="text-xs sm:text-sm text-purple-600 underline"
                        >
                          Create the first one →
                        </button>
                      </div>)
                      : filtered.map((e,i) => <PosterCard key={e._id} event={e} index={i}/>)
                }
               </SectionRow>          
            )}
             {activeCategory === "All" &&(
              <SectionRow title="Recomended for you" link={"/events"} loading={loading} skelCount={7}>
               {recentEvents.map((e,i) => <PosterCard key={e._id} event={e} index={i}/>)}
              </SectionRow>
             )}
             {activeCategory === "All" && (
              <SectionRow title="Trending Events" link={"/events"} loading={loading} skelCount={4} skelType="wide">
                {trending.map((e,i)=> <WideCard key={e._id} event={e} index={i}/>)
                }
              </SectionRow>
             )}
             {activeCategory === "All" && (
              <SectionRow title="Free Events" link={"events"} loading={loading} skelCount={5}>
                {freeEvents.map((e,i)=> <PosterCard key={e._id} event={e} index={i}/>)}
              </SectionRow>
             )}

             {!loading && allEvents.length === 0 && activeCategory === "All" && (
              <div className="text-center py-16 sm:py-24">
                  <p className="text-4xl sm:text-5xl mb-4">🎟️</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No events yet</p>
                  <p className="text-gray-500 text-sm sm:text-base mb-6">
                    Be the first to create an event on Eventify!
                  </p>
                  <button
                    onClick={() => navigate("/create-event")}
                    className="px-6 sm:px-7 py-2.5 sm:py-3 bg-purple-600 text-white
                               rounded-full font-semibold text-sm sm:text-base
                               hover:bg-purple-700 transition-all hover:-translate-y-0.5"
                  >
                    + Create Event
                  </button>
                </div>
             )}
            </>
          )}

          {/* ── PROMO BANNER ── */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mt-4 mb-10 sm:mb-14
                          bg-gradient-to-r from-purple-700 via-violet-700 to-purple-800
                          p-6 sm:p-8 md:p-12">
            {/* Decorative blobs — purely visual */}
            <div className="absolute -right-10 -top-10 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute right-20 sm:right-40 -bottom-6 w-28 sm:w-40 h-28 sm:h-40 rounded-full bg-purple-500/20 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
              {/* Left text */}
              <div>
                <span className="text-[10px] font-black tracking-[2.5px] uppercase text-purple-300 mb-2 block">
                  For Organisers
                </span>
                <h2
                  className="font-extrabold text-white text-xl sm:text-2xl md:text-3xl leading-tight mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Host your next big event<br />with Eventify
                </h2>
                <p className="text-purple-200 text-xs sm:text-sm max-w-xs mb-5 sm:mb-6">
                  Reach thousands of event-goers across Mumbai, Pune & beyond. Setup in just 5 minutes.
                </p>
                <button
                  onClick={() => navigate("/create-event")}
                  className="font-bold px-5 sm:px-7 py-2.5 sm:py-3 bg-white text-purple-700
                             rounded-full text-xs sm:text-sm
                             hover:bg-purple-50 transition-all hover:-translate-y-0.5 shadow-lg"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Start for free →
                </button>
              </div>

              {/* Right stats */}
              <div className="flex gap-6 sm:gap-10 shrink-0">
                {[
                  ["50K+", "Monthly Visitors"],
                  ["1.2K",  "Active Events"  ],
                  ["4.9★",  "Avg. Rating"    ],
                ].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p
                      className="font-extrabold text-white text-2xl sm:text-3xl"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {num}
                    </p>
                    <p className="text-purple-300 text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── NEARBY CITIES ── */}
          <section>
            <h2
              className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-3 sm:mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Things to do near <span className="text-purple-600">Mumbai</span>
            </h2>
            <div className="flex gap-2 sm:gap-2.5 flex-wrap">
              {NEARBY_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => navigate(`/events?location=${city}`)}
                  className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2
                             bg-white border border-purple-100 rounded-full
                             text-xs sm:text-sm font-medium text-gray-700
                             hover:border-purple-500 hover:text-purple-600 transition-all"
                >
                  <span className="text-purple-400 text-[10px]">📍</span>
                  {city}
                  <span className="text-gray-400 text-[10px]">→</span>
                </button>
              ))}
            </div>
          </section>


      </main>
      <Footer />
    </div>
    </>
  )
}

export default Home;