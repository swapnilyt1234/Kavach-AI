import React, { useState, useEffect, useRef } from 'react';
import PaymentForm from './components/PaymentForm';
import SecurityOverlay from './components/SecurityOverlay';
import CallPanel from './components/CallPanel';
import StatusBadge from './components/StatusBadge';
import { startSecureCall, stopSecureCall } from './webrtc/stream-handler';

export default function App() {
    const [locked, setLocked] = useState(false);
    const [callActive, setCallActive] = useState(false);
    const [probability, setProbability] = useState(0);
    const [rollingScores, setRollingScores] = useState([]);
    
    // Use ref to track scores inside the event listener without dependency issues
    const rollingScoresRef = useRef([]);

    useEffect(() => {
        const handleDeepfakeScore = (event) => {
            const newScore = event.detail?.probability || 0;
            setProbability(newScore);
            
            const newScores = [...rollingScoresRef.current, newScore];
            // Keep last 5 scores
            if (newScores.length > 5) {
                newScores.shift();
            }
            
            rollingScoresRef.current = newScores;
            setRollingScores(newScores);

            // Compute rolling average
            const average = newScores.reduce((a, b) => a + b, 0) / newScores.length;
            
            // Trigger lockdown if rolling average > 0.85
            if (average > 0.85) {
                handleLockdown();
            }
        };

        window.addEventListener('deepfake-score', handleDeepfakeScore);
        
        return () => {
            window.removeEventListener('deepfake-score', handleDeepfakeScore);
        };
    }, []);

    const handleLockdown = () => {
        setLocked(true);
        setCallActive(false);
        stopSecureCall();
    };

    const handleStartCall = async () => {
        setCallActive(true);
        rollingScoresRef.current = [];
        setRollingScores([]);
        setProbability(0);
        await startSecureCall();
    };

    const handleEndCall = () => {
        setCallActive(false);
        rollingScoresRef.current = [];
        setRollingScores([]);
        setProbability(0);
        stopSecureCall();
    };

    const handlePaymentSubmit = (data) => {
        if (locked) {
            alert('Transaction Blocked: Security Lockdown Active');
            return;
        }
        alert('Transaction Submitted Securely');
    };

    // Use rolling average or current probability for display
    const averageProbability = rollingScores.length > 0 
        ? rollingScores.reduce((a, b) => a + b, 0) / rollingScores.length 
        : 0;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 md:p-12 relative overflow-x-hidden">
            {/* Cyber Security Background Effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <SecurityOverlay visible={locked} probability={averageProbability} />

            {/* Top Navbar */}
            <header className="max-w-6xl mx-auto mb-16 flex items-center justify-between relative z-10 border-b border-gray-800 pb-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-400/20">
                        K
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                            Kavach Web Audio
                        </h1>
                        <p className="text-sm text-blue-400 font-mono tracking-widest uppercase mt-1 flex items-center gap-2">
                            <span>Enterprise Security Node</span>
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            <span className="text-gray-500">v2.4.1</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/80 px-6 py-3 rounded-2xl border border-gray-800 shadow-inner">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <span className="text-sm font-bold text-gray-300 tracking-wider">SYSTEM ACTIVE</span>
                </div>
            </header>

            {/* Main Dashboard */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                
                {/* Left Column */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div>
                        <CallPanel 
                            callActive={callActive}
                            onStart={handleStartCall}
                            onEnd={handleEndCall}
                            locked={locked}
                        />
                    </div>
                    
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/80 p-8 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center h-full min-h-[200px]">
                        <div className="w-full flex items-center justify-between mb-8 border-b border-gray-800 pb-3">
                            <h3 className="text-gray-400 font-mono text-sm tracking-widest">ANALYSIS STATUS</h3>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        
                        {callActive ? (
                            <div className="transform scale-110">
                                <StatusBadge 
                                    probability={probability} 
                                    isFake={probability > 0.5} 
                                />
                            </div>
                        ) : (
                            <div className="text-gray-500 font-mono text-sm border border-gray-800/50 px-6 py-4 rounded-xl bg-black/30 flex items-center gap-3">
                                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                                WAITING FOR AUDIO STREAM
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 flex justify-center items-center">
                    <div className="w-full">
                        <PaymentForm 
                            locked={locked} 
                            onSend={handlePaymentSubmit} 
                        />
                    </div>
                </div>
                
            </main>
        </div>
    );
}
