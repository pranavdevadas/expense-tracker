import { getFunctions, httpsCallable } from "firebase/functions";
import * as FileSystem from "expo-file-system/legacy";
import { app } from "@/firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const functions = getFunctions(app, "us-central1");
const auth = getAuth(app);

export const extractBillTotal = async (imageUri: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated yet");
  }

  await user.getIdToken(true);  

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: "base64",
  });

  const extractBillTotal = httpsCallable<
    { image: string },
    { totalAmount: number | null }
  >(functions, "extractBillTotal");

  const result = await extractBillTotal({ image: base64 });
  return result.data.totalAmount;
};
