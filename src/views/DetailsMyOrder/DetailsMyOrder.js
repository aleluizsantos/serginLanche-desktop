import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  BsFillBagCheckFill,
  BsTrash,
  BsFillPrinterFill,
  BsPlusCircleDotted,
} from "react-icons/bs";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Table,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Label,
  Alert,
} from "reactstrap";

import "./styles.css";
import { formatDateTime, formatCurrency, addZeros } from "../../hooks/format";
import {
  getItemsMyOrders,
  upDateStateMyOrders,
  deletePedido,
  deleteItemPedido,
} from "../../hooks/MyOrders";
import { getProductSearch } from "../../hooks/Product";
import { addItemOrder, changeItemMyOrder } from "../../hooks/MyOrders";
import {
  CLEAR_MESSAGE,
  NEW_ORDERS,
  SET_MESSAGE,
} from "../../store/Actions/types";
import { ModalView, SelectDropdown } from "../../components";

import imgDelivery from "../../assets/img/delivery.png";
import imgTable from "../../assets/img/table.png";
import imgStore from "../../assets/img/store.png";
import imgWhatsapp from "../../assets/img/iconWhatsapp.png";
import icoTrash from "../../assets/img/icoTrash-64.png";
import icoBuy from "../../assets/img/icoBuy-64.png";
import icoStatus from "../../assets/img/icoStatus_64.png";

const typeDelivery = {
  EM_ANALISE: 1,
  EM_PREPARAÇÃO: 2,
  ROTA_ENTREGA: 3,
  RETIRAR_LOJA: 4,
  AGENDADO: 5,
  FINALIZADO: 6,
};

const imgHeader = (idTypeDelivery) => {
  switch (idTypeDelivery) {
    case 1:
      return imgDelivery;
    case 2:
      return imgStore;
    case 3:
      return imgTable;
    default:
      break;
  }
};

