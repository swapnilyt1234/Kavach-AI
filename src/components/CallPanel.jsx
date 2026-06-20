import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// ── Animated EQ Bars ────────────────────────────────────────────────────────
function EQBars({ active, color = '#3B82F6', count = 12 }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={{
                    width: 3,
                    height: '100%',
                    borderRadius: 2,
                    background: color,
                    transformOrigin: 'bottom',
                    transform: 'scaleY(0.15)',
                    opacity: active ? 1 : 0.2,
                    animation: active ? `eq-bar ${0.5 + Math.random() * 0.7}s ease-in-out infinite alternate` : 'none',
                    animationDelay: `${i * 0.07}s`,
                    '--dur': `${0.5 + Math.random() * 0.7}s`,
                }} />
            ))}
        </div>
    );
}

// ── Pulse ring around mic icon ───────────────────────────────────────────────
function PulseRings({ active }) {
    if (!active) return null;
    return (
        <>
            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    position: 'absolute', inset: -(i * 12),
                    borderRadius: '50%',
                    border: '1px solid rgba(59,130,246,0.3)',
                    animation: `pulse-ring ${1 + i * 0.4}s ease-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    pointerEvents: 'none',
                }} />
            ))}
        </>
    );
}

export default function CallPanel({ callActive, onStart, onEnd, locked }) {
    const handleSimulateAttack = () => {
        window.dispatchEvent(new CustomEvent("deepfake-score", { detail: { probability: 0.98 } }));
    };

    return (
        <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>

            {/* Shield active ring */}
            {callActive && (
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(59,130,246,0.15)', animation: 'shield-rotate 8s linear infinite', pointerEvents: 'none' }} />
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', fontFamily: "'Space Grotesk', sans-serif" }}>Secure Support Line</div>
                    <div style={{ fontSize: 11, color: '#475569', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginTop: 2 }}>WebRTC E2E Encrypted</div>
                </div>
                {/* Mic icon with pulse */}
                <div style={{ position: 'relative', width: 44, height: 44 }}>
                    <PulseRings active={callActive} />
                    <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: callActive ? 'rgba(59,130,246,0.15)' : 'rgba(30,41,59,0.8)',
                        border: `1px solid ${callActive ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        boxShadow: callActive ? '0 0 20px rgba(59,130,246,0.25)' : 'none',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={callActive ? '#3B82F6' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="23"/>
                            <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Audio EQ Visualizer */}
            <div style={{ background: 'rgba(3,7,18,0.5)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 10, color: '#475569', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
                    {callActive ? 'Live Audio' : 'Standby'}
                </div>
                <EQBars active={callActive} color={callActive ? '#06B6D4' : '#1E293B'} />
            </div>

            {/* Call buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {!callActive ? (
                    <motion.button
                        onClick={onStart}
                        disabled={locked}
                        whileHover={{ scale: locked ? 1 : 1.02 }}
                        whileTap={{ scale: locked ? 1 : 0.98 }}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 12,
                            background: locked ? '#1E293B' : 'linear-gradient(135deg, #059669, #0D9488)',
                            color: locked ? '#475569' : '#fff',
                            fontWeight: 700, fontSize: 14, border: 'none', cursor: locked ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: locked ? 'none' : '0 0 24px rgba(5,150,105,0.3)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.17 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                        Start Secure Call
                    </motion.button>
                ) : (
                    <motion.button
                        onClick={onEnd}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 12,
                            background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                            color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 0 24px rgba(220,38,38,0.3)',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.4 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.19 8.91"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                        End Call
                    </motion.button>
                )}

                {/* Simulate attack */}
                <motion.button
                    onClick={handleSimulateAttack}
                    disabled={locked || !callActive}
                    whileHover={{ scale: (!locked && callActive) ? 1.02 : 1 }}
                    whileTap={{ scale: (!locked && callActive) ? 0.98 : 1 }}
                    style={{
                        width: '100%', padding: '12px', borderRadius: 12,
                        background: (!locked && callActive) ? 'rgba(124,58,237,0.1)' : 'rgba(30,41,59,0.5)',
                        color: (!locked && callActive) ? '#A78BFA' : '#334155',
                        fontWeight: 700, fontSize: 13, cursor: (!locked && callActive) ? 'pointer' : 'not-allowed',
                        border: `1px solid ${(!locked && callActive) ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.04)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    Simulate Deepfake Attack
                </motion.button>

                {!callActive && <p style={{ fontSize: 11, color: '#334155', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>Start a call to enable simulation</p>}
            </div>
        </div>
    );
}
