import { Text, Button, IButtonProps, useTheme } from "native-base";

//crio um tipo que recebe tanto as propriedades do botão do native base
//mais as priedades que desejo criar
//o isActive não é obrigatório
//o type pode ser somente "open" ou "closed"
type Props = IButtonProps & {
  title: string;
  isActive?: boolean;
  type: "open" | "closed";
};

//por padrão, o isActive inicia como false
//..rest são as outras propriedades que não defini mas podem ser recebidas
export function Filter({ title, isActive = false, type, ...rest }: Props) {
  const { colors } = useTheme();

  //Se o tipo for open seleciona a cor laranja
  //Caso contrário, seleciona a cor verde
  const colorType = type === "open" ? colors.secondary[700] : colors.green[300];

  return (
    <Button
      variant="outline"
      //Se o botão está selecionado, o isActive é true (1), se não, é false (0)
      borderWidth={isActive ? 1 : 0}
      borderColor={colorType}
      bgColor="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      <Text
        //O color se baseia no isActive que é definido peo botão
        //Se o isActive for true
        //então o color recebe o colorType igual ao type recebido do Home
        color={isActive ? colorType : "gray.300"}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  );
}
