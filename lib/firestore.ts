import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addProject(userId: string, projectName: string) {
  const userProjectsCollection = collection(db, "users", userId, "projects");
  const docRef = await addDoc(userProjectsCollection, {
    name: projectName,
    url: `/project/${crypto.randomUUID()}`,
    icon: "Folder", // You could allow icon selection later
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
