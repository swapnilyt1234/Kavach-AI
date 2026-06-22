import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RECENT_TRANSFERS = [
  { id: 1, name: 'Mother', handle: 'mother@hdfcbank', amount: '₹5,000', icon: '👩', color: '#10B981' },
  { id: 2, name: 'Electricity Bill', handle: 'msedcl@axis', amount: '₹1,240', icon: '⚡', color: '#F59E0B' },
  { id: 3, name: 'Zomato Merchant', handle: 'zomato.merchant@paytm', amount: '₹340', icon: '🍕', color: '#DC2626' },
];

export default function PaymentForm({ locked, onSend }) {
  const [recipient, setRecipient] = useState('');
  const [upiId, setUpiId]         = useState('');
  const [amount, setAmount]       = useState('');
  const [purpose, setPurpose]     = useState('');
  const [focused, setFocused]     = useState(null);
  const [sent, setSent]           = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!locked && typeof onSend === 'function') {
      onSend({ recipient, upiId, amount, purpose });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
  };

  const inputStyle = (name) => ({
    width: '100%',
    background: focused === name ? '#F8FAFC' : '#FFFFFF',
    border: `1.5px solid ${focused === name ? '#2563EB' : '#E2E8F0'}`,
    color: '#0F172A',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 14,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    boxShadow: focused === name ? '0 0 0 3px rgba(37,99,235,0.10)' : 'none',
    opacity: locked ? 0.5 : 1,
    cursor: locked ? 'not-allowed' : 'text',
  });

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.05em', textTransform: 'uppercase',
    color: '#64748B', marginBottom: 6,
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
      }}>
        {/* Bank Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #0284C7 100%)',
          padding: '20px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)',
          }} />

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                HDFC BANK · SAVINGS ACCOUNT
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
                ₹82,450<span style={{ fontSize: 13, fontWeight: 400, opacity: 0.7 }}>.00</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Available Balance</div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
          </div>

          {/* Account Number */}
          <div style={{ marginTop: 14, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>
            •••• •••• •••• 4821  ·  IFSC: HDFC0001234
          </div>
        </div>

        {/* Recent Transfers */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Transfers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {RECENT_TRANSFERS.map(t => (
              <div key={t.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer' }}
                onClick={() => { if (!locked) { setRecipient(t.name); setUpiId(t.handle); } }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  {t.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'JetBrains Mono, monospace' }}>{t.handle}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{t.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Form */}
        <div style={{ padding: '20px 24px', position: 'relative' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.01em' }}>New Transfer</div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={labelStyle}>Recipient Name</label>
              <input type="text" placeholder="Full Name" value={recipient}
                onChange={e => setRecipient(e.target.value)}
                onFocus={() => setFocused('recipient')} onBlur={() => setFocused(null)}
                disabled={locked} required style={inputStyle('recipient')} />
            </div>

            <div>
              <label style={labelStyle}>UPI ID</label>
              <input type="text" placeholder="username@bank" value={upiId}
                onChange={e => setUpiId(e.target.value)}
                onFocus={() => setFocused('upi')} onBlur={() => setFocused(null)}
                disabled={locked} required style={inputStyle('upi')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 15, fontWeight: 700,
                    color: focused === 'amount' ? '#2563EB' : '#64748B',
                    pointerEvents: 'none', transition: 'color 0.2s',
                  }}>₹</div>
                  <input type="number" placeholder="0" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    onFocus={() => setFocused('amount')} onBlur={() => setFocused(null)}
                    disabled={locked} min="1" required
                    style={{ ...inputStyle('amount'), paddingLeft: 30, fontSize: 16, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Purpose</label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)}
                  disabled={locked}
                  onFocus={() => setFocused('purpose')} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle('purpose'), cursor: locked ? 'not-allowed' : 'pointer' }}>
                  <option value="">Select</option>
                  <option>Personal</option>
                  <option>Business</option>
                  <option>Bill Payment</option>
                  <option>Rent</option>
                </select>
              </div>
            </div>

            {/* Send Button */}
            <motion.button
              type="submit"
              disabled={locked}
              whileHover={{ scale: locked ? 1 : 1.01, y: locked ? 0 : -1 }}
              whileTap={{ scale: locked ? 1 : 0.99 }}
              style={{
                marginTop: 4,
                width: '100%', padding: '14px',
                borderRadius: 12,
                background: locked ? '#F1F5F9'
                  : sent ? 'linear-gradient(135deg, #059669, #0D9488)'
                  : 'linear-gradient(135deg, #2563EB, #0284C7)',
                color: locked ? '#94A3B8' : '#fff',
                fontWeight: 700, fontSize: 14, border: 'none',
                cursor: locked ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: locked ? 'none' : '0 4px 16px rgba(37,99,235,0.3)',
                letterSpacing: '0.01em',
                transition: 'all 0.2s',
              }}
            >
              {locked ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  Transaction Locked
                </>
              ) : sent ? (
                <>✓ Sent Successfully</>
              ) : (
                <>
                  Send Securely
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Fraud Lock Overlay */}
          <AnimatePresence>
            {locked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(254,242,242,0.92)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '0 0 24px 24px',
                  zIndex: 10,
                }}
              >
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #FECACA',
                  borderRadius: 16, padding: '20px 28px', textAlign: 'center',
                  boxShadow: '0 4px 24px rgba(220,38,38,0.15)',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#DC2626', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>
                    Financial Access Blocked
                  </div>
                  <div style={{ fontSize: 12, color: '#EF4444' }}>
                    Fraudulent audio detected · Session locked
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
