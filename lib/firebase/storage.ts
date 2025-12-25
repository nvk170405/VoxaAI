// ================================
// Firebase Storage Service
// ================================

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';

// Get Firebase app (already initialized in firebaseConfig)
const app = getApps()[0];
const storage = getStorage(app);

/**
 * Upload audio file to Firebase Storage
 */
export const uploadAudio = async (
    userId: string,
    audioBlob: Blob,
    filename?: string
): Promise<string> => {
    const timestamp = Date.now();
    const name = filename || `recording_${timestamp}.wav`;
    const storageRef = ref(storage, `audio/${userId}/${name}`);

    await uploadBytes(storageRef, audioBlob, {
        contentType: 'audio/wav',
    });

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
};

/**
 * Delete audio file from Firebase Storage
 */
export const deleteAudio = async (audioUrl: string): Promise<void> => {
    try {
        const storageRef = ref(storage, audioUrl);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting audio file:', error);
        // File might not exist, continue silently
    }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (
    userId: string,
    imageBlob: Blob
): Promise<string> => {
    const storageRef = ref(storage, `profiles/${userId}/avatar.jpg`);

    await uploadBytes(storageRef, imageBlob, {
        contentType: 'image/jpeg',
    });

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
};

/**
 * Get audio file URL (for playback)
 */
export const getAudioUrl = async (path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
};
