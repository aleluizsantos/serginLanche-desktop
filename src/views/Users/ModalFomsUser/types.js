export const listTypeUser = [
  { value: "attendant", label: "Atendente", name: "typeUser" },
  { value: "admin", label: "Administrador", name: "typeUser" },
  { value: "user", label: "Cliente", name: "typeUser" },
];

export const typeFormUserSystem = {
  isEdit: false,
  isValid: false,
  touched: {},
  values: {},
  errors: {},
};

export const schemaFormUserSystem = {
  name: {
    presence: { allowEmpty: false, message: "^Qual é o nome do usuário." },
  },
  email: {
    presence: { allowEmpty: false, message: "^Qual seu e-mail" },
    email: true,
  },
  typeUser: {
    presence: {
      allowEmpty: false,
      message: "^Que tipo de usuário é este usuário.",
    },
  },
  phone: {
    presence: { allowEmpty: false, message: "^Qual seu telefone" },
  },
  password: {
    presence: { allowEmpty: false, message: "^Senha é obrigatório" },
    length: {
      minimum: 6,
      message: "^Senha deve ter no mínimo 6 caracteres",
    },
  },
  confirmedPassword: {
    presence: {
      allowEmpty: false,
      message: "^Confirmar senha é obrigatório",
    },
    length: {
      minimum: 6,
      message: "^Senha deve ter no mínimo 6 caracteres",
    },
    equality: {
      // Input we want it to be equal to
      attribute: "password",
      // Error message if passwords don't match
      message: "^A senha digitada não são identicas",
    },
  },
};
