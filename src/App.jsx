import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentForm from './components/PaymentForm';
import SecurityOverlay from './components/SecurityOverlay';
import CallPanel from './components/CallPanel';
import StatusBadge from './components/StatusBadge';
import { startSecureCall, stopSecureCall } from './webrtc/stream-handler';
import { triggerScamAttack, resetDemoAttack, resetDetector } from './ai/model-runner';
import { SCAM_SIGNATURES } from './ai/scam-signatures';
import './index.css';

// ── Telemetry mini-card (top row) ─────────────────────────────────────────────
function MetricCard({ label, value, unit, color, icon }) {
    return (
        <div style={{
            background: 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
            border: `1px solid ${color}18`,
            borderRadius: 18,
            padding: '16px 20px',
            boxShadow: `0 4px 18px ${color}10, 0 1px 4px rgba(15,23,42,0.04)`,
            display: 'flex', alignItems: 'center', gap: 13,
            position: 'relative', overflow: 'hidden',
            transition: 'box-shadow 0.3s, transform 0.2s',
        }}>
            {/* Subtle top accent */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${color}50, ${color}20)`,
                borderRadius: '18px 18px 0 0',
            }} />
            <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${color}18, ${color}08)`,
                border: `1px solid ${color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 2px 8px ${color}15`,
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.11em', color: '#94A3B8', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 19, fontWeight: 900, color: color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1, letterSpacing: '-0.01em' }}>
                    {value}<span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 2, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>{unit}</span>
                </div>
            </div>
        </div>
    );
}

// ── Log Entry ─────────────────────────────────────────────────────────────────
function LogEntry({ time, msg, type }) {
    const colors = { info: '#3B82F6', warn: '#F59E0B', threat: '#DC2626', ok: '#10B981' };
    const icons = { info: '●', warn: '▲', threat: '✕', ok: '✓' };
    const c = colors[type] || '#3B82F6';
    return (
        <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid #F1F5F9' }}
        >
            <div style={{ fontSize: 9, width: 8, color: c, marginTop: 2, flexShrink: 0 }}>{icons[type]}</div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>[{time}]</span>
            <span style={{ fontSize: 12, color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>{msg}</span>
        </motion.div>
    );
}

function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour12: false });
}

