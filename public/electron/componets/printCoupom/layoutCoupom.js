const currencyFormatter = require("currency-formatter");
const format = require("date-fns/format");
const path = require("path");
const { getAddressStore } = require("../../storage");

/**
 * Cria o Layout do cupom para ser impresso
 * @param {object} order
 * @returns {object} Object contendo dados de impressão do pedido
 */
const layoutCoupom = async (order) => {
  const { address, number, neighborhood, city, uf, phone } =
    await getAddressStore();

  const data = [
    {
      type: "image",
      path: path.join(__dirname, "..", "..", "assets", "logo192.png"), // file path
      position: "center", // position of image: 'left' | 'center' | 'right'
      width: "auto", // width of image in px; default: auto
      height: "90px", // width of image in px; default: 50 or '50px'
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: `${address}, ${number}, ${neighborhood}, ${city}/${uf}<br>${phone}<br><br><br>`,
      style: {
        fontSize: "16px",
        fontFamily: "sans-serif",
        textAlign: "center",
      },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "CUPOM NÃO FISCAL<br><br>",
      style: {
        textAlign: "center",
        fontFamily: "sans-serif",
        fontSize: "18px",
        fontWeight: 700,
        letterSpacing: ".3rem",
      },
    },
    {
      type: "table",
      style: { border: "0 solid #fff" }, // style the table
      tableHeader: [],
      tableBody: [
        [
          {
            type: "text",
            value: "PEDIDO N",
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "left",
            },
          },
          {
            type: "text",
            value: addZero(order.id),
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "left",
            },
          },
          {
            type: "text",
            value: format(new Date(order.dateTimeOrder), "dd/MM/yyyy HH:mm:ss"),
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "right",
            },
          },
        ],
      ],
      tableFooter: [],
      tableHeaderStyle: {},
      tableBodyStyle: { border: "0px solid #fff" },
      tableFooterStyle: {},
    },
    {
      type: "table",
      style: { border: "0 solid #fff" }, // style the table
      tableHeader: [],
      tableBody: [
        [
          {
            type: "text",
            value: "TIPO PEDIDO",
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "left",
            },
          },
          {
            type: "text",
            value: order.deliveryType,
            style: {
              fontSize: "18px",
              "font-weight": "700",
              fontFamily: "sans-serif",
              textAlign: "right",
            },
          },
        ],
      ],
      tableFooter: [],
      tableHeaderStyle: {},
      tableBodyStyle: { border: "0px solid #fff" },
      tableFooterStyle: {},
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: `<strong>Cliente:</strong> ${order.name_client}<br>`,
      style: {
        fontSize: "14px",
        padding: "5px 0",
        fontFamily: "sans-serif",
        textAlign: "left",
      },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: `<strong>Endereço:</strong> ${order.address}, n. ${order.number}, ${order.neighborhood}, ${order.city}/${order.uf}<br>`,
      style: {
        fontSize: "14px",
        padding: "5px 0",
        fontFamily: "sans-serif",
        textAlign: "left",
      },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: `<strong>Ponto Referência:</strong> ${order.PointReferences} <br>`,
      style: {
        fontSize: "14px",
        padding: "5px 0",
        fontFamily: "sans-serif",
        textAlign: "left",
      },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: `<strong>Telefone:</strong> ${order.phone}<br><br>`,
      style: {
        fontSize: "14px",
        padding: "5px 0",
        fontFamily: "sans-serif",
        textAlign: "left",
      },
    },
    {
      type: "table",
      style: { border: "0 solid #fff" }, // style the table
      tableHeader: [" # ", "Descrição", "Qtd", "Total"],
      tableBody: await createItemOrder(order.item),
      tableFooter: [],
      tableHeaderStyle: { backgroundColor: "#000", color: "white" },
      tableBodyStyle: { border: "0px solid #fff" },
      tableFooterStyle: {},
    },
    {
      type: "table",
      style: { marginTop: "15px", border: "0 solid #fff" }, // style the table
      tableHeader: [],
      tableBody: [
        [
          {
            type: "text",
            value: "Desconto:",
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "left",
            },
          },
          {
            type: "text",
            value: order.discount,
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "right",
            },
          },
        ],
      ],
      tableHeaderStyle: {},
      tableBodyStyle: { border: "0px solid #fff" },
      tableFooterStyle: {},
    },
    {
      type: "table",
      style: { border: "0 solid #fff" }, // style the table
      tableHeader: [],
      tableBody: [
        [
          {
            type: "text",
            value: "Taxa de entrega:",
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "left",
            },
          },
          {
            type: "text",
            value: order.vTaxaDelivery,
            style: {
              fontSize: "14px",
              fontFamily: "sans-serif",
              textAlign: "right",
            },
          },
        ],
      ],
      tableHeaderStyle: {},
      tableBodyStyle: { border: "0px solid #fff" },
      tableFooterStyle: {},
    },
    {
      type: "table",
      style: { border: "0 solid #fff" }, // style the table
      tableHeader: [],
      tableBody: [
        [
          {
            type: "text",
            value: "TOTAL:",
            style: {
              fontFamily: "sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              textAlign: "left",
            },
          },
          {
            type: "text",
            value: money(order.totalPurchase),
            style: {
              fontFamily: "sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              textAlign: "right",
            },
          },
        ],
      ],
      tableHeaderStyle: {},
      tableBodyStyle: { border: "0px solid #fff" },
      tableFooterStyle: {},
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: order.note
        ? `<strong>Obs: </strong><span>${order.note}</span>`
        : "",
      style: {
        fontSize: "14px",
        padding: "10px 0",
        fontFamily: "sans-serif",
        textAlign: "center",
      },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: "AGRADECEMOS SUA PREFERENCIA !!!",
      style: {
        fontSize: "14px",
        padding: "10px 0",
        fontFamily: "sans-serif",
        textAlign: "center",
      },
    },
    {
      type: "barCode", // Do you think the result is ugly? Me too. Try use an image instead...
      value: addZero(order.id),
      displayValue: false, // Exibir valor abaixo do codigo
      height: 40,
      width: 2,
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: `Emissão: ${date()}<br>Sistema Lesoftware Versão: 1.1.0`,
      style: {
        fontSize: "12px",
        padding: "10px 0",
        fontFamily: "sans-serif",
        textAlign: "center",
      },
    },
  ];

  return data;
};

