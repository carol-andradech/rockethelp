import { VStack, Text, HStack, useTheme, ScrollView, Box } from "native-base";
import { Alert } from "react-native";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { OrderProps } from "../components/Order";
import firestore from "@react-native-firebase/firestore";
import { orderFirestoreDTO } from "../DTOs/orderFirestoreDTO";
import { dateFormat } from "../utils/fireStoreDateFormate";
import { Loading } from "../components/Loading";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
} from "phosphor-react-native";
import { CardDetails } from "../components/CardDetails";

//Vou utilizar esse id para buscar no banco de dados
type RoutesParams = {
  orderId: string;
};

//Importo os tipos de Order mais os que defino
type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");
  //Começa como um objeto vazio do tipo OrderDetails
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();

  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as RoutesParams;

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação"
      );
    }

    firestore()
      .collection<orderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação Encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação.");
      });
  }

  useEffect(() => {
    firestore()
      //defin a tipagem do retorno
      .collection<orderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        //Faço a destruturação
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        //Se existe um cloased_at lá, então quero utilizar a função de formatação.
        //Se não tiver, deixa nulo
        const closed = closed_at ? dateFormat(closed_at) : null;

        //Quando o nome for o mesmo, não precisa repetir, por ex: patrimony: patrimony
        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={Clipboard}
        />

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>

      {
        //Se a ordem estiver aberta, aparece o botão para encerrar a solicitação
        order.status === "open" && (
          <Button
            title="Encerrar solicitação"
            m={5}
            onPress={handleOrderClose}
          />
        )
      }
    </VStack>
  );
}