const DetailsMyOrder = (props) => {
  const history = useHistory();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { newOrders } = useSelector((state) => state.Notificate);
  const [currentPorcent, setCurrentPorcent] = useState(0);
  const [descriptioStatus, setDescriptionStatus] = useState(null);
  const [itemsMyOrders, setItemsMyOrders] = useState([]);
  const [taxaDelivery, setTaxaDelivery] = useState({ taxa: 0, vMinTaxa: 0 });
  const [myOrder, setMyOrder] = useState({}); // armazena o dados do pedido.
  const [isModalStateMyOrder, setIsModalStateMyOrder] = useState(false);
  const [isModalRemoveItem, setIsModalRemoveItem] = useState(false);
  const [isModalDeleteOrder, setIsModalDeleteOrder] = useState(false);
  const [isModalInsertItem, setIsModalInsertItem] = useState(false);
  const [itemSelected, setItemSelected] = useState({});
  const [productSearch, setProductSearch] = useState("");
  const [amountItemAdd, setamountItemAdd] = useState(1);
  const [phoneWhatsapp, setPhoneWhatsapp] = useState("");
  const [changeAmount, setChangeAmount] = useState({
    isEdit: false,
    request_id: state.id,
    itens: {},
  });

  useEffect(() => {
    (() => {
      getItemsMyOrders(state.id).then((response) => {
        // Transformar o array em um objeto com apenas as quantidade
        // dos itens
        const jsonAmountItem = response.itemsRequest.reduce(
          (obj, item) => ({
            ...obj,
            [item.id]: item.amount,
          }),
          {}
        );

        setChangeAmount({
          ...changeAmount,
          itens: jsonAmountItem,
        });
        setItemsMyOrders(response.itemsRequest);
        setTaxaDelivery(response.taxaDelivery);
      });
      setMyOrder(state);
      setPhoneWhatsapp(state?.phone?.replace(/([^\d])+/gim, ""));
      setDescriptionStatus(state.statusRequest);
      state.statusRequest_id < typeDelivery.RETIRAR_LOJA
        ? setCurrentPorcent(
            state.statusRequest_id === 5 ? 4 * 25 : state.statusRequest_id * 25
          )
        : setCurrentPorcent(100);
    })();

    // eslint-disable-next-line
  }, [state, state.id, state.statusRequest, state.statusRequest_id]);

  function handleIsModal() {
    if (itemsMyOrders.length <= 0) {
      dispatch({
        type: SET_MESSAGE,
        payload: "Você não possui nenhum item em seu pedido.",
      });
    } else {
      myOrder.statusRequest_id < 5 &&
        setIsModalStateMyOrder(!isModalStateMyOrder);
    }
  }

  function handleModalRemoveItem(item) {
    setItemSelected(item);
    setIsModalRemoveItem(!isModalRemoveItem);
  }

  function handleModalItemProduct() {
    setamountItemAdd(1);
    setProductSearch();
    setIsModalInsertItem(true);
  }

  function nextStageMyOrder() {
    if (myOrder.statusRequest_id < typeDelivery.AGENDADO) {
      //Checar se foi alterado as quantidade dos item
      if (changeAmount.isEdit) salveChangeItem();

      upDateStateMyOrders(myOrder).then((response) => {
        // Retirar o pedido novo estado global
        newOrders.length > 0 &&
          dispatch({
            type: NEW_ORDERS,
            payload: newOrders.filter((item) => item.id !== myOrder.id),
          });

        setMyOrder({
          ...myOrder,
          statusRequest_id: response.nextState,
        });
        setDescriptionStatus(response.descriptionNextActionRequest);
        setIsModalStateMyOrder(false);
        dispatch({
          type: SET_MESSAGE,
          payload: `Pedido ${response.descriptionNextActionRequest}`,
        });
        response.nextState === 6 && history.goBack();
      });
      currentPorcent < 100 && setCurrentPorcent(currentPorcent + 25);
    }
  }

  //Deletar o pedido
  function handleRemoverOrder() {
    if (myOrder.statusRequest_id <= typeDelivery.EM_PREPARAÇÃO) {
      deletePedido(myOrder.id).then(() => {
        dispatch({
          type: SET_MESSAGE,
          payload: `O pedido '#${myOrder.id}' foi excluido.`,
        });
        history.goBack();
      });
    } else {
      dispatch({
        type: SET_MESSAGE,
        payload: "O pedido não pode ser cancelado!",
      });
    }
  }

  // Remover item do pedido
  function handleRemoverItem() {
    const { id, request_id } = itemSelected;

    myOrder.statusRequest_id <= typeDelivery.EM_PREPARAÇÃO &&
      deleteItemPedido(request_id, id).then((response) => {
        setMyOrder(response.dataOrder);
        setItemsMyOrders(response.items);
        setItemSelected({});
        setIsModalRemoveItem(false);
      });
  }

  // Buscar lista de Produto conforme parameto passado
  const searchProduct = async (inputValue) => {
    const response = await getProductSearch(inputValue);
    const dataProducts = response.products.map((item) => {
      const dataItem = {
        value: item.id,
        label: item.name,
        measureUnid: item.measureUnid,
        image_url: item.image_url,
        price: item.price,
        promotion: item.promotion,
        pricePromotion: item.pricePromotion,
      };
      return dataItem;
    });
    return dataProducts;
  };

  function handleChangesAmount(amount) {
    setamountItemAdd(amount.replace(",", "."));
  }

  function handleGoBack() {
    dispatch({
      type: CLEAR_MESSAGE,
    });
    history.push("myorders");
  }

  async function handleAddItem() {
    //Produto a ser adicionado
    const amount = amountItemAdd;
    const productSelected = productSearch;

    if (!validateNumber(amount) || productSelected === undefined) {
      alert("Verificar o campo em vermelho, valor não é uma quantidade válida");
      return;
    }
    // Checar se o produto já esta nos itens
    const existItem = itemsMyOrders.find(
      (item) => item.product_id === productSelected.value
    );
    if (existItem) {
      setIsModalInsertItem(false);
      dispatch({
        type: SET_MESSAGE,
        payload: "Produto já existe na lista, altere a quantidade",
      });
      setProductSearch("");
      return;
    }

    const dataItem = {
      amount: amount,
      price: productSelected.promotion
        ? productSelected.pricePromotion
        : productSelected.price,
      product_id: productSelected.value,
      request_id: myOrder.id,
    };

    await addItemOrder(dataItem).then(async (response) => {
      const { dataOrder, items } = response;
      setMyOrder(dataOrder);
      setItemsMyOrders(items);
      setIsModalInsertItem(false);
      dispatch({
        type: SET_MESSAGE,
        payload: "Foi adicionado um item no pedido",
      });
      setProductSearch("");

      let indexChange = {}; // Criar index dos items do pedido para ser atualizados
      items.forEach((item) => {
        indexChange = { ...indexChange, [item.id]: item.amount };
      });
      setChangeAmount({
        ...changeAmount,
        itens: indexChange,
      });
    });
  }

  function handleMessageWhatsapp(message) {
    // window.location.href = `whatsapp://send/?phone=55${phoneWhatsapp}&text=${message}&app_absent=0`;
    // window.open(
    //   `https://api.whatsapp.com/send/?phone=55${phoneWhatsapp}&text=${message}&app_absent=0`,
    //   "_blank"
    // );
    window.location.href = `whatsapp://send/?phone=55${phoneWhatsapp}&text=${message}`;
  }

  function validateNumber(value) {
    const isNum = Number.isFinite(Number(value));
    return isNum;
  }

  function handleEditAmountItem(event) {
    event.persist();

    const value = event.target.value.replace(",", ".");
    const dataChangeAmount = {
      ...changeAmount,
      isEdit: true,
      itens: {
        ...changeAmount.itens,
        [event.target.name]: value,
      },
    };
    setChangeAmount(dataChangeAmount);
  }
  // Calcular a alterar do quantidade no item do pedido
  async function calcChangeItem(idItem, amount) {
    let totalPurchase = 0;
    let totalAdditional = 0;
    let grandTotal = 0;

    //Recuperar os dados o item passado pelo id
    const itemCurrent = itemsMyOrders.find(
      (itemOrder) => itemOrder.id === idItem
    );
    //Quantidade alterada
    let newAmount = parseFloat(amount) || "";

    // Checar se a quantidade passada é valida
    if (validateNumber(amount) && newAmount !== "") {
      // Alterar os valor na lista e recalculando a soma do item sem os adicionais
      const changeItens = itemsMyOrders.map((itemMyOrder) => {
        //Somar o valor total dos addicional do pedido
        totalAdditional = itemMyOrder.additional.reduce((total, item) => {
          return total + parseFloat(item.price);
        }, 0);

        // Alterar a quantidade do item passado pelo Id
        if (itemMyOrder.id === Number(idItem)) {
          totalPurchase += newAmount * itemMyOrder.price;
          totalAdditional = totalAdditional * newAmount;
          itemMyOrder.amount = newAmount;
        } else {
          totalAdditional = totalAdditional * itemMyOrder.amount;
          totalPurchase += itemMyOrder.amount * itemMyOrder.price;
        }
        grandTotal += totalPurchase + totalAdditional;
        totalPurchase = 0;
        totalAdditional = 0;
        return itemMyOrder;
      });

      setItemsMyOrders(changeItens);

      // Verificar se o valor do pedido atingiu isenção da taxa de entrega
      const taxa =
        grandTotal >= taxaDelivery.vMinTaxa ? 0 : parseFloat(taxaDelivery.taxa);

      // Salvar os novos valores no State
      setMyOrder({
        ...myOrder,
        vTaxaDelivery: taxa,
        totalPurchase: grandTotal,
      });
    } else {
      //Retonar a quantidade antiga. não houve mudança
      setChangeAmount({
        ...changeAmount,
        isEdit: false,
        itens: {
          ...changeAmount.itens,
          [idItem]: itemCurrent.amount,
        },
      });
    }
  }

  function salveChangeItem() {
    const itemsChanger = {
      myOrder: myOrder,
      items: itemsMyOrders,
    };
    // Gravar as alterações no banco de dados
    changeItemMyOrder(itemsChanger).then((response) => {
      if (!response) {
        dispatch({
          type: SET_MESSAGE,
          payload: "Erro ao atualizar verifiques as quantidades.",
        });
      }
    });
    // Alterar o Status de isEdit = false;
    setChangeAmount({
      ...changeAmount,
      isEdit: false,
    });
  }

  async function printCoupom() {
    const objectWithConfigPrint = {
      coupom: [myOrder],
      sound: false,
      dialogMessage: true,
    };

    window.indexBridge.servicePrintCoupom(objectWithConfigPrint);
  }

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">
                <div className="headerCard">
                  <Button
                    className="btn"
                    outline
                    size="sm"
                    onClick={() => handleGoBack()}
                  >
                    Voltar
                  </Button>
                  <span>Detalhe do pedido</span>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span>{state.deliveryType}</span>
                      {state.deliveryType_id === 3 && (
                        <>
                          <span
                            style={{
                              fontSize: 16,
                            }}
                          >
                            Mesa: {state.table_id}
                          </span>
                          <span style={{ fontSize: 16 }}>
                            comanda: {state.commads_id}
                          </span>
                        </>
                      )}
                    </div>
                    <img
                      src={imgHeader(state.deliveryType_id)}
                      alt={state.deliveryType}
                      className="type delivery"
                      style={{ paddingRight: 10 }}
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="idOrder">
                <div>
                  <span>#{addZeros(myOrder.id, 8)}</span>
                  <span>{formatDateTime(myOrder.dateTimeOrder)}</span>
                </div>

                <div>
                  <span>{descriptioStatus}</span>
                </div>
              </div>

              <div className="detailsClient">
                <div>
                  <p className="titleName">{myOrder?.name_client}</p>

                  <p>
                    {myOrder.deliveryType_id === 3 &&
                      `Atendente: ${myOrder.name}`}
                  </p>
                  {state?.phone && state.deliveryType_id !== 3 && (
                    <div>
                      <Button
                        color="default"
                        outline
                        size="sm"
                        onClick={() =>
                          handleMessageWhatsapp(
                            `Olá ${myOrder.name_client} tudo bem. %0ASomos do Sergin Lanche.`
                          )
                        }
                      >
                        <img
                          className="iconWhatsapp"
                          src={imgWhatsapp}
                          alt="Icone Whatsapp"
                        />{" "}
                        Entre em contato <span>{myOrder.phone}</span>
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <p>
                    <strong>Endereço: </strong> {myOrder.address},{" "}
                    {myOrder.number}, {myOrder.neighborhood}, {myOrder.city}/
                    {myOrder.uf}
                  </p>
                  <p>
                    <strong>Ponto de Referência: </strong>{" "}
                    {myOrder.PointReferences}
                  </p>
                </div>
              </div>

              <div className="shapePayment">
                <div>
                  <strong style={{ fontSize: 18 }}>Forma de Pagamento: </strong>
                  <span>
                    <img src={state.image} alt="icone" /> {state.payment}
                  </span>
                </div>
                {state.payment_id === 1 && (
                  <div>
                    <strong>Troco para: </strong>
                    <span style={{ fontSize: 20 }}>R$ {state.cash}</span>
                  </div>
                )}
              </div>

              <div className="contentStatus">
                <div className="stateMyOrder">
                  <div className="state">
                    <BsFillBagCheckFill />
                    <span>Pedido</span>
                  </div>
                  <div className="state" onClick={handleIsModal}>
                    {myOrder.statusRequest_id > 1 && <BsFillBagCheckFill />}
                    <span>Aprovar</span>
                  </div>
                  <div className="state" onClick={handleIsModal}>
                    {myOrder.statusRequest_id > 2 && <BsFillBagCheckFill />}
                    <span>Preparado</span>
                  </div>
                  <div className="state" onClick={handleIsModal}>
                    {myOrder.statusRequest_id > 3 && <BsFillBagCheckFill />}
                    <span>
                      {myOrder.deliveryType_id === 1
                        ? "Confirmar Entrega"
                        : "Retirar na Loja"}
                    </span>
                  </div>
                  <div className="state" onClick={handleIsModal}>
                    {myOrder.statusRequest_id === 6 && <BsFillBagCheckFill />}
                    <span>Finalizado</span>
                  </div>
                  <div
                    className="currentBar"
                    style={{ width: `${currentPorcent}%` }}
                  />
                  <div className="currentBarBG" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="contentItemOrder">
                <Table responsive style={{ border: "solid 1px #a9a9a9" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>#</th>
                      <th>Descrição</th>
                      <th>Quantidade</th>
                      <th>Valor Unitário</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsMyOrders.map((item) => {
                      let totalItemAdditional = 0;
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="groupItem">
                              {myOrder.statusRequest_id <=
                                typeDelivery.EM_PREPARAÇÃO && (
                                <i
                                  className="fa fa-times"
                                  onClick={() => handleModalRemoveItem(item)}
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="groupItem">
                              <span className="textNameProduct">
                                {item.name}
                              </span>
                              {item.additional.length > 0 && (
                                <div>
                                  <span className="titleAddicional">
                                    Adicionais:
                                  </span>
                                </div>
                              )}
                              {item.additional.map((addit, idx) => {
                                totalItemAdditional =
                                  totalItemAdditional + Number(addit.price);
                                return (
                                  <div
                                    key={idx}
                                    className="itemGroupAdditional"
                                  >
                                    <span>{addit.description}</span>
                                    <span>R$ {addit.price}</span>
                                  </div>
                                );
                              })}
                              {item.note && (
                                <div className="content-note">
                                  <span className="titleAddicional">
                                    Observação:
                                  </span>
                                  <span className="note">{item.note}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <Input
                              type="text"
                              name={item.id}
                              disabled={
                                myOrder.statusRequest_id <=
                                typeDelivery.EM_PREPARAÇÃO
                                  ? false
                                  : true
                              }
                              onBlur={() =>
                                calcChangeItem(
                                  item.id,
                                  changeAmount.itens[item.id]
                                )
                              }
                              invalid={
                                !validateNumber(changeAmount.itens[item.id]) ||
                                changeAmount.itens[item.id] === ""
                                  ? true
                                  : false
                              }
                              // invalid={
                              //   (changeAmount.itens[item.id] || item.amount) ===
                              //   ""
                              //     ? true
                              //     : validateNumber(changeAmount.itens[item.id])
                              // }
                              onFocus={(event) => event.target.select()}
                              value={changeAmount.itens[item.id] || ""}
                              onChange={handleEditAmountItem}
                            />
                          </td>
                          <td>{item.price}</td>
                          <td>
                            {formatCurrency(
                              parseFloat(item.amount) *
                                (parseFloat(item.price) +
                                  Number(totalItemAdditional))
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {changeAmount.isEdit && (
                  <div>
                    <Alert color="success" fade={true}>
                      <div className="alertChangeItems">
                        <span>QUANTIDADE ALTERADAO NO PEDIDO</span>
                        <Button
                          onClick={() => salveChangeItem()}
                          color="success"
                        >
                          Salvar Alteração
                        </Button>
                      </div>
                    </Alert>
                  </div>
                )}
              </div>

              <div className="contentTotal">
                <div className="note">
                  <p>{myOrder.note || "Sem observações"}</p>
                </div>
                <div className="subtTotals">
                  <div className="groupTotals">
                    <strong>SubTotal:</strong>
                    <span>
                      {formatCurrency(
                        Number(myOrder.totalPurchase - myOrder.vTaxaDelivery)
                      )}
                    </span>
                  </div>
                  <div className="groupTotals">
                    <strong>Taxa de entrega:</strong>
                    <span
                      style={myOrder.vTaxaDelivery > 0 ? { color: "red" } : {}}
                    >
                      {formatCurrency(myOrder.vTaxaDelivery)}
                    </span>
                  </div>
                  <div className="groupTotals">
                    <strong>Desconto:</strong>
                    <span>{formatCurrency(myOrder.discount)}</span>
                  </div>
                  <div className="total">
                    <strong>Total</strong>
                    <span>{formatCurrency(Number(myOrder.totalPurchase))}</span>
                  </div>
                </div>
              </div>
            </CardBody>
            {myOrder.statusRequest_id !== 6 && (
              <CardFooter>
                <div className="groupFooterButton">
                  <Button
                    disabled={
                      myOrder.statusRequest_id <= typeDelivery.EM_PREPARAÇÃO
                        ? false
                        : true
                    }
                    onClick={() => setIsModalDeleteOrder(!isModalDeleteOrder)}
                  >
                    <BsTrash size={20} /> Excluir Pedido
                  </Button>
                  <Button
                    disabled={
                      myOrder.statusRequest_id <= typeDelivery.EM_PREPARAÇÃO
                        ? false
                        : true
                    }
                    onClick={() => handleModalItemProduct()}
                  >
                    <BsPlusCircleDotted size={20} /> Adicionar Item
                  </Button>
                  <Button onClick={printCoupom}>
                    <BsFillPrinterFill size={20} /> Imprimir
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </Col>
      </Row>

      {/* MODAIS DA PAGE */}
      {/* Alterar status do pedido */}
      <ModalView
        title={
          <>
            <img src={icoStatus} alt="status" style={{ height: 40 }} />{" "}
            <Label> Alterar status pedido </Label>
          </>
        }
        modal={isModalStateMyOrder}
        toggle={() => setIsModalStateMyOrder(!isModalStateMyOrder)}
        confirmed={() => nextStageMyOrder(myOrder.id)}
      >
        <div className="bodyModalStatus">
          {myOrder.statusRequest_id === 1 && (
            <span>
              Aprovar o pedido do cliente <strong>{myOrder.name}</strong>
            </span>
          )}
          {myOrder.statusRequest_id === 2 && (
            <span>Pedido está pronto para a entrega.</span>
          )}
          {myOrder.statusRequest_id === 3 && (
            <span>Produto foi entregue, finalizar o pedido.</span>
          )}
          {myOrder.statusRequest_id === 4 && (
            <span>Produto foi retirado na loja, finalizar o pedido.</span>
          )}
        </div>
      </ModalView>
      {/* Remover item */}
      <ModalView
        title={
          <>
            <img src={icoTrash} alt="trash" style={{ height: 40 }} />{" "}
            <Label> Remover item </Label>
          </>
        }
        modal={isModalRemoveItem}
        toggle={() => setIsModalRemoveItem(!isModalRemoveItem)}
        confirmed={() => handleRemoverItem(itemSelected)}
      >
        <div className="text-center">
          Tem certeza que deseja remover o item '
          <strong>{itemSelected.name || ""}</strong>'?
        </div>
      </ModalView>
      {/* Excluir Pedido */}
      <ModalView
        title={
          <>
            <img src={icoTrash} alt="trash" style={{ height: 40 }} />{" "}
            <Label>Excluir pedido?</Label>
          </>
        }
        modal={isModalDeleteOrder}
        toggle={() => setIsModalDeleteOrder(!isModalDeleteOrder)}
        confirmed={() => handleRemoverOrder()}
      >
        <div className="text-center">
          <span>Deseja realmente excluir o pedido?</span>
        </div>
      </ModalView>
      {/* Adicionar item no pedido */}
      <ModalView
        title={
          <>
            <img src={icoBuy} alt="icoBuy" style={{ height: 50 }} />{" "}
            <Label> Adicionar item </Label>
          </>
        }
        size="lg"
        modal={isModalInsertItem}
        toggle={() => setIsModalInsertItem(!isModalInsertItem)}
        confirmed={() => handleAddItem()}
      >
        <div className="text-justify">
          <Row>
            <Col className="pr-1" md="6">
              <FormGroup>
                <Label>Produto</Label>
                <SelectDropdown
                  placeholder="Informe o produto"
                  options={searchProduct}
                  isClearabl={true}
                  setValue={productSearch}
                  onChange={setProductSearch}
                />
              </FormGroup>
            </Col>
            <Col className="pl-1" md="6">
              <FormGroup>
                <label>Quantidade</label>
                <Input
                  style={{ fontWeight: 700 }}
                  type="text"
                  name="amount"
                  value={amountItemAdd}
                  onFocus={(event) => event.target.select()}
                  invalid={
                    amountItemAdd === "" ? true : !validateNumber(amountItemAdd)
                  }
                  onChange={(event) => handleChangesAmount(event.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          {productSearch && (
            <Row>
              <Col className="imgAddItem" md="6">
                <img src={productSearch.image_url} alt={productSearch.name} />
              </Col>

              <Col md="6">
                <p className="titleItemSelectedAddItem">
                  {productSearch.label}
                </p>
                <span>Preço: </span>
                <p className="priceItemSlectedAddItem">
                  {productSearch.price} / {productSearch.measureUnid}
                </p>
                <span>Preço Promocional: </span>
                <p className="priceItemSlectedAddItem">
                  <span style={{ color: productSearch.promotion ? "red" : "" }}>
                    {productSearch.pricePromotion} / {productSearch.measureUnid}
                  </span>
                </p>
              </Col>
            </Row>
          )}
        </div>
      </ModalView>
    </div>
  );
};

export default DetailsMyOrder;
