import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Square, Play, Pause, Download } from "lucide-react";
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
    // Simulate transcription process
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Voice Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
            isRecording 
              ? "border-primary bg-primary/10 recording-pulse" 
              : "border-muted bg-muted"
          }`}>
            {isRecording ? (
              <Mic className="h-8 w-8 text-primary" />
            ) : (
              <MicOff className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
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
            
            {audioBlob && (
              <Button
                onClick={playAudio}
                variant="outline"
                size="lg"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {audioBlob && (
              <Button
                onClick={downloadAudio}
                variant="outline"
                size="lg"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {(transcription || isTranscribing) && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Transcription:</h4>
            {isTranscribing ? (
              <div className="text-muted-foreground">Processing audio...</div>
            ) : (
              <p className="text-sm">{transcription}</p>
            )}
          </div>
        )}

        {isRecording && (
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="audio-wave"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${Math.random() * 20 + 10}px`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};