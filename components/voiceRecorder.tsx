"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Square, Play, Pause, Download, Save, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useJournals } from "@/hooks/useJournals";

interface VoiceRecorderProps {
  isRecording: boolean;
  onToggleRecording: (recording: boolean) => void;
}

// Check if Web Speech API is available
const isSpeechRecognitionSupported = () => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

export const VoiceRecorder = ({ isRecording, onToggleRecording }: VoiceRecorderProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState(""); // Real-time display
  const [finalTranscript, setFinalTranscript] = useState(""); // Final result
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Use the journals hook for saving
  const { createJournal } = useJournals();

  // Initialize Speech Recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalText) {
          setFinalTranscript(prev => prev + finalText);
        }
        setLiveTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast({
            title: "Speech Recognition Error",
            description: event.error,
            variant: "destructive",
          });
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Reset transcripts
      setLiveTranscript("");
      setFinalTranscript("");

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        // Set the title
        setTitle(`Voice Journal - ${new Date().toLocaleDateString()}`);
        toast({
          title: "Recording complete",
          description: "Review your transcription and save",
        });
      };

      mediaRecorder.start();

      // Start speech recognition for real-time transcription
      if (recognitionRef.current && isSpeechRecognitionSupported()) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('Speech recognition already started');
        }
      }

      onToggleRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      onToggleRecording(false);
    }
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voice-journal-${new Date().toISOString()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveEntry = useCallback(async () => {
    const transcriptionText = finalTranscript.trim() || liveTranscript.trim();

    if (!transcriptionText || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please add a title for your entry",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await createJournal({
        title: title.trim(),
        transcription: transcriptionText,
        date: new Date(),
        tags: [],
      });

      if (result) {
        toast({
          title: "Entry saved!",
          description: "Your journal entry has been saved successfully",
        });
        // Reset form
        setFinalTranscript("");
        setLiveTranscript("");
        setTitle("");
        setAudioBlob(null);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [finalTranscript, liveTranscript, title, createJournal]);

  // Combined transcript for display
  const displayTranscript = finalTranscript + liveTranscript;
  const hasTranscript = displayTranscript.trim().length > 0;

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <motion.div
            className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="h-4 w-4 text-background" />
          </motion.div>
          Voice Recorder
          {!isSpeechRecognitionSupported() && (
            <span className="text-xs text-muted-foreground ml-2">(Real-time not supported)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time Transcription Display - ABOVE the mic */}
        <AnimatePresence>
          {(isRecording || hasTranscript) && (
            <motion.div
              className="p-4 bg-muted rounded-xl border border-border min-h-[80px]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {isRecording && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <span className="text-xs font-medium text-muted-foreground">
                  {isRecording ? 'Listening...' : 'Transcription'}
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                <span className="text-foreground">{finalTranscript}</span>
                {isRecording && (
                  <span className="text-muted-foreground italic">{liveTranscript}</span>
                )}
                {!hasTranscript && isRecording && (
                  <span className="text-muted-foreground italic">Start speaking...</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording Button Area */}
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            className={`w-28 h-28 rounded-full flex items-center justify-center border-2 transition-colors ${isRecording
              ? "border-red-500 bg-red-500/10"
              : "border-border bg-muted"
              }`}
            animate={isRecording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
          >
            {isRecording ? (
              <Mic className="h-10 w-10 text-red-500" />
            ) : (
              <MicOff className="h-10 w-10 text-muted-foreground" />
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className={`h-12 px-6 ${isRecording
                  ? ""
                  : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
            </motion.div>

            {audioBlob && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-2"
              >
                <Button
                  onClick={playAudio}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  onClick={downloadAudio}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recording Animation */}
        {isRecording && (
          <motion.div
            className="flex justify-center py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-red-500 rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Save Section - appears after recording stops with transcript */}
        {!isRecording && hasTranscript && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Input
              placeholder="Entry title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleSaveEntry}
                disabled={isSaving || !title.trim()}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// TypeScript declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}