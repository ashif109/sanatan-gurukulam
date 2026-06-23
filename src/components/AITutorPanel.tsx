import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquare, Trash2, Bot, Bookmark, Copy, CheckCircle, HelpCircle } from 'lucide-react';
import { Course } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AITutorPanelProps {
  currentCourse: Course | null;
  onQuizLoaded?: (quiz: any) => void;
  onNotesGenerated?: (notes: string) => void;
  onNavigate?: (tab: string) => void;
}

export default function AITutorPanel({ currentCourse, onQuizLoaded, onNotesGenerated, onNavigate }: AITutorPanelProps) {
  const selectedCourse = currentCourse;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-welcome",
      sender: "ai",
      text: `Hari Om! 🙏 I am **Sankalp - your Sanatan Gurukul AI Guru**.

I have deep lineage comprehension across the **4 Vedas**, the major **Upanishads**, the **Srimad Bhagavad Gita**, and specialized auxiliary fields like **Jyotish** and **Sanskrit Paninian Grammar**.

How can I guide you in your spiritual and academic seeker's path today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedResponses, setSavedResponses] = useState<{ id: string; title: string; text: string }[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Suggested classical Vedic queries
  const SUGGESTED_CHIPS = [
    { label: "Decode Gita 2.47 (Karma Yoga)", query: "Explain Bhagavad Gita Chapter 2 Verse 47. Provide Sanskrit text, word-by-word sandhi breakdown, pronunciation guide, and ethical commentary." },
    { label: "Sanskrit Sandhi Rules", query: "Explain Svara Sandhi rules with examples based on Panini's grammar." },
    { label: "Jyotish: Role of 9th House", query: "What is the cosmic significance of the 9th House (Bhagya Bhava) in Kundali analysis? How does it affect a person's life mission?" },
    { label: "Rigveda Chants: meaning", query: "Explain the sacred Rigvedic Gaytri Mantra 'Om Bhur Bhuvah Svah' sound syllable acoustics and spiritual significance." }
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText("");
    setLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          courseContext: selectedCourse ? {
            title: selectedCourse.title,
            category: selectedCourse.category,
            highlights: selectedCourse.highlights
          } : null,
          messageHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      
      const aiResponseText = data.response;
      
      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      const errMsg: Message = {
        id: `msg-err-${Date.now()}`,
        sender: "ai",
        text: "My apologies, seeker. The energetic transmission channels are currently fluctuating. Please verify your GEMINI_API_KEY settings and try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResponse = (text: string) => {
    // Take the first 30 chars as title
    const snippet = text.replace(/[#*`]/g, '').trim().slice(0, 35) + "...";
    const newSaved = {
      id: `saved-${Date.now()}`,
      title: snippet,
      text: text
    };
    setSavedResponses(prev => [...prev, newSaved]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedResponses(prev => prev.filter(item => item.id !== id));
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-[#0c0604] border border-orange-500/20 rounded-2xl p-4 sm:p-5 h-[620px] flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.5)] sacred-glow">
      
      {/* Title Header with Glowing Aura */}
      <div className="flex items-center justify-between pb-3.5 border-b border-orange-500/10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-2.5 rounded-xl shadow-lg shadow-orange-600/10">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm tracking-widest text-orange-400">SANKALP VEDIC AI GURU</h3>
            <p className="text-[9px] text-[#f97316]/60 font-mono tracking-wider uppercase font-semibold">Gemini 2.5 Neural Shastra Core</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${
              showSavedOnly 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'text-orange-450 hover:bg-orange-950/20 text-[#f97316]'
            }`}
          >
            Saved Sutras ({savedResponses.length})
          </button>
          
          <button
            onClick={() => setMessages([{
              id: "ai-welcome",
              sender: "ai",
              text: "Hari Om! The study session has been refreshed. How can I aid your lineage path?",
              timestamp: new Date().toISOString()
            }])}
            className="p-1.5 text-gray-500 hover:text-orange-400 transition-colors rounded-lg hover:bg-orange-950/10"
            title="Clear Chat Thread"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showSavedOnly ? (
        /* Saved Responses Display Pane */
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 font-sans">
          {savedResponses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bot className="w-8 h-8 text-orange-500/30 mx-auto mb-2" />
              <p className="text-xs font-serif">No custom sutras are saved in this session.</p>
              <p className="text-[10px] text-gray-650 mt-1">Click the bookmark icon underneath any AI answer to store it.</p>
            </div>
          ) : (
            savedResponses.map(item => (
              <div key={item.id} className="p-4 bg-orange-950/5 border border-orange-500/10 rounded-xl relative">
                <h4 className="text-xs font-serif font-bold text-orange-400 border-b border-orange-500/5 pb-1 mb-2 tracking-wide uppercase">{item.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">{item.text}</p>
                <div className="flex items-center justify-end space-x-2 mt-3 text-[10px]">
                  <button 
                    onClick={() => handleCopyText(item.text)}
                    className="px-2.5 py-1 bg-orange-950/30 text-gray-300 rounded hover:text-white hover:bg-orange-950/50"
                  >
                    Copy
                  </button>
                  <button 
                    onClick={() => handleDeleteSaved(item.id)}
                    className="px-2.5 py-1 bg-red-950/30 text-red-400 rounded hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Dynamic Chat Stream Window */
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Scrollable messages box */}
          <div className="flex-1 overflow-y-auto py-3.5 space-y-4 px-1 scrollbar-thin">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
              >
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-gradient-to-tr from-orange-600/90 to-amber-600 text-white rounded-br-none shadow-md shadow-orange-900/10'
                    : 'bg-[#120a06] border border-orange-500/10 text-gray-200 rounded-bl-none font-sans'
                }`}>
                  
                  {/* Sender title */}
                  <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono uppercase font-bold tracking-wider opacity-60">
                    <span>{m.sender === 'user' ? currentUserLabel() : 'Sankalp Guru'}</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>

                  {/* Rendered content */}
                  <div className="prose prose-invert max-w-none break-words whitespace-pre-wrap font-sans text-gray-300">
                    {m.text}
                  </div>

                  {/* AI Interactions underneath block */}
                  {m.sender === 'ai' && m.id !== 'ai-welcome' && (
                    <div className="flex items-center space-x-2 mt-3.5 pt-2 border-t border-orange-500/5 justify-end">
                      <button 
                        onClick={() => handleCopyText(m.text)}
                        className="text-[10px] text-gray-500 hover:text-orange-400 flex items-center space-x-1 cursor-pointer"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      <button 
                        onClick={() => handleSaveResponse(m.text)}
                        className="text-[10px] text-gray-500 hover:text-amber-400 flex items-center space-x-1 cursor-pointer"
                        title="Save response to Sutras"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#120a06] border border-orange-500/10 rounded-2xl rounded-bl-none p-4 max-w-[80%] flex items-center space-x-2 text-xs text-orange-400 animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="font-serif italic text-orange-400/80">Communing with original palm-leaf Shastras...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Presets Grid */}
          {messages.length <= 1 && (
            <div className="p-1 pb-3 shrink-0">
              <p className="text-[9px] font-bold tracking-widest text-[#f97316]/50 uppercase font-serif mb-2">sacred query seeds:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.query)}
                    className="p-2.5 rounded-xl bg-[#0f0805] hover:bg-orange-950/20 border border-orange-500/5 hover:border-orange-500/20 text-left text-[11px] text-gray-400 hover:text-orange-300 transition-all cursor-pointer truncate"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Trigger Container */}
          <div className="border-t border-orange-500/10 pt-3 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask Sankalp Guru about Shlokas, Jyotish, or Vedic philosophies..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
                className="w-full bg-[#0f0805] text-xs text-gray-200 border border-orange-500/20 rounded-xl pl-3.5 pr-12 py-3 focus:outline-none focus:border-orange-500/50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputText.trim()}
                className="absolute right-2 p-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );

  function currentUserLabel() {
    return "Sadhak Seeker";
  }
}
