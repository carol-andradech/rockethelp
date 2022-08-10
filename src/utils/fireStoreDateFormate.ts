import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

//Recebo um timestamp, esse timestamp é o valor que ele armazena
//E é do tipo FirebaseFirestoreTypes.Timestamp
export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp) {
  //Se tem algum valor
  if (timestamp) {
    //timestamp possui o método toDate que transforma para uma data válida e entendida pelo js
    const date = new Date(timestamp.toDate());

    const day = date.toLocaleDateString("pt-BR");
    const hour = date.toLocaleTimeString("pt-BR");

    //Uso a interpolação ``, misturar conteúdo de variável, com texto.
    return `${day} às ${hour}`;
  }
}
