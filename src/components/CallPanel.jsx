import React from 'react';

export default function CallPanel({ callActive, onStart, onEnd, locked }) {
    const handleSimulateAttack = () => {
        window.dispatchEvent(
            new CustomEvent("deepfake-score", {
                detail: {
                    probability: 0.98
                }
            })
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Secure Support Line</h2>
                    <p className="text-gray-500 text-sm">WebRTC Encrypted Connection</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 relative z-10">
                {!callActive ? (
                    <button 
                        onClick={onStart}
                        disabled={locked}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md flex justify-center items-center gap-2 transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        <span>📞</span> Start Secure Call
                    </button>
                ) : (
                    <button 
                        onClick={onEnd}
                        disabled={locked}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md flex justify-center items-center gap-2 transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                        <span>📞</span> End Call
                    </button>
                )}
            </div>
            
            {/* Simulate Deepfake Attack Section */}
            <div className="mt-4 pt-6 border-t border-gray-100 relative z-10">
                <button 
                    onClick={handleSimulateAttack}
                    disabled={locked || !callActive}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3 px-6 rounded-xl transition duration-200 border border-purple-200 flex justify-center items-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Simulate Deepfake Attack
                </button>
                {!callActive && <p className="text-xs text-center text-gray-400 mt-2 font-medium">Start a call to enable simulation</p>}
            </div>
            
            {/* Background decoration */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 rounded-full opacity-50 z-0"></div>
        </div>
    );
}
