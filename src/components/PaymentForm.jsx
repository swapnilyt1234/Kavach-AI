import React, { useState } from 'react';

export default function PaymentForm({ locked, onSend }) {
    const [recipient, setRecipient] = useState('');
    const [upiId, setUpiId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!locked && typeof onSend === 'function') {
            onSend({ recipient, upiId, amount });
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur opacity-20 transition duration-1000"></div>
            
            {/* Glassmorphism Card */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Transfer Funds</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Instant UPI Payment</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={`space-y-5 transition-all duration-300 ${locked ? 'opacity-50 grayscale-[50%]' : ''}`}>
                    {/* Recipient Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Recipient Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-100"
                            placeholder="John Doe" 
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            disabled={locked}
                            required
                        />
                    </div>
                    
                    {/* UPI ID */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">UPI ID</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-100"
                            placeholder="username@bank" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            disabled={locked}
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Amount</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-bold text-lg">₹</span>
                            </div>
                            <input 
                                type="number" 
                                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 text-lg font-semibold rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-100"
                                placeholder="0.00" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={locked}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={locked}
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex justify-center items-center gap-2"
                    >
                        {locked ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Security Lock Active
                            </>
                        ) : (
                            <>
                                Send Money
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Security overlay indicator */}
                {locked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-[2rem]">
                        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-5 rounded-2xl shadow-2xl flex flex-col items-center max-w-[85%] text-center">
                            <div className="bg-red-100 p-3 rounded-full mb-3">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <span className="font-black text-lg mb-1 tracking-tight">Transaction Blocked</span>
                            <span className="text-sm text-red-600 font-medium leading-tight">Fraudulent audio detected on this call.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