/**
 * Retorna um Boolean true|false se existe adicional ou não
 * @param {Array<object>} additional Contendo os adicionais do item do pedido
 * @returns {Boolean} true | false
 */
const hasAdditional = (additional) => (additional.length > 0 ? true : false);

/**
 * Criar o Item do cupom do pedido
 * @param {object} itemOrder Pedido do cliente
 * @returns {Array<object>} Retorna um array com a formatação de impressão do cupom
 */
async function createItemOrder(itemOrder) {
  const items = await itemOrder.map((order, idx) => {
    const additional = additionalItem(order.additional);
    return [
      { type: "text", value: idx + 1, style: { textAlign: "left" } },
      {
        type: "text",
        value: `${order.product}<br>${additional ? additional : ""}${
          order.note ? `<br>${order.note}` : ""
        }`,
        style: {
          fontSize: "14px",
          fontFamily: "sans-serif",
          textAlign: "left",
        },
      },
      {
        type: "text",
        value: `${order.amount} x ${numberFormat(
          Number(order.price) + Number(order.totalAdditional)
        )}`,
        style: {
          fontSize: "14px",
          fontFamily: "sans-serif",
          textAlign: "right",
        },
      },
      {
        type: "text",
        value: numberFormat(order.total),
        style: {
          fontSize: "14px",
          fontFamily: "sans-serif",
          textAlign: "right",
        },
      },
    ];
  });
  return items;
}

/**
 * Criar o layout dos adiconais do item do pedido
 * @param {Array<Object>} item
 */
function additionalItem(itemAdditional) {
  // Verificar se o item tem adicionais
  if (!hasAdditional(itemAdditional)) return;
  // Caso tenha algum adicionais percorrer o array e criar o layout de impressão
  let layoutAdditional;
  layoutAdditional = "<strong>Adicionais:</strong><br>";

  itemAdditional.map(
    (addit) =>
      (layoutAdditional += `<span>${addit.description} ${addit.price}</span><br>`)
  );

  return layoutAdditional;
}

function addZero(num, len = 8) {
  let numberWithZeroes = String(num);
  let counter = numberWithZeroes.length;

  while (counter < len) {
    numberWithZeroes = "0" + numberWithZeroes;
    counter++;
  }
  return numberWithZeroes;
}

function money(value) {
  return currencyFormatter.format(value, { code: "BRL" });
}

function numberFormat(value, decimalDigits = 2, symbol = "") {
  return currencyFormatter.format(value, {
    symbol: symbol,
    decimalDigits: decimalDigits,
    thousandsSeparator: ".",
    decimalSeparator: ",",
  });
}

function date() {
  const now = new Date();
  return `<span>${format(now, "dd/MM/yyyy HH:mm:ss")}</span>`;
}

module.exports = layoutCoupom;
