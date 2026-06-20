import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated glitch text layer
function GlitchText({ text }) {
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
                position: 'absolute', top: 0, left: 0,
                color: '#F87171', opacity: 0.7,
                animation: 'glitch-shift 2.5s infinite linear',
                userSelect: 'none',
            }}>{text}</span>
            <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
        </div>
    );
}

export default function SecurityOverlay({ visible, probability }) {
    const confidence = probability ? (probability * 100).toFixed(1) : '98.0';
    const canvasRef = useRef(null);

    // Animated grid scan canvas
    useEffect(() => {
        if (!visible || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;
        let offset = 0;

        const draw = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Grid lines
            ctx.strokeStyle = 'rgba(239,68,68,0.08)';
            ctx.lineWidth = 1;
            const spacing = 40;
            for (let x = 0; x < canvas.width; x += spacing) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += spacing) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // Scan line
            offset = (offset + 1.5) % canvas.height;
            const grad = ctx.createLinearGradient(0, offset - 60, 0, offset + 60);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.5, 'rgba(239,68,68,0.15)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(0, offset - 60, canvas.width, 120);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [visible]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 200,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(3,0,0,0.92)',
                        backdropFilter: 'blur(12px)',
                        animation: 'siren-flash 1s infinite',
                        overflow: 'hidden',
                    }}
                >
                    {/* Animated grid canvas */}
                    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

                    {/* Scanlines overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
                        animation: 'scanline 4s linear infinite',
                    }} />

                    {/* Radial burst */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '200vw', height: '200vw', background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1, animation: 'pulse-ring 2s ease-out infinite' }} />

                    {/* Main content card */}
                    <motion.div
                        initial={{ scale: 0.85, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{
                            position: 'relative', zIndex: 10,
                            maxWidth: 680, width: '90%',
                            background: 'rgba(20,4,4,0.85)',
                            backdropFilter: 'blur(24px)',
                            border: '2px solid rgba(239,68,68,0.5)',
                            borderRadius: 24,
                            padding: '48px 40px',
                            textAlign: 'center',
                            boxShadow: '0 0 120px rgba(239,68,68,0.3), inset 0 0 60px rgba(239,68,68,0.05)',
                        }}
                    >
                        {/* Animated lock icon */}
                        <motion.div
                            animate={{ rotate: [0, -5, 5, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                            style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}
                        >
                            <div style={{ position: 'relative', width: 80, height: 80 }}>
                                {[1, 2].map(i => (
                                    <div key={i} style={{ position: 'absolute', inset: -(i * 14), borderRadius: '50%', border: '1px solid rgba(239,68,68,0.2)', animation: `pulse-ring ${1 + i * 0.5}s ease-out infinite`, animationDelay: `${i * 0.3}s` }} />
                                ))}
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(239,68,68,0.3)' }}>
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <div style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 900, color: '#FCA5A5', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em', marginBottom: 12, textShadow: '0 0 40px rgba(239,68,68,0.5)' }}>
                            <GlitchText text="SYNTHETIC AUDIO DETECTED" />
                        </div>

                        <p style={{ fontSize: 18, color: '#CBD5E1', fontWeight: 600, marginBottom: 28, fontFamily: "'Space Grotesk', sans-serif" }}>
                            Potential Financial Fraud Attempt
                        </p>

                        {/* Confidence bar */}
                        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '16px 24px', marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>Threat Confidence</span>
                                <span style={{ fontSize: 22, fontWeight: 900, color: '#EF4444', fontFamily: "'JetBrains Mono', monospace' " }}>{confidence}%</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidence}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #DC2626, #EF4444)', borderRadius: 3, boxShadow: '0 0 10px rgba(239,68,68,0.6)' }}
                                />
                            </div>
                        </div>

                        {/* Session terminated */}
                        <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '16px 20px', textAlign: 'left' }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#FCA5A5', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", animation: 'pulse 2s ease-in-out infinite' }}>
                                ▶ Session Terminated
                            </div>
                            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
                                All transaction capabilities and session privileges have been immediately revoked. This event has been flagged for forensic analysis by the Kavach Security Network.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
