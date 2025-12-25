// ================================
// Transcription API Route - AssemblyAI
// ================================

import { NextRequest, NextResponse } from 'next/server';

// AssemblyAI API endpoint
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No audio file provided' },
                { status: 400 }
            );
        }

        // Check if AssemblyAI API key is configured
        const assemblyaiApiKey = process.env.ASSEMBLYAI_API_KEY;

        if (!assemblyaiApiKey) {
            // Return simulated response if no API key
            console.log('AssemblyAI API key not configured, using simulated transcription');

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1500));

            return NextResponse.json({
                success: true,
                text: 'This is a simulated transcription. To enable real transcription, add your AssemblyAI API key to the environment variables.',
                confidence: 0.95,
                usingFallback: true,
            });
        }

        // Convert File to ArrayBuffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Step 1: Upload audio to AssemblyAI
        const uploadResponse = await fetch(`${ASSEMBLYAI_API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': assemblyaiApiKey,
                'Content-Type': 'application/octet-stream',
            },
            body: buffer,
        });

        if (!uploadResponse.ok) {
            console.error('AssemblyAI upload error:', await uploadResponse.text());
            return NextResponse.json(
                { success: false, error: 'Failed to upload audio' },
                { status: uploadResponse.status }
            );
        }

        const uploadResult = await uploadResponse.json();
        const audioUrl = uploadResult.upload_url;

        // Step 2: Request transcription
        const transcriptResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
            method: 'POST',
            headers: {
                'Authorization': assemblyaiApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                audio_url: audioUrl,
                language_code: 'en',
            }),
        });

        if (!transcriptResponse.ok) {
            console.error('AssemblyAI transcript request error:', await transcriptResponse.text());
            return NextResponse.json(
                { success: false, error: 'Failed to start transcription' },
                { status: transcriptResponse.status }
            );
        }

        const transcriptResult = await transcriptResponse.json();
        const transcriptId = transcriptResult.id;

        // Step 3: Poll for completion (max 60 seconds)
        let transcript = null;
        const maxAttempts = 30;

        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

            const pollingResponse = await fetch(`${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`, {
                headers: {
                    'Authorization': assemblyaiApiKey,
                },
            });

            if (!pollingResponse.ok) {
                continue;
            }

            transcript = await pollingResponse.json();

            if (transcript.status === 'completed') {
                break;
            } else if (transcript.status === 'error') {
                return NextResponse.json(
                    { success: false, error: transcript.error || 'Transcription failed' },
                    { status: 500 }
                );
            }
        }

        if (!transcript || transcript.status !== 'completed') {
            return NextResponse.json(
                { success: false, error: 'Transcription timed out' },
                { status: 408 }
            );
        }

        return NextResponse.json({
            success: true,
            text: transcript.text,
            confidence: transcript.confidence || 0.95,
            duration: transcript.audio_duration,
            usingFallback: false,
        });

    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error during transcription' },
            { status: 500 }
        );
    }
}

// Status endpoint to check if transcription is available
export async function GET() {
    const assemblyaiApiKey = process.env.ASSEMBLYAI_API_KEY;

    return NextResponse.json({
        available: true,
        realTranscription: !!assemblyaiApiKey,
        provider: 'AssemblyAI',
    });
}
