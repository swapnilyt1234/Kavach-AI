import React from 'react';

export default function StatusBadge({ probability, isFake }) {
    const percentage = probability !== undefined ? (probability * 100).toFixed(1) : 0;
    
    return (
        <div className={`px-4 py-2 rounded-xl border-2 font-bold flex items-center gap-3 transition-colors duration-300 shadow-sm ${isFake ? 'bg-red-100 text-red-800 border-red-500' : 'bg-green-100 text-green-800 border-green-500'}`}>
            <div className={`w-3 h-3 rounded-full animate-pulse shadow-sm ${isFake ? 'bg-red-600 shadow-red-500/50' : 'bg-green-500 shadow-green-500/50'}`}></div>
            <div>
                <span className="tracking-wide uppercase text-sm md:text-base">
                    {isFake ? 'FAKE AUDIO DETECTED' : 'REAL AUDIO'}
                </span>
                <span className="ml-2 font-mono text-sm opacity-80">
                    ({percentage}%)
                </span>
            </div>
        </div>
    );
}
