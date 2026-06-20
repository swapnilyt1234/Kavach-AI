import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentForm from './components/PaymentForm';
import SecurityOverlay from './components/SecurityOverlay';
import CallPanel from './components/CallPanel';
import StatusBadge from './components/StatusBadge';
import { startSecureCall, stopSecureCall } from './webrtc/stream-handler';
import '../src/index.css';

// ── Telemetry mini-card ─────────────────────────────────────────────────────
function TelemetryCard({ label, value, unit, color = '#3B82F6' }) {
    return (
        <div style={{
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: '12px 16px',
        }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>
                {value}<span style={{ fontSize: 11, color: '#64748B', marginLeft: 3 }}>{unit}</span>
            </p>
        </div>
    );
}

// ── Event log item ──────────────────────────────────────────────────────────
function LogLine({ time, msg, type = 'info' }) {
    const colors = { info: '#3B82F6', warn: '#F59E0B', threat: '#EF4444', ok: '#10B981' };
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
        >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569', flexShrink: 0 }}>[{time}]</span>
            <span style={{ fontSize: 12, color: colors[type] || '#CBD5E1', fontFamily: "'JetBrains Mono', monospace" }}>{msg}</span>
        </motion.div>
    );
}

function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour12: false });
}

export default function App() {
    const [locked, setLocked]           = useState(false);
    const [callActive, setCallActive]   = useState(false);
    const [probability, setProbability] = useState(0);
    const [rollingScores, setRollingScores] = useState([]);
    const [logs, setLogs]               = useState([
        { id: 0, time: getTime(), msg: 'Kavach Security Node initialized', type: 'ok' },
        { id: 1, time: getTime(), msg: 'WebNN inference engine ready', type: 'info' },
    ]);
    const [latency, setLatency]   = useState(12);
    const [packetInteg, setPacketInteg] = useState(100);
    const rollingScoresRef = useRef([]);
    const logId = useRef(10);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => {
            const next = [...prev, { id: logId.current++, time: getTime(), msg, type }];
            return next.slice(-20); // keep last 20
        });
    };

    useEffect(() => {
        const handleDeepfakeScore = (event) => {
            const newScore = event.detail?.probability || 0;
            setProbability(newScore);

            const newScores = [...rollingScoresRef.current, newScore];
            if (newScores.length > 5) newScores.shift();
            rollingScoresRef.current = newScores;
            setRollingScores(newScores);

            const pct = (newScore * 100).toFixed(1);
            const type = newScore > 0.8 ? 'threat' : newScore > 0.4 ? 'warn' : 'ok';
            addLog(`Deepfake probability: ${pct}%`, type);

            const average = newScores.reduce((a, b) => a + b, 0) / newScores.length;
            if (average > 0.85) handleLockdown();
        };

        window.addEventListener('deepfake-score', handleDeepfakeScore);
        return () => window.removeEventListener('deepfake-score', handleDeepfakeScore);
    }, []);

    // Simulate telemetry fluctuations when call active
    useEffect(() => {
        if (!callActive) return;
        const t = setInterval(() => {
            setLatency(Math.floor(8 + Math.random() * 18));
            setPacketInteg(Math.floor(97 + Math.random() * 3));
        }, 1500);
        return () => clearInterval(t);
    }, [callActive]);

    const handleLockdown = () => {
        setLocked(true);
        setCallActive(false);
        stopSecureCall();
        addLog('⚠ SECURITY LOCKDOWN ACTIVATED — Session terminated', 'threat');
    };

    const handleStartCall = async () => {
        setCallActive(true);
        rollingScoresRef.current = [];
        setRollingScores([]);
        setProbability(0);
        addLog('WebRTC session established', 'ok');
        addLog('Audio stream intercepted by Kavach AI', 'info');
        await startSecureCall();
    };

    const handleEndCall = () => {
        setCallActive(false);
        rollingScoresRef.current = [];
        setRollingScores([]);
        setProbability(0);
        stopSecureCall();
        addLog('Call terminated by user', 'info');
    };

    const handlePaymentSubmit = (data) => {
        if (locked) { addLog('Transaction BLOCKED — Security lockdown active', 'threat'); return; }
        addLog(`Transaction submitted — ₹${data.amount} → ${data.recipient}`, 'ok');
        alert('Transaction Submitted Securely');
    };

    const avgProbability = rollingScores.length > 0
        ? rollingScores.reduce((a, b) => a + b, 0) / rollingScores.length
        : 0;

    const riskColor = avgProbability > 0.8 ? '#EF4444' : avgProbability > 0.4 ? '#F59E0B' : '#10B981';

    return (
        <div style={{ minHeight: '100vh', background: '#030712', color: '#F8FAFC', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' }}>

            {/* ── Ambient glow ── */}
            <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '55%', height: '55%', background: `radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

            {/* ── Security Overlay ── */}
            <SecurityOverlay visible={locked} probability={avgProbability} />

            {/* ── Top stripe ── */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #1D4ED8 0%, #06B6D4 50%, #1D4ED8 100%)', backgroundSize: '200% 100%', zIndex: 50 }} />

            {/* ── Navbar ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #1D4ED8, #0891B2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59,130,246,0.4)', border: '1px solid rgba(59,130,246,0.3)' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: "'Space Grotesk', sans-serif", background: 'linear-gradient(135deg, #F8FAFC 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KAVACH</div>
                            <div style={{ fontSize: 10, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginTop: -2 }}>AI AUDIO SHIELD</div>
                        </div>
                    </div>

                    {/* Telemetry row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        {callActive && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 16 }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 10, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Latency</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#06B6D4', fontFamily: "'JetBrains Mono', monospace" }}>{latency}ms</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 10, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Integrity</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981', fontFamily: "'JetBrains Mono', monospace" }}>{packetInteg}%</div>
                                </div>
                            </motion.div>
                        )}
                        {/* Live pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '6px 14px' }}>
                            <div style={{ position: 'relative', width: 8, height: 8 }}>
                                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: locked ? '#EF4444' : '#10B981', animation: 'pulse-ring 1.5s ease-out infinite', display: 'block' }} />
                                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: locked ? '#EF4444' : '#10B981', display: 'block' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: locked ? '#EF4444' : '#10B981', letterSpacing: '0.08em' }}>
                                {locked ? 'LOCKDOWN' : 'SHIELD ACTIVE'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>

                {/* Telemetry row */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                    <TelemetryCard label="Model"    value="WebNN" unit="NPU" color="#06B6D4" />
                    <TelemetryCard label="Risk Score" value={callActive ? (avgProbability * 100).toFixed(0) : '--'} unit="%" color={riskColor} />
                    <TelemetryCard label="Buffer"   value="500"   unit="ms" color="#8B5CF6" />
                    <TelemetryCard label="Mel Bands" value="64"   unit="bands" color="#3B82F6" />
                </motion.div>

                {/* 2-col grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

                    {/* ── LEFT: Security Panel ── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <CallPanel callActive={callActive} onStart={handleStartCall} onEnd={handleEndCall} locked={locked} />
                        <StatusBadge probability={probability} isFake={probability > 0.5} callActive={callActive} />
                    </motion.div>

                    {/* ── RIGHT: Payment ── */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <PaymentForm locked={locked} onSend={handlePaymentSubmit} />
                    </motion.div>
                </div>

                {/* ── Event Log ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    style={{ marginTop: 28, background: 'rgba(3,7,18,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Live Event Log</span>
                        </div>
                        <span style={{ fontSize: 10, color: '#334155', fontFamily: "'JetBrains Mono', monospace" }}>KAVACH-NODE-01</span>
                    </div>
                    <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {logs.slice().reverse().map(l => <LogLine key={l.id} time={l.time} msg={l.msg} type={l.type} />)}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
