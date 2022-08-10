import { VStack, HStack, Text, Box, useTheme } from "native-base";
import { ReactNode } from "react";
import { IconProps } from "phosphor-react-native";

//Defino o que é necessário ou não ter
type Props = {
  title: string;
  description?: string;
  footer?: string;
  icon: React.ElementType<IconProps>;
  children?: ReactNode;
};

export function CardDetails({
  title,
  description,
  footer = null,
  //Como eu quero usar ele como um componente e componente precisa começar em letra maiúscula
  icon: Icon,
  children,
}: Props) {
  const { colors } = useTheme();

  return (
    <VStack bg="gray.600" p={5} mt={5} rounded="sm">
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.primary[700]} />
        <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
          {title}{" "}
        </Text>
      </HStack>

      {
        //A descrição é um valor de texto, para transformar em um valor boleano eu coloco !!
        //Se existir descrição, eu quero renderizar um texto
        !!description && (
          <Text color="gray.100" fontSize="md">
            {" "}
            {description}
          </Text>
        )
      }

      {children}

      {!!footer && (
        <Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
          <Text mt={3} color="gray.300" fontSize="sm">
            {footer}
          </Text>
        </Box>
      )}
    </VStack>
  );
}
