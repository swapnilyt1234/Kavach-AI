import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaymentForm({ locked, onSend }) {
    const [recipient, setRecipient] = useState('');
    const [upiId, setUpiId]         = useState('');
    const [amount, setAmount]       = useState('');
    const [focused, setFocused]     = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!locked && typeof onSend === 'function') {
            onSend({ recipient, upiId, amount });
        }
    };

    const fieldStyle = (name) => ({
        width: '100%',
        background: focused === name ? 'rgba(3,7,18,0.9)' : 'rgba(3,7,18,0.6)',
        border: `1px solid ${focused === name ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.07)'}`,
        color: '#F8FAFC',
        borderRadius: 10,
        padding: '14px 16px',
        fontSize: 15,
        outline: 'none',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s ease',
        boxShadow: focused === name ? '0 0 0 3px rgba(59,130,246,0.12), 0 0 16px rgba(59,130,246,0.1)' : 'none',
        opacity: locked ? 0.4 : 1,
        cursor: locked ? 'not-allowed' : 'text',
    });

    return (
        <div style={{ position: 'relative' }}>
            {/* Outer glow */}
            <div style={{ position: 'absolute', inset: -1, borderRadius: 22, background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(6,182,212,0.1) 50%, rgba(124,58,237,0.15) 100%)', filter: 'blur(1px)', zIndex: 0 }} />

            {/* Card */}
            <div style={{ position: 'relative', zIndex: 1, background: 'rgba(11,18,35,0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, overflow: 'hidden' }}>

                {/* Corner accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle at top right, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>Transfer Funds</div>
                        <div style={{ fontSize: 11, color: '#475569', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginTop: 3 }}>UPI · INSTANT · SECURE</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                        </svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Recipient */}
                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', marginBottom: 8 }}>Recipient Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={recipient}
                            onChange={e => setRecipient(e.target.value)}
                            onFocus={() => setFocused('recipient')}
                            onBlur={() => setFocused(null)}
                            disabled={locked}
                            required
                            style={fieldStyle('recipient')}
                        />
                    </div>

                    {/* UPI ID */}
                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', marginBottom: 8 }}>UPI ID</label>
                        <input
                            type="text"
                            placeholder="username@bank"
                            value={upiId}
                            onChange={e => setUpiId(e.target.value)}
                            onFocus={() => setFocused('upi')}
                            onBlur={() => setFocused(null)}
                            disabled={locked}
                            required
                            style={fieldStyle('upi')}
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', marginBottom: 8 }}>Amount</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 700, color: focused === 'amount' ? '#3B82F6' : '#64748B', pointerEvents: 'none', transition: 'color 0.2s' }}>₹</div>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                onFocus={() => setFocused('amount')}
                                onBlur={() => setFocused(null)}
                                disabled={locked}
                                min="1"
                                required
                                style={{ ...fieldStyle('amount'), paddingLeft: 36, fontSize: 18, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={locked}
                        whileHover={{ scale: locked ? 1 : 1.02 }}
                        whileTap={{ scale: locked ? 1 : 0.98 }}
                        style={{
                            marginTop: 8,
                            width: '100%',
                            padding: '16px',
                            borderRadius: 12,
                            background: locked ? '#1E293B' : 'linear-gradient(135deg, #2563EB 0%, #0891B2 100%)',
                            color: locked ? '#475569' : '#fff',
                            fontWeight: 800,
                            fontSize: 15,
                            border: 'none',
                            cursor: locked ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: locked ? 'none' : '0 0 32px rgba(37,99,235,0.4)',
                            letterSpacing: '0.01em',
                            fontFamily: "'Space Grotesk', sans-serif",
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {locked ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                                </svg>
                                SECURITY LOCK ACTIVE
                            </>
                        ) : (
                            <>
                                Send Money
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                    <polyline points="12 5 19 12 12 19"/>
                                </svg>
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Blocked overlay */}
                {locked && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(6px)', borderRadius: 20 }}>
                        <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 16, padding: '24px 32px', textAlign: 'center', boxShadow: '0 0 40px rgba(239,68,68,0.2)' }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#FCA5A5', fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>Transaction Blocked</div>
                            <div style={{ fontSize: 12, color: '#F87171', fontFamily: "'JetBrains Mono', monospace" }}>Fraudulent audio detected</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
