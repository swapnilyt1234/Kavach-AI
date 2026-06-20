import React from 'react';
import { motion } from 'framer-motion';

// SVG circular ring meter
function RingMeter({ probability }) {
    const pct = Math.round(probability * 100);
    const r = 54;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const color = pct > 80 ? '#EF4444' : pct > 40 ? '#F59E0B' : '#10B981';
    const label = pct > 80 ? 'THREAT' : pct > 40 ? 'SUSPICIOUS' : 'SAFE';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <motion.circle
                        cx="70" cy="70" r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                </svg>
                {/* Center text */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#64748B', marginTop: 4, textTransform: 'uppercase' }}>Risk</div>
                </div>
            </div>

            {/* Label chip */}
            <motion.div
                key={label}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    padding: '5px 14px', borderRadius: 100,
                    background: pct > 80 ? 'rgba(239,68,68,0.12)' : pct > 40 ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                    border: `1px solid ${color}40`,
                    color, fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono', monospace",
                    boxShadow: `0 0 12px ${color}30`,
                }}
            >
                {label}
            </motion.div>
        </div>
    );
}

export default function StatusBadge({ probability, isFake, callActive }) {
    return (
        <div style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Analysis Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: callActive ? '#10B981' : '#334155', boxShadow: callActive ? '0 0 8px #10B981' : 'none', transition: 'all 0.3s' }} />
                    <span style={{ fontSize: 10, color: callActive ? '#10B981' : '#475569', fontFamily: "'JetBrains Mono', monospace" }}>{callActive ? 'ANALYZING' : 'IDLE'}</span>
                </div>
            </div>

            {callActive ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', justifyContent: 'center' }}>
                    <RingMeter probability={probability} />
                </motion.div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0' }}>
                    <div style={{ width: 140, height: 140, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 28, color: '#1E293B', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>--</div>
                            <div style={{ fontSize: 9, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>No Signal</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#334155', animation: 'pulse-ring 2s ease-out infinite' }} />
                        <span style={{ fontSize: 11, color: '#334155', fontFamily: "'JetBrains Mono', monospace" }}>Waiting for audio stream</span>
                    </div>
                </div>
            )}
        </div>
    );
}
