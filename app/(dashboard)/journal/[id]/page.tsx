"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Hash,
    Play,
    Pause,
    Edit2,
    Save,
    Trash2,
    Share2,
    Download,
    Copy,
    Check,
    X,
    FileText,
    Mic,
    Brain
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { journalsApi } from "@/lib/api";
import { MOOD_CONFIG } from "@/lib/constants";
import type { JournalEntry } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function JournalDetailPage() {
    const router = useRouter();
    const params = useParams();
    const journalId = params.id as string;
    const { subscription } = useAuth();
    const userPlan = subscription || "basic";

    const [journal, setJournal] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editTranscription, setEditTranscription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Audio states
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    // Copy state
    const [copied, setCopied] = useState(false);

    // Fetch journal on mount
    useEffect(() => {
        const fetchJournal = async () => {
            try {
                setLoading(true);
                const response = await journalsApi.getById(journalId) as {
                    success: boolean;
                    data: JournalEntry;
                };

                if (response.success) {
                    setJournal(response.data);
                    setEditTitle(response.data.title);
                    setEditTranscription(response.data.transcription);
                } else {
                    throw new Error("Failed to fetch journal");
                }
            } catch (err) {
                console.error("Error fetching journal:", err);
                setError("Journal not found");
            } finally {
                setLoading(false);
            }
        };

        if (journalId) {
            fetchJournal();
        }
    }, [journalId]);

    // Handle audio playback
    const toggleAudio = useCallback(() => {
        if (!journal?.audioUrl) return;

        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
                setIsPlaying(false);
            } else {
                audioElement.play();
                setIsPlaying(true);
            }
        } else {
            const audio = new Audio(journal.audioUrl);
            audio.onended = () => setIsPlaying(false);
            audio.play();
            setAudioElement(audio);
            setIsPlaying(true);
        }
    }, [journal?.audioUrl, audioElement, isPlaying]);

    // Handle save edit
    const handleSave = async () => {
        if (!journal) return;

        setIsSaving(true);
        try {
            const response = await journalsApi.update(journal.id, {
                title: editTitle,
                transcription: editTranscription,
            }) as { success: boolean; data: JournalEntry };

            if (response.success) {
                setJournal(response.data);
                setIsEditing(false);
                toast({
                    title: "Saved!",
                    description: "Journal entry updated successfully",
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to save changes",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!journal) return;

        try {
            const response = await journalsApi.delete(journal.id) as { success: boolean };

            if (response.success) {
                toast({
                    title: "Deleted",
                    description: "Journal entry has been deleted",
                });
                router.push("/dashboard");
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete journal",
                variant: "destructive",
            });
        }
    };

    // Handle copy to clipboard
    const handleCopy = async () => {
        if (!journal) return;

        await navigator.clipboard.writeText(journal.transcription);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Transcription copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    // Handle download as text
    const handleDownload = () => {
        if (!journal) return;

        const content = `${journal.title}\n\nDate: ${new Date(journal.date).toLocaleDateString()}\nMood: ${journal.mood || "Not logged"}\n\n${journal.transcription}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${journal.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Downloaded!",
            description: "Journal saved as text file",
        });
    };

    // Get mood color
    const getMoodColor = (mood: string) => {
        const config = MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG];
        return config?.color || "bg-neutral-400";
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    // Error state
    if (error || !journal) {
        return (
            <div className="min-h-screen bg-background p-6 flex items-center justify-center">
                <Card className="w-full max-w-md text-center p-8">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Journal Not Found</h2>
                    <p className="text-muted-foreground mb-4">
                        This journal entry might have been deleted or doesn't exist.
                    </p>
                    <Button onClick={() => router.push("/dashboard")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border bg-card sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditTitle(journal.title);
                                            setEditTranscription(journal.transcription);
                                        }}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-foreground text-background"
                                    >
                                        <Save className="h-4 w-4 mr-1" />
                                        {isSaving ? "Saving..." : "Save"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleDownload}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    {userPlan === "premium" && (
                                        <Button variant="ghost" size="icon">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Journal Entry?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your
                                                    journal entry.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Title */}
                    {isEditing ? (
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-3xl font-bold bg-muted border-border"
                            placeholder="Journal Title"
                        />
                    ) : (
                        <h1 className="text-3xl font-bold">{journal.title}</h1>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(journal.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {new Date(journal.date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                        {journal.wordCount && (
                            <div className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4" />
                                {journal.wordCount} words
                            </div>
                        )}
                    </div>

                    {/* Mood */}
                    {journal.mood && (
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${getMoodColor(journal.mood)}`} />
                            <span className="text-lg font-medium capitalize">{journal.mood}</span>
                            {userPlan === "premium" && journal.sentiment && (
                                <Badge variant="outline" className="ml-2">
                                    <Brain className="h-3 w-3 mr-1" />
                                    AI: {journal.sentiment}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Audio Player */}
                    {journal.audioUrl && (
                        <Card className="bg-muted border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-12 w-12 rounded-full"
                                        onClick={toggleAudio}
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5" />
                                        ) : (
                                            <Play className="h-5 w-5" />
                                        )}
                                    </Button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Mic className="h-4 w-4" />
                                            <span className="text-sm font-medium">Voice Recording</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Click to {isPlaying ? "pause" : "play"} your original recording
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tags */}
                    {journal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {journal.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-sm">
                                    <Hash className="h-3 w-3 mr-1" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Transcription */}
                    <Card className="border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground font-medium">
                                Transcription
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Textarea
                                    value={editTranscription}
                                    onChange={(e) => setEditTranscription(e.target.value)}
                                    className="min-h-[300px] bg-muted border-border resize-none"
                                    placeholder="Your journal entry..."
                                />
                            ) : (
                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                    {journal.transcription}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timestamps */}
                    <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                        Created: {new Date(journal.createdAt).toLocaleString()} •
                        Last updated: {new Date(journal.updatedAt).toLocaleString()}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
