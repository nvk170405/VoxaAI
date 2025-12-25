// ================================
// Transcription API Route
// ================================

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        // Check if OpenAI API key is configured
        const openaiApiKey = process.env.OPENAI_API_KEY;

        if (!openaiApiKey) {
            // Return simulated response if no API key
            console.log('OpenAI API key not configured, using simulated transcription');

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1500));

            return NextResponse.json({
                text: 'This is a simulated transcription. To enable real transcription, add your OpenAI API key to the environment variables.',
                confidence: 0.95,
                duration: 0,
                simulated: true,
            });
        }

        // Convert File to ArrayBuffer then to Uint8Array for OpenAI
        const bytes = await file.arrayBuffer();
        const uint8Array = new Uint8Array(bytes);

        // Create form data for OpenAI API
        const openaiFormData = new FormData();
        openaiFormData.append('file', new Blob([uint8Array], { type: 'audio/wav' }), 'audio.wav');
        openaiFormData.append('model', 'whisper-1');
        openaiFormData.append('language', 'en');
        openaiFormData.append('response_format', 'json');

        // Call OpenAI Whisper API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: openaiFormData,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API error:', error);
            return NextResponse.json(
                { error: error.error?.message || 'Transcription failed' },
                { status: response.status }
            );
        }

        const result = await response.json();

        return NextResponse.json({
            text: result.text,
            confidence: 0.95, // Whisper doesn't return confidence, so we use a high default
            duration: result.duration,
            simulated: false,
        });

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { error: 'Internal server error during transcription' },
            { status: 500 }
        );
    }
}

// Status endpoint to check if transcription is available
export async function GET() {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    return NextResponse.json({
        available: true,
        realTranscription: !!openaiApiKey,
        model: 'whisper-1',
    });
}
