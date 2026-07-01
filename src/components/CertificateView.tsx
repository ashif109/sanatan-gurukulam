import React from 'react';
import { Certificate } from '../types';
import { Award, ShieldCheck, Printer, CheckCircle } from 'lucide-react';

interface CertificateViewProps {
  certificate: Certificate;
}

export default function CertificateView({ certificate }: CertificateViewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-4 sm:p-8 max-w-4xl mx-auto shadow-2xl sacred-glow" id="certificate-viewer">
      
      {/* Certification frame with sacred luxury styling */}
      <div 
        id="printable-cert-frame"
        className="relative bg-[#0d0705] text-gray-900 border-4 border-amber-500/80 p-6 sm:p-10 rounded-xl overflow-hidden font-serif select-none"
        style={{ backgroundImage: 'radial-gradient(circle at center, #1b0f0a 0%, #0d0705 100%)' }}
      >
        
        {/* Intricate Corner Decorative Accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 opacity-80"></div>
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 opacity-80"></div>
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 opacity-80"></div>
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 opacity-80"></div>

        {/* Framing border line */}
        <div className="border border-gray-200 p-4 sm:p-6 rounded-lg flex flex-col items-center text-center">
          
          {/* Header section with Shining gold OM symbol */}
          <div className="flex flex-col items-center mb-4">
            <div className="text-3xl text-amber-550 font-serif drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse mb-1">
              ॐ
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-[var(--color-occult-magenta)] font-serif">
              प्रमाण पत्रम् | CERTIFICATE
            </h2>
            <p className="text-[10px] text-[var(--color-occult-purple)] uppercase tracking-widest font-mono mt-0.5">
              SANATAN GURUKUL ACADEMY
            </p>
          </div>

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent my-4"></div>

          {/* Student details */}
          <p className="text-xs text-[var(--color-occult-purple)] font-serif italic mb-3">This sacred credential affirms that</p>
          <p className="text-2xl sm:text-3xl font-bold tracking-wide text-gray-900 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] my-2">
            {certificate.studentName}
          </p>

          <p className="text-xs sm:text-sm text-gray-600 max-w-lg leading-relaxed font-serif my-3 px-2">
            has successfully achieved the degree of <span className="text-[var(--color-occult-magenta)] font-bold font-serif">{certificate.courseTitle}</span> after reviewing and masterfully executing the comprehensive certified curriculum, scriptural examinations (MCQs) and evaluations.
          </p>

          <div className="w-16 h-[1px] bg-amber-500/30 my-4"></div>

          {/* Verification, signatures & metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-end mt-4 pt-4 border-t border-gray-200">
            
            {/* Left signature */}
            <div className="flex flex-col items-center justify-end">
              <span className="font-serif italic text-sm text-[var(--color-occult-purple)] font-bold tracking-wider">आचार्य रामचन्द्र</span>
              <div className="w-24 h-px bg-amber-500/20 my-1"></div>
              <p className="text-[9px] text-[#f97316]/60 uppercase font-mono tracking-widest font-bold">Principal Guru Signature</p>
            </div>

            {/* Middle QR Code placeholder */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#160d0a] p-1 border border-amber-500/20 rounded flex items-center justify-center shadow-inner">
                {/* Visual vectors for mock check QR */}
                <svg className="w-full h-full text-[var(--color-occult-magenta)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM14 14h2v2h-2zM18 18h3v3h-3zM14 18h2v3h-2zM18 14h3v2h-3z" />
                </svg>
              </div>
              <p className="text-[8px] text-gray-500 mt-1.5 font-mono uppercase tracking-wider">Verify ID: SG-{certificate.id.slice(6, 11) || "10291"}</p>
            </div>

            {/* Right signature */}
            <div className="flex flex-col items-center justify-end">
              <span className="font-serif italic text-xs text-[var(--color-occult-purple)]">Sankalp AI Board</span>
              <div className="w-24 h-px bg-amber-500/20 my-1"></div>
              <p className="text-[9px] text-[#f97316]/60 uppercase font-mono tracking-widest font-bold">Academic Registry Lead</p>
            </div>

          </div>

          {/* Verification Code Footer */}
          <div className="mt-6 border-t border-orange-500/5 w-full pt-3 flex flex-col sm:flex-row items-center justify-between text-[9px] text-gray-500 font-mono">
            <p>Cryptographic Hash: <span className="font-bold text-[var(--color-occult-magenta)]">{certificate.id}</span></p>
            <p className="mt-1 sm:mt-0">Dasha Date: {new Date(certificate.issuedAt).toLocaleDateString()} (Brahma Muhurta)</p>
          </div>

        </div>
      </div>

      {/* Controller Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
        <div className="flex items-center space-x-2 text-gray-500">
          <ShieldCheck className="w-4 h-4 text-[var(--color-occult-purple)] shrink-0" />
          <span className="text-xs">Lineage verified. Deployed to the decentralized Vedic ledger.</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 bg-gray-50 hover:bg-orange-950/20 text-[var(--color-occult-purple)] hover:text-orange-300 rounded-xl border border-gray-300 transition-all cursor-pointer font-serif tracking-widest font-bold text-[10px] uppercase"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT CREDENTIAL</span>
          </button>
        </div>
      </div>

    </div>
  );
}
