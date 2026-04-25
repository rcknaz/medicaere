import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  FirestoreError 
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { OperationType, FirestoreErrorInfo } from './utils';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  const jsonStr = JSON.stringify(errInfo);
  console.error('Firestore Error: ', jsonStr);
  throw new Error(jsonStr);
}

export async function getDocument<T>(collectionPath: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionPath}/${docId}`);
    return null;
  }
}

export async function getCollection<T>(collectionPath: string, queryConstraints: any[] = []): Promise<T[]> {
  try {
    const colRef = collection(db, collectionPath);
    const q = query(colRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
    return [];
  }
}

export async function createDocument<T extends object>(collectionPath: string, data: T, customId?: string) {
  try {
    if (customId) {
      await setDoc(doc(db, collectionPath, customId), data);
      return customId;
    } else {
      const docRef = await addDoc(collection(db, collectionPath), data);
      return docRef.id;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

export async function updateDocument<T extends object>(collectionPath: string, docId: string, data: Partial<T>) {
  try {
    const docRef = doc(db, collectionPath, docId) as any;
    await updateDoc(docRef, data as any);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${docId}`);
  }
}

export function subscribeToCollection<T>(
  collectionPath: string, 
  queryConstraints: any[], 
  callback: (data: T[]) => void
) {
  const q = query(collection(db, collectionPath), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  });
}