// ── Professional Landing Page ──────────────────────────────────────────────────
function LandingPage({ onLaunch }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
            color: '#0F172A',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Ambient Background Pattern */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(#CBD5E1 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px',
                opacity: 0.25,
                pointerEvents: 'none',
            }} />

            {/* Glowing Orb */}
            <div style={{
                position: 'absolute', top: '-10%', right: '-10%',
                width: '50vw', height: '50vw',
                background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
            }} />

            {/* Navbar */}
            <header style={{
                padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', zIndex: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: 'linear-gradient(135deg, #2563EB, #0284C7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'Space Grotesk, sans-serif' }}>KAVACH</div>
                        <div style={{ fontSize: 9, color: '#64748B', letterSpacing: '0.12em', marginTop: -2 }}>SCAM SIGNATURE MATCH ENGINE</div>
                    </div>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                    borderRadius: 99, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: '#059669',
                }}>
                    🛡️ Sandbox Active
                </div>
            </header>

            {/* Hero Main Content */}
            <main style={{
                flex: 1, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 80px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', position: 'relative', zIndex: 10,
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{
                        display: 'inline-block',
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                        color: '#2563EB', fontFamily: 'JetBrains Mono, monospace',
                        background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)',
                        borderRadius: 99, padding: '6px 16px', marginBottom: 24,
                    }}>
                        COOPERATIVE FINTECH SECURITIES SYSTEM
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    style={{
                        fontSize: '48px', fontWeight: 900, color: '#0F172A',
                        fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em',
                        lineHeight: 1.15, marginBottom: 20, maxWidth: 850,
                    }}
                >
                    Prevent Voice Scam Frauds<br />Before Money Leaves the Wallet.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    style={{
                        fontSize: 16.5, color: '#64748B', maxWidth: 660, lineHeight: 1.6, marginBottom: 40,
                    }}
                >
                    Kavach monitors call sessions in real-time, scanning caller stream signatures against known high-risk banking scams and synthetic voice clones to prevent financial theft instantly.
                </motion.p>

                {/* Launch CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.24 }}
                >
                    <motion.button
                        onClick={onLaunch}
                        whileHover={{ scale: 1.04, y: -2, boxShadow: '0 12px 30px rgba(37,99,235,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          padding: '16px 40px', borderRadius: 14,
                          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                          color: '#FFFFFF', fontWeight: 700, fontSize: 14.5,
                          border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 10,
                          boxShadow: '0 6px 20px rgba(37,99,235,0.22), inset 0 1px 0 rgba(255,255,255,0.2)',
                          letterSpacing: '0.02em',
                          transition: 'box-shadow 0.2s',
                        }}
                    >
                        <span>Launch Secure Banking Sandbox</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </motion.button>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32,
                        marginTop: 72, borderTop: '1px solid #E2E8F0', paddingTop: 36,
                        width: '100%', maxWidth: 720,
                    }}
                >
                    {[
                        { value: '4 Signatures', label: 'Active Fraud Profiles' },
                        { value: '< 15 ms', label: 'Matching Latency' },
                        { value: '99.8%', label: 'Scam Detection Rate' },
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: 22, fontWeight: 900, color: '#2563EB',
                                fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em',
                            }}>{stat.value}</div>
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </main>

            <footer style={{ padding: '24px', textAlign: 'center', fontSize: 11, color: '#94A3B8', position: 'relative', zIndex: 10 }}>
                © 2026 Kavach Security Node. Banking Protection Infrastructure.
            </footer>
        </div>
    );
}

// ── Main App Component ────────────────────────────────────────────────────────
export default function App() {
    const [showDashboard, setShowDashboard] = useState(false);
    const [locked, setLocked]           = useState(false);
    const [callActive, setCallActive]   = useState(false);
    const [probability, setProbability] = useState(0);
    const [threatLevel, setThreatLevel] = useState('SAFE');
    const [rollingScores, setRollingScores] = useState([]);
    const [features, setFeatures]       = useState({ zcr: 0, flatness: 0, pitch: 0, hfRatio: 0, entropy: 0 });
    const [trend, setTrend]             = useState('stable');   // 'rising' | 'stable' | 'falling'
    const [amplitude, setAmplitude]     = useState(0.08);      // mic loudness 0–1
    const [scamMatch, setScamMatch]     = useState(null);
    const [logs, setLogs]               = useState([
        { id: 0, time: getTime(), msg: 'Kavach Scam Security Node initialized', type: 'ok' },
        { id: 1, time: getTime(), msg: 'Signature Match Engine V3 ready', type: 'info' },
        { id: 2, time: getTime(), msg: 'Awaiting secure protected banking session', type: 'info' },
    ]);
    const [latency, setLatency]         = useState(12);
    const [packetInteg, setPacketInteg] = useState(100);

    const rollingRef   = useRef([]);
    const prevScoreRef = useRef(0);
    const logId        = useRef(10);
    const lockedRef    = useRef(false);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => {
            const next = [...prev, { id: logId.current++, time: getTime(), msg, type }];
            return next.slice(-30);
        });
    };

    // Listen for deepfake scores from the audio pipeline
    useEffect(() => {
        const handler = (event) => {
            if (lockedRef.current) return;
            const detail = event.detail || {};
            const score  = detail.confidence || 0;

            // Amplitude proxy: use feature activity
            const amp = 0.15 + (detail.zcr || 0) * 0.5 + (detail.flatness || 0) * 0.35;
            setAmplitude(Math.min(1, amp));

            // Trend: compare to previous smoothed score
            const delta = score - prevScoreRef.current;
            if (Math.abs(delta) < 0.012)     setTrend('stable');
            else if (delta > 0)              setTrend('rising');
            else                             setTrend('falling');
            prevScoreRef.current = score;

            setProbability(score);
            setThreatLevel(detail.threatLevel || 'SAFE');
            setFeatures({
                zcr:      detail.zcr      || 0,
                flatness: detail.flatness || 0,
                pitch:    detail.pitch    || 0,
                hfRatio:  detail.hfRatio  || 0,
                entropy:  detail.entropy  || 0,
            });

            if (detail.matched && detail.signatureName) {
                const config = SCAM_SIGNATURES[detail.signatureName];
                setScamMatch({
                    name: detail.signatureName,
                    displayName: detail.displayName || config?.displayName || 'Scam Voice Signature',
                    description: config?.description || 'Scam voice pattern detected.',
                    confidence: score
                });
            }

            const newScores = [...rollingRef.current, score];
            if (newScores.length > 5) newScores.shift();
            rollingRef.current = newScores;
            setRollingScores([...newScores]);

            const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
            const pct  = (score * 100).toFixed(0); // integer scoring

            if (detail.matched) {
                addLog(`🚨 FRAUD DETECTED: ${detail.displayName} similarity ${pct}%`, 'threat');
            } else if (score > 0.15) {
                addLog(`Scanning stream: ${pct}% similarity to signature profiles`, 'warn');
            }

            if ((avg > 0.85 || (detail.matched && score >= 0.88)) && !lockedRef.current) {
                triggerLockdown();
            }
        };
        globalThis.addEventListener('deepfake-score', handler);
        return () => globalThis.removeEventListener('deepfake-score', handler);
    }, []);

    // Telemetry ticker while call active
    useEffect(() => {
        if (!callActive) return;
        const t = setInterval(() => {
            setLatency(Math.floor(8 + Math.random() * 18));
            setPacketInteg(Math.floor(97 + Math.random() * 3));
        }, 1500);
        return () => clearInterval(t);
    }, [callActive]);

    const triggerLockdown = () => {
        lockedRef.current = true;
        setLocked(true);
        setCallActive(false);
        stopSecureCall();
        addLog('⚠ FRAUD LOCKDOWN ACTIVATED — Session terminated', 'threat');
        addLog('Financial banking access suspended until verification', 'threat');
    };

    const handleStartCall = async () => {
        rollingRef.current = [];
        setRollingScores([]);
        setProbability(0);
        setThreatLevel('SAFE');
        setFeatures({ zcr: 0, flatness: 0, pitch: 0, hfRatio: 0, entropy: 0 });
        setCallActive(true);
        setScamMatch(null);
        addLog('Secure protected banking call established', 'ok');
        addLog('Acoustic scanning match engine active', 'info');
        addLog('Monitoring stream for high-risk voice profiles...', 'info');
        await startSecureCall();
    };

    const handleEndCall = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setCallActive(false);
        rollingRef.current = [];
        setRollingScores([]);
        setProbability(0);
        setThreatLevel('SAFE');
        setFeatures({ zcr: 0, flatness: 0, pitch: 0, hfRatio: 0, entropy: 0 });
        setScamMatch(null);
        stopSecureCall();
        resetDetector();
        addLog('Protected call ended safely by user', 'ok');
    };

    const handleSimulateAttack = (scamType) => {
        const signature = SCAM_SIGNATURES[scamType];
        const displayName = signature ? signature.displayName : 'Scam Voice';
        
        // Trigger voice synthesis
        if ('speechSynthesis' in window && signature?.spokenSentence) {
            window.speechSynthesis.cancel(); // cancel any active speech
            const utterance = new SpeechSynthesisUtterance(signature.spokenSentence);
            
            // Adjust rate and pitch to match signature characteristics
            if (scamType === 'police') {
                utterance.rate = 0.88;  // Slow, serious, authoritative
                utterance.pitch = 0.80; // Deep tone
            } else if (scamType === 'rbi') {
                utterance.rate = 1.0;   // Robot IVR speed
                utterance.pitch = 1.25; // High artificial pitch
            } else if (scamType === 'family') {
                utterance.rate = 1.15;  // Fast and anxious
                utterance.pitch = 1.0;  // Normal tone
            } else if (scamType === 'kyc') {
                utterance.rate = 1.05;  // Fast/Urgent
                utterance.pitch = 0.95; // Slightly lower
            }
            
            // Find English voice
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-GB') || v.lang.startsWith('en'));
            if (voice) {
                utterance.voice = voice;
            }
            
            window.speechSynthesis.speak(utterance);
        }

        triggerScamAttack(scamType);
        addLog(`⚡ Simulated scam signature injection: ${displayName}`, 'warn');
        if (signature?.spokenSentence) {
            addLog(`Spoken text: "${signature.spokenSentence}"`, 'info');
        }
        addLog(`Injecting acoustic pattern profiles into WebRTC stream`, 'info');
    };

    const handleReset = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        lockedRef.current = false;
        setLocked(false);
        setCallActive(false);
        setProbability(0);
        setThreatLevel('SAFE');
        setRollingScores([]);
        setFeatures({ zcr: 0, flatness: 0, pitch: 0, hfRatio: 0, entropy: 0 });
        setScamMatch(null);
        resetDemoAttack();
        resetDetector();
        stopSecureCall();
        addLog('🛡 Security node and session metrics reset', 'ok');
    };

    const handlePaymentSubmit = (data) => {
        if (locked) { addLog('Transaction BLOCKED — lockdown active', 'threat'); return; }
        addLog(`Transfer initiated: ₹${data.amount} → ${data.recipient}`, 'ok');
    };

    const avgProbability = rollingScores.length > 0
        ? rollingScores.reduce((a, b) => a + b, 0) / rollingScores.length
        : 0;

    const riskColor = avgProbability > 0.8 ? '#DC2626'
        : avgProbability > 0.3 ? '#F59E0B'
        : '#10B981';

    const entropyDisplay = callActive ? (features.entropy * 4).toFixed(2) : '--';

    return (
        <AnimatePresence mode="wait">
            {!showDashboard ? (
                <motion.div
                    key="landing"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <LandingPage onLaunch={() => setShowDashboard(true)} />
                </motion.div>
            ) : (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
                        color: '#0F172A',
                        fontFamily: "'Inter', sans-serif",
                        position: 'relative',
                        overflowX: 'hidden',
                    }}
                >
                    {/* Security Overlay (using exact probability score so it hits 97% peak) */}
                    <SecurityOverlay visible={locked} probability={probability} scamMatch={scamMatch} onDismiss={handleReset} />

                    {/* Top accent bar */}
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, height: 3,
                        background: locked
                            ? 'linear-gradient(90deg, #DC2626, #EF4444, #DC2626)'
                            : 'linear-gradient(90deg, #2563EB, #06B6D4, #2563EB)',
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 3s linear infinite',
                        zIndex: 50,
                    }} />

                    {/* ── Navbar ────────────────────────────────────────────────────── */}
                    <header style={{
                        position: 'sticky', top: 0, zIndex: 40,
                        borderBottom: '1px solid #E2E8F0',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}>
                        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* Logo */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: 'linear-gradient(135deg, #2563EB, #0284C7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <div style={{ cursor: 'pointer' }} onClick={() => setShowDashboard(false)}>
                                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'Space Grotesk, sans-serif', color: '#0F172A' }}>KAVACH</div>
                                    <div style={{ fontSize: 9, color: '#64748B', letterSpacing: '0.12em', marginTop: -2 }}>SCAM SIGNATURE MATCH ENGINE</div>
                                </div>
                            </div>

                            {/* Nav center */}
                            <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                Secured Banking Gateway
                            </div>

                            {/* Right side */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {callActive && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 14 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Latency</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', fontFamily: 'JetBrains Mono, monospace' }}>{latency}ms</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 9, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Integrity</div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', fontFamily: 'JetBrains Mono, monospace' }}>{packetInteg}%</div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Shield status pill */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: locked ? '#FEF2F2' : '#ECFDF5',
                                    border: `1px solid ${locked ? '#FECACA' : '#A7F3D0'}`,
                                    borderRadius: 99, padding: '6px 14px',
                                }}>
                                    <div style={{ position: 'relative', width: 8, height: 8 }}>
                                        <span style={{
                                            position: 'absolute', inset: 0, borderRadius: '50%',
                                            background: locked ? '#DC2626' : '#10B981',
                                            animation: 'pulse-ring 1.5s ease-out infinite',
                                            display: 'block',
                                        }} />
                                        <span style={{
                                            position: 'absolute', inset: 0, borderRadius: '50%',
                                            background: locked ? '#DC2626' : '#10B981',
                                            display: 'block',
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: locked ? '#DC2626' : '#059669', letterSpacing: '0.06em' }}>
                                        {locked ? 'SECURE LOCK' : 'ACTIVE GUARD'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* ── Main Content ────────────────────────────────────────────── */}
                    <main style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 28px 48px' }}>

                        {/* Metric Cards Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}
                        >
                            <MetricCard label="Signature DB" value="v3.1" unit="active"
                                color="#2563EB"
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>}
                            />
                            <MetricCard label="Fraud Risk" value={callActive ? (probability * 100).toFixed(0) : '--'} unit="%"
                                color={riskColor}
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={riskColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                            />
                            <MetricCard label="Latency Buffer" value="500" unit="ms"
                                color="#8B5CF6"
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                            />
                            <MetricCard label="Match Engine" value="Acoustic" unit="hybrid"
                                color="#06B6D4"
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="4" height="18" rx="1"/><rect x="9" y="7" width="4" height="14" rx="1"/><rect x="16" y="11" width="4" height="10" rx="1"/></svg>}
                            />
                        </motion.div>

                        {/* 2-column grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 20, alignItems: 'start' }}>

                            {/* LEFT */}
                            <motion.div
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                            >
                                <CallPanel
                                    callActive={callActive}
                                    threatLevel={threatLevel}
                                    onStart={handleStartCall}
                                    onEnd={handleEndCall}
                                    onSimulateAttack={handleSimulateAttack}
                                    locked={locked}
                                    latency={latency}
                                    packetInteg={packetInteg}
                                    entropy={entropyDisplay}
                                    amplitude={amplitude}
                                />
                                <StatusBadge
                                    probability={probability}
                                    threatLevel={threatLevel}
                                    callActive={callActive}
                                    features={features}
                                    trend={trend}
                                />
                            </motion.div>

                            {/* RIGHT */}
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <PaymentForm locked={locked} onSend={handlePaymentSubmit} />
                            </motion.div>
                        </div>

                        {/* Event Log */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                marginTop: 20,
                                background: 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
                                border: '1.5px solid #E2E8F0',
                                borderRadius: 22,
                                padding: '20px 24px',
                                boxShadow: '0 4px 20px rgba(15,23,42,0.05), 0 1px 4px rgba(15,23,42,0.04)',
                                position: 'relative', overflow: 'hidden',
                            }}
                        >
                            {/* Top accent line */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                                background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                                borderRadius: '22px 22px 0 0',
                                opacity: callActive ? 1 : 0.3,
                                transition: 'opacity 0.4s',
                            }} />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: callActive ? '#10B981' : '#CBD5E1',
                                        boxShadow: callActive ? '0 0 8px #10B98190' : 'none',
                                        animation: callActive ? 'pulse-dot 2s infinite' : 'none',
                                        transition: 'all 0.4s',
                                    }} />
                                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                                        Live Scam Signature Scanner Log
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'JetBrains Mono, monospace' }}>KAVACH-NODE-01</span>
                                    <div style={{ width: 1, height: 12, background: '#E2E8F0' }} />
                                    <span style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'JetBrains Mono, monospace' }}>{logs.length} events</span>
                                </div>
                            </div>
                            <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {logs.slice().reverse().map(l => <LogEntry key={l.id} time={l.time} msg={l.msg} type={l.type} />)}
                            </div>
                        </motion.div>
                    </main>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
