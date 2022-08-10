import { NavigationContainer } from "@react-navigation/native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";

export function Routes() {
  //Um estado para verificar se está carregando
  const [loading, setIsLoading] = useState(true);
  //Um estado para verificar se o usuário está autenticado ou não
  //Se estiver, ele recebe os dados do usuário, se não, não recebe nada
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  //Uma fuação anônima disparada automaticamente
  //O useEffect aplica uma lógica assim que a interface é renderizada
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((response) => {
      setUser(response);
      setIsLoading(false);
    });

    return subscriber;
  }, []);

  if (loading) {
    return <Loading />;
  }

  //Se o usuário existe, se tem conteúdo desse usuário, então somos levamos para o AppRoutes
  //Caso contrário, somos levamos para a página de SignIn
  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn />}
    </NavigationContainer>
  );
}
