//Uma declaração global
//Sobreesrevo o namespace do ReactNavigation passando uma interface
//Ela terá uma hoem e um new sem nenhum parâmetro e um details que passa como propriedade um orderId do tipo String
//Para que eu possa ver os detalhes, eu preciso passar o id dessa ordem para poder carregar e buscar ela no banco
export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      new: undefined;
      details: { orderId: string };
    }
  }
}
