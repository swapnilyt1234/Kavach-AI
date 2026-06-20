/**
 * Engineer 1 - Model Runner
 * 
 * Pipeline: Int16Array PCM -> Mel Spectrogram -> WebNN ONNX Inference
 * Production-ready inference engine for deepfake audio detection.
 */
import * as ort from 'onnxruntime-web/all';
import { pcmToMelSpectrogram } from './mel.js';
import { N_MELS, MODEL_INPUT_FRAMES } from './constants.js';

// Singleton ONNX runtime session
let session = null;
const MODEL_PATH = '/models/deepfake_detector.onnx';

/**
 * 1. Initialize the ONNX inference session.
 * Prefers WebNN NPU, falls back to WebGPU, then WASM.
 */
export async function initModel() {
    // 2. Manage singleton session
    if (session) return; 

    try {
        const executionProviders = [
            {
                name: "webnn",
                deviceType: "npu"
            },
            "webgpu",
            "wasm"
        ];
        
        session = await ort.InferenceSession.create(MODEL_PATH, { executionProviders });
        console.log("[Engineer 1] AI Model Session Initialized");
    } catch (e) {
        console.warn("[Engineer 1] Primary execution providers failed. Falling back to WASM-only.", e);
        session = await ort.InferenceSession.create(MODEL_PATH, { 
            executionProviders: ['wasm'] 
        });
        console.log("[Engineer 1] AI Model Session Initialized via Fallback");
    }
}

/**
 * 3. Core Inference pass on the provided PCM16 audio chunk.
 * 
 * @param {Int16Array} pcm16Data - 500ms audio chunk from the worklet
 * @returns {Promise<{probability: number, isFake: boolean}>}
 */
export async function runInference(pcm16Data) {
    if (!session) {
        throw new Error("Model session not initialized. Call initModel() first.");
    }

    let inputTensor = null;
    let results = null;

    try {
        // Convert PCM to normalized Mel Spectrogram
        const melData = pcmToMelSpectrogram(pcm16Data);
        
        // Create ONNX Tensor with expected shape [batch, channels, mels, frames]
        inputTensor = new ort.Tensor(
            "float32",
            melData,
            [1, 1, N_MELS, MODEL_INPUT_FRAMES]
        );

        // 4. Feed model
        // Dynamically resolve input name, or default to 'input'
        const inputName = session.inputNames[0] || 'input';
        const feeds = {
            [inputName]: inputTensor
        };

        // 5. Run inference
        results = await session.run(feeds);
        
        // 6. Extract probability score
        // We look for 'logits' or fallback to the first output node
        const outputName = results['logits'] ? 'logits' : session.outputNames[0];
        const outputTensor = results[outputName];
        
        const logit = outputTensor.data[0];
        
        // Compute sigmoid
        const probability = 1 / (1 + Math.exp(-logit));

        // 8. Emit browser event fulfilling Engineer 1 Contract
        window.dispatchEvent(
            new CustomEvent("deepfake-score", {
                detail: {
                    probability
                }
            })
        );

        // 9. Return structured data
        return {
            probability,
            isFake: probability > 0.85
        };
    } finally {
        // 7. Memory safety: Dispose intermediate tensors to prevent leaks
        // Tensors bound to WebGPU backends hold unmanaged GPU memory.
        if (inputTensor && typeof inputTensor.dispose === 'function') {
            inputTensor.dispose();
        }
        
        if (results) {
            for (const key in results) {
                if (results[key] && typeof results[key].dispose === 'function') {
                    results[key].dispose();
                }
            }
        }
    }
}

/**
 * 10. Helper function to safely wrap inference calls
 * 
 * @param {Int16Array} pcm16Data 
 */
export const handlePCMChunk = async (pcm16Data) => {
    try {
        await runInference(pcm16Data);
    } catch (error) {
        console.error("[Engineer 1] Inference pipeline error:", error);
    }
};
