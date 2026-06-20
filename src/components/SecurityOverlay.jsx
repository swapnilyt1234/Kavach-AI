import React from 'react';

export default function SecurityOverlay({ visible, probability }) {
    if (!visible) return null;

    const confidence = probability ? (probability * 100).toFixed(1) : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-red-950 p-4 overflow-hidden">
            {/* Animated Pulse Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] bg-red-600 rounded-full opacity-10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            </div>
            
            {/* Overlay Content Card */}
            <div className="relative z-10 w-full max-w-4xl border-4 border-red-600 bg-red-950/80 shadow-[0_0_120px_rgba(220,38,38,0.5)] backdrop-blur-xl rounded-3xl p-10 md:p-16 text-center transform scale-100 animate-in fade-in zoom-in duration-300">
                
                {/* Warning Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-red-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
                        <svg className="relative w-28 h-28 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-red-500 tracking-widest mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] uppercase">
                    Synthetic Audio Detected
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-10 tracking-wider">
                    Potential Financial Fraud Attempt
                </h2>

                <div className="inline-block bg-black/50 border border-red-800 rounded-2xl px-10 py-5 mb-10 shadow-inner">
                    <p className="text-2xl text-red-400 font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-3">
                        Detected Confidence: 
                        <span className="text-red-500 text-3xl">{confidence}%</span>
                    </p>
                </div>

                <div className="bg-red-900/40 border-l-8 border-red-600 p-6 md:p-8 text-left rounded-r-xl">
                    <p className="text-2xl md:text-3xl font-black text-red-100 uppercase tracking-widest animate-pulse">
                        Financial Access Terminated
                    </p>
                    <p className="text-red-200 mt-3 text-lg font-medium leading-relaxed">
                        All transaction capabilities and session privileges have been immediately revoked. The Kavach Security Network has logged this event for forensic analysis.
                    </p>
                </div>
            </div>
            
            {/* Scanlines Effect for Cyber Feel */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCINCi8+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LCAwLCAwLCAwLjA3KSIvPgo8L3N2Zz4=')] opacity-70 z-50"></div>
        </div>
    );
}
