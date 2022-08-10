import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { Details } from "../screens/Details";
import { Register } from "../screens/Register";

//Desestruturo com o que vou usar
//Para o Navegator eu consigo passar configurações para minha rota de navegação e dentro do Navegator eu coloco as Screens.
const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    //O headerShown esconde o nome das rotas do topo da tela
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="new" component={Register} />
      <Screen name="details" component={Details} />
    </Navigator>
  );
}
