const typePayment = {
  DINHEIRO: 1,
  NOTA: 5,
};
const typeDelivery = {
  DELIVERY: 1,
  RETIRADA: 2,
  TABLE: 3,
};
const stageDelivery = {
  EM_ANALISE: 1,
  EM_PREPARACAO: 2,
  ROTA_ENTREGA: 3,
  RETIRAR_LOJA: 4,
  AGENDADO: 5,
  FINALIZADO: 6,
  ACTIVE: "1,2,3,4,5",
  ALL: "1,2,3,4,5,6,7",
};

const typeUser = {
  attendant: "Atendente",
  admin: "Administrador",
  user: "Cliente",
};

export { typeDelivery, typePayment, stageDelivery, typeUser };
