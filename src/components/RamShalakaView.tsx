import React, { useState, useEffect } from 'react';
import { generateGrid, resolveChaupai, cryptoRandomSelect, RamShalakaResult } from '../utils/ramShalakaEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, BookOpen, AlertCircle } from 'lucide-react';
import { Language, t } from '../localization';
import './RamShalakaView.css';

interface RamShalakaViewProps {
  language: Language;
}

const RamShalakaView: React.FC<RamShalakaViewProps> = ({ language }) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [result, setResult] = useState<RamShalakaResult | null>(null);
  const [animatingSequence, setAnimatingSequence] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  useEffect(() => {
    setGrid(generateGrid());
  }, []);

  const handleCellClick = (index: number) => {
    if (isAnimating) return;
    const res = resolveChaupai(index);
    startAnimation(res);
  };

  const handleRandomSelect = () => {
    if (isAnimating) return;
    const res = cryptoRandomSelect();
    startAnimation(res);
  };

  const startAnimation = (res: RamShalakaResult) => {
    setResult(null);
    setIsAnimating(true);
    setAnimatingSequence([]);
    
    let step = 0;
    const sequenceIndices: number[] = [];
    
    for (let i = 0; i < 25; i++) {
      sequenceIndices.push((res.selectedCellIndex + (i * 9)) % 225);
    }

    const interval = setInterval(() => {
      setAnimatingSequence(prev => [...prev, sequenceIndices[step]]);
      step++;
      
      if (step >= 25) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimating(false);
          setResult(res);
        }, 800);
      }
    }, 100);
  };

  const reset = () => {
    setResult(null);
    setAnimatingSequence([]);
    setIsAnimating(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-4 font-serif">
          {language === 'hi' ? 'श्री राम शलाका प्रश्नावली' : 'Shri Ram Shalaka Prashnavali'}
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto italic">
          {language === 'hi' 
            ? 'अपनी आँखें बंद करें, प्रभु श्रीराम का स्मरण करें, अपने मन में एक स्पष्ट प्रश्न सोचें, और नीचे दिए गए चक्र में कहीं भी क्लिक करें।' 
            : 'Close your eyes, remember Lord Rama, hold a clear question in your mind, and tap anywhere on the grid below.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-8 shadow-2xl border border-white/10 overflow-hidden relative">
              {isAnimating && (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center backdrop-blur-sm transition-all">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-4" />
                    <p className="text-orange-300 font-semibold text-lg animate-pulse">
                      {language === 'hi' ? 'प्रभु की आज्ञा प्राप्त हो रही है...' : 'Seeking Divine Guidance...'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-15 gap-1 sm:gap-1.5 md:gap-2">
                {grid.map((syllable, i) => {
                  const isHighlighted = animatingSequence.includes(i);
                  const isFirst = animatingSequence[0] === i;
                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: isAnimating ? 1 : 1.2, zIndex: 10 }}
                      onHoverStart={() => !isAnimating && setHoveredCell(i)}
                      onHoverEnd={() => !isAnimating && setHoveredCell(null)}
                      onClick={() => handleCellClick(i)}
                      className={`
                        w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center 
                        text-xs sm:text-sm md:text-base font-medium font-serif cursor-pointer
                        transition-all duration-300 rounded-sm
                        ${isFirst ? 'bg-orange-500 text-white scale-125 shadow-[0_0_15px_rgba(249,115,22,0.8)] z-20' : 
                          isHighlighted ? 'bg-orange-400/80 text-white scale-110 shadow-[0_0_10px_rgba(251,146,60,0.6)] z-10' : 
                          hoveredCell === i ? 'bg-orange-600/30 text-orange-200 border border-orange-500/50' :
                          'bg-white/5 text-gray-300 border border-white/5 hover:border-orange-500/50'}
                      `}
                    >
                      {syllable}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRandomSelect}
                disabled={isAnimating}
                className="group relative flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-orange-600 to-red-600 border border-transparent rounded-full shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                {language === 'hi' ? 'प्रभु स्वयं मार्गदर्शन करें' : 'Let Ram Guide Me'}
              </motion.button>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {language === 'hi' 
                  ? 'यह एक पूर्णतः प्रामाणिक 15x15 राम शलाका चक्र है।' 
                  : 'This is a mathematically authentic 15x15 Ram Shalaka grid.'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 shadow-2xl">
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-red-600/10 blur-3xl"></div>
              
              <div className="relative p-8 sm:p-12">
                <div className="flex justify-center mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 font-medium text-sm tracking-wide border border-orange-500/30 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {result.chaupai.theme}
                  </span>
                </div>

                <div className="text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 font-serif leading-relaxed mb-4">
                    "{result.chaupai.devanagari}"
                  </h2>
                  <p className="text-lg text-gray-400 font-medium italic">
                    {result.chaupai.transliteration}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-orange-500">अ</span> अर्थ (Hindi)
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {result.chaupai.translation_hi}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="text-orange-500">A</span> Meaning (English)
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {result.chaupai.translation_en}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-950/50 to-red-950/50 rounded-2xl p-6 md:p-8 border border-orange-500/40 shadow-inner text-center">
                  <h3 className="text-xl font-bold text-orange-400 mb-4 uppercase tracking-widest text-sm">
                    {language === 'hi' ? 'दिव्य मार्गदर्शन' : 'Divine Guidance'}
                  </h3>
                  <p className="text-xl text-white font-medium leading-relaxed">
                    {result.chaupai.guidance_summary}
                  </p>
                </div>

                <div className="mt-12 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={reset}
                    className="inline-flex items-center px-6 py-3 border-2 border-orange-500/50 text-orange-400 font-medium rounded-full hover:bg-orange-500/10 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {language === 'hi' ? 'पुनः प्रश्न पूछें' : 'Ask Another Question'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RamShalakaView;
