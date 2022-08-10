import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

//DTO - Data transfer object
//Armazenar aquilo que o firebase vai me entregar.

export type orderFirestoreDTO = {
  patrimony: string;
  description: string;
  status: "open" | "closed";
  solution?: string;
  created_at: FirebaseFirestoreTypes.Timestamp;
  closed_at?: FirebaseFirestoreTypes.Timestamp;
};
