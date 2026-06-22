# Kavach AI — Scam Voice Signature Detection Engine

🛡️ **Kavach AI** is a next-generation browser-based **Scam Voice Signature Match Engine** designed to prevent digital banking fraud and synthetic voice clone scams in real-time.

Designed for Indian fintech platforms, Kavach intercepts secure audio call sessions, runs light on-device acoustic feature extraction, and matches voice profiles against a centralized database of high-risk scam operations (Police impersonation, RBI officer fraud, Sibling voice clones, and KYC scams) before transactions can be completed.

---

## ✨ Features

* **Real-time Acoustic Fingerprinting**: Checks zero-crossing rates, spectral flatness, robotic pitch variance, and voice entropy to isolate synthetic anomalies.
* **Centralized Scam Signature DB**: Dynamically matches callers against four active bank scam profiles:
  * 🚔 **Police Impersonation**: Authoritative, high-pressure vocal patterns.
  * 🏦 **RBI Officer / Bank Fraud**: Robotic IVR credential-phishing synthesizers.
  * 👥 **Family Voice Clone**: Vocoded voice synthesis targeting family members.
  * 📋 **KYC Verification Fraud**: Urgent, synthetic update scams.
* **Deterministic Sandbox Simulation**: Sandboxed 2x2 trigger grid demonstrating progression curves (`25% → 42% → 68% → 88% → 97%`) and instant transaction locks.
* **Speech Synthesis Playback**: Integrates standard Web Speech synthesis during simulations to read out scam scripts with customized pitch, rate, and character styles.
* **Cinematic Red Alert Lock**: Automatically suspends access to UPI payment forms, isolates the banking gateway, and logs telemetry.

---

## 🛠️ Technology Stack

* **Frontend**: React + Javascript + Vite
* **Animations**: Framer Motion
* **Telemetry & Analysis**: Web Audio API (native AudioWorklets) + custom acoustic heuristic models
* **Styling**: Sleek Light Theme CSS (Apple/CRED inspired)

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Run the Development Server

Start Vite's local dev server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production

Compile a production bundle:
```bash
npm run build
```

---

## 🔬 Sandbox Demo Guide

To demonstrate Kavach's lockdown capabilities to judges:
1. **Explore the Portal**: Review the professional landing page and click **Launch Secure Banking Sandbox** to enter the secure gateway.
2. **Open the Guard**: Click **Start Secure Call**. You will see the active amplitude-reactive waveform and live system parameters.
3. **Simulate a Scam**: Tap any of the scam options (e.g., 🚔 **Police Scam**).
4. **Observe the Pipeline**:
   * The browser will immediately synthesize the scam scenario audio.
   * For the first **1.5 seconds**, the engine scans in a `SAFE` state.
   * Then, the matching similarity score escalates: `25% → 42% → 68% → 88% → 97%`.
   * On reaching `97%`, the red-siren **Lockdown Overlay** covers the screen, displaying specific matched profile details, and the UPI form is locked.
5. **Reset Gateway**: Click **Clear Alert & Reset Session** to release the security lock and restore standby monitoring.
