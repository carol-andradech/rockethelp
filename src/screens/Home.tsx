import { useState, useEffect } from "react";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import {
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
  FlatList,
  Center,
} from "native-base";

import { SignOut } from "phosphor-react-native";
import { ChatTeardropText } from "phosphor-react-native";

import { dateFormat } from "../utils/fireStoreDateFormate";

import Logo from "../assets/logo_secondary.svg";

import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { isLoading } from "expo-font";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);

  //Um use state que mapeia o status do botão
  //E está definido que ele pode estar apenas open ou closed, e inicia como open.
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );

  //Um use state com um array das ordem e todos os seus objetos.
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const { colors } = useTheme();
  const navigation = useNavigation();

  //Uma função para direcionar para a rota new Register
  //Chamada ao clique do botão Nova Solicitação
  function handleNewOrder() {
    navigation.navigate("new");
  }

  //Função que abre o Details da solicitação
  //Ela espera uma orderID do tipo String
  //E utilizo o navite para chamar o Details, passando o id da solicitação
  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert("Sair", "Não foi possível sair.");
      });
  }

  useEffect(
    () => {
      //Quando eu trocar o filtro, vou querer buscar as informações filtradas
      //Então vai gerar uma nova requisição, e um tempo de loading
      setIsLoading(true);

      const subscriber = firestore()
        .collection("orders")
        //um filtro onde seleciona o status onde o status é igual ao selecionado
        .where("status", "==", statusSelected)
        //onSnapShot atualiza os dados em tempo real
        //Uso o snapshot para percorrer os dados que estão dentro dessa coleção
        .onSnapshot((snapshot) => {
          //acesso os documentos retornados do snapshot
          //e percorro por cada documento retornado dessa consulta
          const data = snapshot.docs.map((doc) => {
            //para cada documento, consigo desestruturar os dados
            //e definir o que quero acessar
            const { patrimony, description, status, created_at } = doc.data();

            return {
              id: doc.id,
              patrimony,
              description,
              status,
              when: dateFormat(created_at),
            };
          });

          //Primeiro percorri os documentos retornados da coleção
          //Para poder formatar eles do jeito desejado. Pegar o Id, mudar o formato da data.
          //Agora retorno para a const data e salvo no meu estado Orders.
          setOrders(data);
          setIsLoading(false);
        });

      //método de limpeza
      return subscriber;
    },
    //O array vazio só executa uma vez
    //colocando o meu filtro statusSelected como uma dependência do useEffect
    //quando esse estado mudar, ele faz a busca novamente.
    [statusSelected]
  );

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100"> Meus Chamados</Heading>
          <Text color="gray.200"> {orders.length} </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type="open"
            title="em andamento"
            //Mudo o useState do status para open
            onPress={() => setStatusSelected("open")}
            //Passa para o componente Filter a propriedade isActive como "open"
            isActive={statusSelected === "open"}
          />
          <Filter
            type="closed"
            title="fechado"
            //Mudo o useState do status para closed
            onPress={() => setStatusSelected("closed")}
            //Passa para o componente Filter a propriedade isActive como "closed"
            isActive={statusSelected === "closed"}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text
                  color="gray.300"
                  fontSize="xl"
                  mt={6}
                  textAlign="center"
                  //Uso {"\n"} para pular uma linha
                  //O texto muda para em andamento ou finalizados
                  //dependendo do statusSelected
                >
                  Você ainda não possui {"\n"}
                  solicitações
                  {statusSelected === "open" ? " em andamento" : " finalizadas"}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
