import React, { useState } from 'react';
import { Award, Calendar, Clock, Star, Heart, Check, Users, MessageSquare, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { UserProfile, Notification } from '../types';

interface GurusViewProps {
  currentUser: UserProfile;
  onAddNotification: (notif: { title: string; text: string }) => void;
}

interface Guru {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  students: number;
  bio: string;
  disciplines: string[];
  slots: string[];
  price: number;
}

interface Review {
  guruId: string;
  studentName: string;
  stars: number;
  text: string;
  date: string;
}

export default function GurusView({ currentUser, onAddNotification }: GurusViewProps) {
  
  // High fidelity original gurus list matching screenshots
  const GURUS: Guru[] = [
    {
      id: "guru-1",
      name: "Acharya Krishna Dev Prasanna",
      title: "Vedas & Upanishadic Lineage Scholar",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      rating: 5.0,
      students: 480,
      bio: "Exponent of the Rigvedic Shakala Shakha Samhita chants. Received traditional gurukul training in Varanasi. Focuses on acoustics resonance parameters, pranayama syllable control and Advaita commentaries of Adi Shankaracharya.",
      disciplines: ["Rigvedic Chant Rigorous", "Isha & Kena Upanishads", "Prasthana Trayi Dialectics"],
      slots: ["Friday 08:00 AM (Brahma Muhurta)", "Friday 04:00 PM (Pradosha)", "Saturday 09:30 AM", "Saturday 05:00 PM"],
      price: 1800
    },
    {
      id: "guru-2",
      name: "Pandit Ramachandra Shastri",
      title: "Sidereal Jyotish & Karma-Kanda Master",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 4.9,
      students: 650,
      bio: "Lineage astrologer. Expert in Parasari natal calculations, Vimshottari Mahadasha forecasting grids, Ashtakavarga charts and Muhurta time computation. Provides logical remedial karma pathways.",
      disciplines: ["Vimshottari Dasha Analysis", "Kundali Ascendant Computations", "Domestic Shanti Ritual Guides"],
      slots: ["Friday 11:30 AM", "Saturday 02:00 PM", "Sunday 04:30 PM (Vijay Muhurta)"],
      price: 2100
    },
    {
      id: "guru-3",
      name: "Dr. Ananya Bharadwaj",
      title: "Sanskrit Grammarian & Ayurvedic Advistor",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      rating: 4.95,
      students: 310,
      bio: "PhD in Paninian Ashtadhyayi Linguistics from BHU. Specializes in etymology sandhi rules and elemental Prakriti/Vikriti analysis for organic health alignments.",
      disciplines: ["Paninian Sandhi Mechanics", "Ayurvedic Elemental Ritucharya", "Svara Intonation Training"],
      slots: ["Friday 03:00 PM", "Saturday 11:00 AM", "Sunday 09:00 AM"],
      price: 1500
    }
  ];

  const INITIAL_REVIEWS: Review[] = [
    { guruId: "guru-1", studentName: "Advait K. Rao", stars: 5, text: "The syllable acoustic breathing feedback by Acharya is phenomenal. My Gayatri chanting pitch has fully aligned.", date: "2 days ago" },
    { guruId: "guru-2", studentName: "Aadhya Sharma", stars: 5, text: "Excellent Vimshottari Mahadasha breakdown. Learned exactly how to perform simple shanti dhyana routines.", date: "1 week ago" }
  ];

  // Selected State variables
  const [selectedGuru, setSelectedGuru] = useState<Guru>(GURUS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [reviewsList, setReviewsList] = useState<Review[]>(INITIAL_REVIEWS);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<{ id: string; guruName: string; slot: string }[]>([]);

  // Feedback input state
  const [starInput, setStarInput] = useState<number>(5);
  const [textInput, setTextInput] = useState<string>("");

  // Payment Slider confirmation simulation trigger
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentSliderVal, setPaymentSliderVal] = useState("0");

  const handleSelectGuru = (guru: Guru) => {
    setSelectedGuru(guru);
    setSelectedSlot("");
  };

  const handleCheckoutTrigger = () => {
    if (!selectedSlot) return;
    setPaymentSliderVal("0");
    setPaymentDone(false);
    setCheckoutOpen(true);
  };

  const handleCompleteRazorpayStripePayment = () => {
    setPaymentDone(true);
    const bookingId = `book-id-${Date.now().toString().slice(-6)}`;
    const newBooking = {
      id: bookingId,
      guruName: selectedGuru.name,
      slot: selectedSlot
    };

    setBookedSessions(prev => [...prev, newBooking]);
    
    // Notifications trigger
    onAddNotification({
      title: "Sacred Session Booked successfully",
      text: `Your virtual video consultation with ${selectedGuru.name} is successfully scheduled on the timeframe: ${selectedSlot}. Video conference links loaded.`
    });

    setTimeout(() => {
      setCheckoutOpen(false);
    }, 1500);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPaymentSliderVal(val);
    if (val === "100") {
      handleCompleteRazorpayStripePayment();
    }
  };

  const handleAddReview = () => {
    if (!textInput.trim()) return;
    const newRev: Review = {
      guruId: selectedGuru.id,
      studentName: currentUser.name,
      stars: starInput,
      text: textInput,
      date: "Just now"
    };
    setReviewsList(prev => [newRev, ...prev]);
    setTextInput("");
  };

  const currentGuruReviews = reviewsList.filter(r => r.guruId === selectedGuru.id);

  return (
    <div className="space-y-10 animate-in fade-in duration-200 select-none pb-12" id="gurus-dashboard">
      
      {/* Title Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-[10px] text-orange-400 font-serif font-bold uppercase tracking-widest block">Lineage Marketplace</span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-100 uppercase mt-1">Sacred Consultation Portal</h2>
        <p className="text-xs text-gray-400 mt-2 font-serif font-bold-normal">Schedule 1-on-1 intensive video conference sessions with certified lineage Masters. Book slot timeframes securely via simulated Razorpay/Stripe.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List Gurus */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-serif font-bold text-orange-400 uppercase tracking-widest px-1">Verified Lineage Exponents</h3>
          
          <div className="space-y-4">
            {GURUS.map((guru) => {
              const isActive = selectedGuru.id === guru.id;
              return (
                <div
                  key={guru.id}
                  onClick={() => handleSelectGuru(guru)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-orange-950/15 border-orange-500/70 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                      : 'bg-[#0c0604] hover:bg-orange-950/5 border-orange-500/10'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <img 
                      src={guru.avatar} 
                      alt={guru.name} 
                      className="w-12 h-12 rounded-full border border-orange-500/30 object-cover shrink-0" 
                    />
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold font-serif text-gray-200 truncate">{guru.name}</h4>
                        <span className="text-[9px] bg-orange-600/30 text-orange-400 px-1.5 rounded uppercase font-bold tracking-widest shrink-0 font-serif">Verified</span>
                      </div>
                      <p className="text-[11px] text-[#f97316]/70 font-mono mt-0.5 truncate">{guru.title}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-[10px] font-sans">
                        <div className="flex items-center space-x-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold">{guru.rating.toFixed(2)}</span>
                        </div>
                        <div className="text-gray-500">
                          <span>{guru.students} Initiates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booked Sessions checklist */}
          {bookedSessions.length > 0 && (
            <div className="p-4 bg-orange-950/5 border border-orange-500/15 rounded-2xl mt-6">
              <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest font-serif border-b border-orange-500/10 pb-1.5 mb-3 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>My Confirmed Sacred Bookings:</span>
              </h4>
              <div className="space-y-2.5">
                {bookedSessions.map((b) => (
                  <div key={b.id} className="p-2.5 bg-[#0a0502]/60 border border-orange-500/5 rounded-xl text-left text-xs font-serif flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-200">{b.guruName}</p>
                      <p className="text-[9px] text-[#f97316]/60 font-mono">{b.slot}</p>
                    </div>
                    <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 rounded uppercase font-bold tracking-widest font-mono">Confirmed</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Guru selected bio and interactive scheduler calendar */}
        <div className="lg:col-span-7 bg-[#0c0604] border border-orange-500/20 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-orange-500/10 gap-3">
            <div>
              <h3 className="text-base font-bold font-serif text-gray-100 uppercase">{selectedGuru.name}</h3>
              <p className="text-xs text-[#f97316]/70 leading-relaxed font-serif mt-0.5">{selectedGuru.title}</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-mono">Tuition Dakshina</span>
              <span className="text-lg font-bold text-orange-400 tracking-wide">₹{selectedGuru.price} <span className="text-[10px] text-gray-650 font-normal">/ 45 Mins</span></span>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-300 leading-relaxed font-serif">{selectedGuru.bio}</p>
          </div>

          {/* disciplines tags */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-[#f97316]/60 font-mono uppercase tracking-widest block">Siddhanta Specializations:</span>
            <div className="flex flex-wrap gap-2">
              {selectedGuru.disciplines.map((tag, idx) => (
                <span key={idx} className="p-1 px-3 bg-[#0a0502] text-gray-300 border border-orange-500/5 text-[10px] font-serif rounded-full">
                  🍃 {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive slots selections */}
          <div className="border-t border-orange-500/10 pt-4 space-y-3">
            <span className="text-[9px] font-bold text-orange-400 font-serif uppercase tracking-widest block">Select Available Chanting Timeframe Slot:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
              {selectedGuru.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedSlot === slot 
                      ? 'bg-orange-600 text-white font-bold border-transparent shadow shadow-orange-600/30' 
                      : 'bg-[#0a0502]/80 hover:bg-orange-950/10 border-orange-500/5 text-gray-300'
                  }`}
                >
                  <span className="font-serif block">📅 {slot}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCheckoutTrigger}
              disabled={!selectedSlot}
              className="mt-4 px-6 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-xl text-xs font-serif uppercase tracking-widest font-bold disabled:opacity-40 transition-all cursor-pointer w-full"
            >
              Confirm Spiritual Consultation Slot
            </button>
          </div>

          {/* Individual Reviews log */}
          <div className="border-t border-orange-500/10 pt-5 space-y-4">
            <span className="text-[9px] font-bold text-orange-400 font-serif uppercase tracking-widest block">Initiate testimonials feedback:</span>
            
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
              {currentGuruReviews.length === 0 ? (
                <p className="text-xs text-gray-500 font-serif italic p-1">No previous evaluations for this Guru yet.</p>
              ) : (
                currentGuruReviews.map((rev, idx) => (
                  <div key={idx} className="p-3 bg-[#0a0502]/60 border border-orange-500/5 rounded-xl text-left text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-250 font-serif">{rev.studentName}</span>
                      <span className="text-[8px] text-gray-500 font-mono">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-0.5 text-amber-500">
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-400 font-serif leading-relaxed text-[11px]">{rev.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit review */}
            <div className="bg-[#0a0502] p-3.5 border border-orange-500/10 rounded-xl space-y-3">
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest font-serif block">Submit session evaluation:</p>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 font-serif">Stars rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStarInput(st)}
                      className={`p-1 font-semibold text-xs ${starInput >= st ? 'text-amber-500' : 'text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={textInput} 
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Share details of your learning breakthroughs..."
                  className="w-full bg-[#0c0604] text-xs text-gray-200 border border-orange-500/15 rounded-xl pl-3 pr-16 py-2.5 focus:outline-none focus:border-orange-500/50"
                />
                <button
                  onClick={handleAddReview}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-orange-600 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase font-serif"
                >
                  Submit
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* RAZORPAY & STRIPE TRANSACTION MODAL SIMULATOR */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-[#080402]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0705] border border-amber-500/40 p-6 sm:p-8 rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl">
            <div className="text-center space-y-4">
              
              {/* Payment Branding */}
              <div className="flex items-center justify-between border-b border-orange-500/10 pb-3 mb-2">
                <h4 className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">Secure Vedic Ingress Billing</h4>
                <span className="text-[9px] bg-indigo-950 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded uppercase font-bold font-mono">Stripe / Razorpay SDK</span>
              </div>

              <div className="text-left space-y-3.5 my-6 text-xs font-serif">
                <div className="flex justify-between border-b border-orange-500/5 pb-1">
                  <span className="text-gray-400">Recipient Lineage:</span>
                  <span className="text-gray-200 font-bold">{selectedGuru.name}</span>
                </div>
                <div className="flex justify-between border-b border-orange-500/5 pb-1">
                  <span className="text-gray-400">Scheduled Time slot:</span>
                  <span className="text-gray-200 font-mono font-bold">{selectedSlot}</span>
                </div>
                <div className="flex justify-between border-b border-orange-500/5 pb-1">
                  <span className="text-gray-400">Dakshina Fee amount:</span>
                  <span className="text-orange-400 font-bold">₹{selectedGuru.price}</span>
                </div>
                <div className="p-3 bg-[#0a0502] border border-orange-500/5 rounded-xl text-[11px] leading-relaxed text-gray-500 italic">
                  💸 Simulated fullstack checkout flow. No real currency will be charged from your checking account.
                </div>
              </div>

              {/* Slider checkout triggers */}
              {paymentDone ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1.5">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs text-emerald-300 font-serif font-bold">Dakshina Transaction Success!</p>
                  <p className="text-[10px] text-gray-400 font-mono">Verifying credentials blocks...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-[10px] text-[#f97316]/65 uppercase font-mono font-bold tracking-widest block">Slide gold controller to complete payment:</label>
                  <div className="relative bg-[#0a0502] p-1 rounded-2xl border border-orange-500/20 flex items-center h-12">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={paymentSliderVal}
                      onChange={handleSliderChange}
                      className="w-full appearance-none h-2 bg-orange-950/40 rounded-lg cursor-pointer accent-amber-500 focus:outline-none"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] tracking-widest text-[#f97316]/50 uppercase font-serif font-bold">
                      {"SLIDE >>> TO DEPOSIT"} ₹{selectedGuru.price}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setCheckoutOpen(false)}
                className="mt-6 text-xs text-gray-400 hover:text-white font-serif cursor-pointer"
              >
                Cancel transaction
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
