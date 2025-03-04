import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { SwingAnalysisResult } from './AnalysisService';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key-for-development",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

class FirebaseService {
  // Auth methods
  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Swing analysis methods
  async saveSwingAnalysis(analysis: SwingAnalysisResult): Promise<string> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const analysisData = {
        ...analysis,
        userId: user.uid,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'swingAnalyses'), analysisData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving swing analysis:', error);
      throw error;
    }
  }

  async getSwingAnalyses(limit = 10): Promise<SwingAnalysisResult[]> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'swingAnalyses'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as SwingAnalysisResult[];
    } catch (error) {
      console.error('Error getting swing analyses:', error);
      throw error;
    }
  }

  async getSwingAnalysisById(id: string): Promise<SwingAnalysisResult | null> {
    try {
      const docRef = doc(db, 'swingAnalyses', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as SwingAnalysisResult;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting swing analysis:', error);
      throw error;
    }
  }

  async deleteSwingAnalysis(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'swingAnalyses', id));
    } catch (error) {
      console.error('Error deleting swing analysis:', error);
      throw error;
    }
  }

  // Video storage methods
  async uploadSwingVideo(file: File, userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `swings/${userId}/${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading swing video:', error);
      throw error;
    }
  }

  async deleteSwingVideo(videoUrl: string): Promise<void> {
    try {
      const videoRef = ref(storage, videoUrl);
      await deleteObject(videoRef);
    } catch (error) {
      console.error('Error deleting swing video:', error);
      throw error;
    }
  }

  // User profile methods
  async saveUserProfile(userId: string, profileData: any): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }
}

export default new FirebaseService();