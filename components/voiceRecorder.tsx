"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Square, Play, Pause, Download, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  isRecording: boolean;
  onToggleRecording: (recording: boolean) => void;
}

export const VoiceRecorder = ({ isRecording, onToggleRecording }: VoiceRecorderProps) => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        simulateTranscription();
      };

      mediaRecorder.start();
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
      onToggleRecording(false);
      toast({
        title: "Recording stopped",
        description: "Processing your audio...",
      });
    }
  };

  const simulateTranscription = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setTranscription("This is a simulated transcription of your voice recording. In a real app, this would be processed by a speech-to-text service.");
      setIsTranscribing(false);
      toast({
        title: "Transcription complete",
        description: "Your audio has been converted to text",
      });
    }, 2000);
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Button Area */}
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            className={`w-28 h-28 rounded-full flex items-center justify-center border-2 transition-colors ${isRecording
                ? "border-foreground bg-foreground/5"
                : "border-border bg-muted"
              }`}
            animate={isRecording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
          >
            {isRecording ? (
              <Mic className="h-10 w-10 text-foreground" />
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
                  className="w-1 bg-foreground rounded-full"
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

        {/* Transcription Output */}
        {(transcription || isTranscribing) && (
          <motion.div
            className="p-4 bg-muted rounded-xl border border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Transcription</h4>
              {transcription && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Save className="h-3 w-3 mr-1" />
                    Save Entry
                  </Button>
                </motion.div>
              )}
            </div>
            {isTranscribing ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <motion.div
                  className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-sm">Processing audio...</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{transcription}</p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};