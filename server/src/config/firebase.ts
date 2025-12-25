import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App => {
    if (firebaseApp) {
        return firebaseApp;
    }

    try {
        // Try to load from file path first
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

        if (serviceAccountPath && fs.existsSync(path.resolve(serviceAccountPath))) {
            const serviceAccount = JSON.parse(
                fs.readFileSync(path.resolve(serviceAccountPath), 'utf8')
            );

            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            console.log('✅ Firebase Admin initialized from file');
            return firebaseApp;
        }

        // Try base64 encoded service account (for deployment)
        const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

        if (base64ServiceAccount) {
            const serviceAccount = JSON.parse(
                Buffer.from(base64ServiceAccount, 'base64').toString('utf8')
            );

            firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            console.log('✅ Firebase Admin initialized from base64');
            return firebaseApp;
        }

        throw new Error('No Firebase service account configuration found');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error);
        throw error;
    }
};

export const getFirebaseAuth = (): admin.auth.Auth => {
    if (!firebaseApp) {
        initializeFirebase();
    }
    return admin.auth();
};

export const verifyToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
    const auth = getFirebaseAuth();
    return auth.verifyIdToken(token);
};
