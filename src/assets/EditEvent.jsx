import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import API from "./api";
import {toast} from "react-hot-toast";

const CATEGORIES = ["Music","Nightlife","Arts","Food & Drink","Hobbies","Dating","Holidays","Wellness","Sports","Business"];
const LANGUAGES  = ["English","Hindi","Marathi","Tamil","Telugu","French","Spanish"];

const EditEvent = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();

  const [image,      setImage]      = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [dragOver,   setDragOver]   = useState(false);
  const [isFree,     setIsFree]     = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiError,    setAiError]    = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();


  // Load all existing event fields
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`, { withCredentials: true });
        const e   = res.data;

        // Load all 9 fields — not just 5 like before
        reset({
          title:       e.title,
          description: e.description,
          date:        e.date,
          time:        e.time,
          duration:    e.duration,
          location:    e.location,
          category:    e.category,
          language:    e.language,
          price:       e.price || 0,
        });

        // Pre-set the free/paid toggle from existing price
        setIsFree(!e.price || Number(e.price) === 0);

        if (e.image) setPreview(e.image);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, reset, navigate]);

  const handleImageChange = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFreeToggle = (free) => {
    setIsFree(free);
    if (free) setValue("price", 0);
    else      setValue("price", "");
  };

  // AI Description Generator — same as CreateEvent
  const handleGenerateDescription = async () => {
    setAiError("");
    const values = getValues();

    if (!values.title?.trim()) {
      setAiError("Please enter an event title first — AI needs it to write a description.");
      return;
    }

    setGenerating(true);
    try {
      const { data } = await API.post("/ai/genrate-description", {
        title:    values.title,
        category: values.category,
        location: values.location,
        date:     values.date,
        duration: values.duration,
        price:    isFree ? 0 : values.price,
      });

      setValue("description", data.description, { shouldValidate: true });

    } catch (err) {
      if (err.response?.status === 429) {
        setAiError("Too many requests — wait a moment and try again.");
      } else {
        setAiError(err.response?.data?.message || "Could not generate description. Try again.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append("image", image);
      await API.put(`/events/${id}`, formData, { withCredentials: true });
      toast.success("Event updated successfully!");
      navigate("/my-events");
    } catch (err) {
      if (err.response?.status === 401){
        toast.error("Please login again."); 
        navigate("/login");
      }
      else{ 
        console.log("Edit event error:", err.response?.data);
        toast.error(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
      }
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
     focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white
     ${hasError ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-purple-300"}`;

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading event...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#faf8ff] pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">

          <div className="mb-6 sm:mb-8">
            <button onClick={() => navigate("/my-events")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition mb-4">
              ← Back to My Events
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Edit Event</h1>
            <p className="text-sm text-gray-500 mt-1">Update your event details below</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 space-y-5 sm:space-y-6">

              {/* Title */}
              <div>
                <label className={labelClass}>Event Title *</label>
                <input placeholder="e.g. Sunburn Music Festival 2025"
                  className={inputClass(errors.title)}
                  {...register("title", { required: "Title is required" })} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date *</label>
                  <input type="date" className={inputClass(errors.date)}
                    {...register("date", { required: "Date is required" })} />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Time *</label>
                  <input type="time" className={inputClass(errors.time)}
                    {...register("time", { required: "Time is required" })} />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className={labelClass}>Duration *</label>
                <input placeholder="e.g. 2 hours, 3 days" className={inputClass(errors.duration)}
                  {...register("duration", { required: "Duration is required" })} />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
              </div>

              {/* Price */}
              <div>
                <label className={labelClass}>Ticket Price *</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => handleFreeToggle(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all
                      ${isFree
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100"
                        : "border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"}`}>
                    🎉 Free
                  </button>
                  <button type="button" onClick={() => handleFreeToggle(false)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all
                      ${!isFree
                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100"
                        : "border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600"}`}>
                    💳 Paid
                  </button>
                </div>

                {isFree && (
                  <>
                    <input type="hidden" value={0} {...register("price", { valueAsNumber: true })} />
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <span className="text-lg">✅</span>
                      <p className="text-sm text-emerald-700 font-medium">This event is free — no ticket price needed</p>
                    </div>
                  </>
                )}

                {!isFree && (
                  <>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                      <input type="number" placeholder="Enter ticket price"
                        className={`${inputClass(errors.price)} pl-8`}
                        {...register("price", {
                          required:      "Price is required for paid events",
                          min:           { value: 1, message: "Price must be at least ₹1" },
                          valueAsNumber: true,
                        })} />
                    </div>
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                  </>
                )}
              </div>

              {/* Location */}
              <div>
                <label className={labelClass}>Location *</label>
                <input placeholder="e.g. MMRDA Grounds, BKC, Mumbai" className={inputClass(errors.location)}
                  {...register("location", { required: "Location is required" })} />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              {/* Category + Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select className={inputClass(errors.category)}
                    {...register("category", { required: "Category is required" })}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Language *</label>
                  <select className={inputClass(errors.language)}
                    {...register("language", { required: "Language is required" })}>
                    <option value="">Select language</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>}
                </div>
              </div>

{/* Description */}
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  rows={4}
                  placeholder="Tell people what your event is about..."
                  className={inputClass(errors.description) + " resize-none"}
                  {...register("description", { required: "Description is required" })}
                />
                <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                           bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                onClick={handleGenerateDescription}           
                >{generating ? (
                  <span>Genarating...</span>
                ):(
                  <span>✨ Generate with AI</span>
                )}</button>

                 <p className="text-xs text-gray-400 mb-2">
                Fill in the title first, then click "Generate with AI" to auto-fill this field.
              </p>

              {aiError && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200
                                rounded-xl px-3 py-2 mb-2">
                  <span className="text-sm">⚠️</span>
                  <p className="text-sm text-amber-700">{aiError}</p>
                </div>
              )}           
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

              {/* Image upload */}
              <div>
                <label className={labelClass}>Event Banner</label>
                <p className="text-xs text-gray-400 mb-2">Leave unchanged to keep current image</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageChange(e.dataTransfer.files[0]); }}
                  className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
                    ${dragOver ? "border-purple-500 bg-purple-50" : "border-purple-200 hover:border-purple-400 bg-purple-50/40"}`}
                >
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="preview" className="w-full h-48 sm:h-56 object-cover rounded-xl" />
                      <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full text-xs hover:bg-black/80 transition">
                        ✕
                      </button>
                      <label className="absolute bottom-2 right-2 cursor-pointer bg-black/60 text-white text-xs px-3 py-1 rounded-full hover:bg-black/80 transition">
                        Change photo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-10 sm:py-14 cursor-pointer w-full">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl mb-3">🖼️</div>
                      <p className="text-sm font-semibold text-purple-700">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>

              <div className="border-t border-purple-50 pt-2" />

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300
                             text-white font-bold py-3 rounded-xl transition-all text-sm
                             hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Saving...
                    </span>
                  ) : "💾 Save Changes"}
                </button>
                <button type="button" onClick={() => navigate("/my-events")}
                  className="sm:w-32 border border-gray-200 hover:border-purple-300 text-gray-600
                             font-semibold py-3 rounded-xl transition-all text-sm hover:text-purple-600">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditEvent;