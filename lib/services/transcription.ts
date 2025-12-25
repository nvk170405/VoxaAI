// ================================
// Transcription Service
// ================================

import type { TranscriptionResult } from '@/types';

/**
 * Transcribe audio using OpenAI Whisper API
 * This calls our API route which handles the OpenAI API securely
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<TranscriptionResult> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transcription failed');
    }

    return response.json();
};

/**
 * Check if transcription service is available
 */
export const isTranscriptionAvailable = async (): Promise<boolean> => {
    try {
        const response = await fetch('/api/transcribe/status');
        const data = await response.json();
        return data.available === true;
    } catch {
        return false;
    }
};

/**
 * Calculate estimated duration of audio blob
 */
export const getAudioDuration = (audioBlob: Blob): Promise<number> => {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(audioBlob);

        audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
            URL.revokeObjectURL(audio.src);
        });

        audio.addEventListener('error', () => {
            resolve(0);
            URL.revokeObjectURL(audio.src);
        });
    });
};
