import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import {
  VStack,
  Heading,
  Icon,
  useTheme,
  Text,
  HStack,
  Avatar,
  Center,
} from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";

import { Input } from "../components/Input";

export function SignIn() {
  //Para adicionar um efeito loading ao clicar em entrar
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { colors } = useTheme();

  function handleSignIn() {
    //Se email ou password for nulo
    if (!email || !password) {
      //Primeiro vem o nome do alerta e depois a mensagem mostrada
      return Alert.alert("Entrar", "Informe e-mail e senha.");
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.code);
        setIsLoading(false);

        //Caso o email seja inválido
        if (error.code == "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail inválido.");
        }

        //Caso o usuário não exista
        if (error.code == "auth/user-not-found") {
          return Alert.alert("Entrar", "Usuário não cadastrado.");
        }

        //Caso o usuário não exista
        if (error.code == "auth/wrong-password") {
          return Alert.alert("Entrar", "E-mail ou senha inválida.");
        }

        return Alert.alert("Entrar", "Não foi possível acessar.");
      });

    console.log(email, password);
  }
  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button
        onPress={handleSignIn}
        title="Entrar"
        w="full"
        //Propriedade de carregamento nativa do native base, mostra o loading e desabilita o botão
        isLoading={isLoading}
      />
      <HStack alignItems="center" mt={10}>
        <Avatar
          bg="purple.600"
          alignSelf="center"
          size="xl"
          source={{
            uri: "https://uploaddeimagens.com.br/images/003/963/662/original/eu.jpeg?1659207149",
          }}
        >
          AC
        </Avatar>
        <Text ml={5} color="#996DFF" fontSize="md">
          Ana Carolina Andrade
        </Text>
      </HStack>
    </VStack>
  );
}
