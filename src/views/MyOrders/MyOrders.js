import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TfiTag, TfiPrinter, TfiControlForward } from "react-icons/tfi";
import { useHistory } from "react-router-dom";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import "./styles.css";
import imgDelivery from "../../assets/img/delivery.png";
import imgStore from "../../assets/img/store.png";
import imgOrderEmpty from "../../assets/img/orderEmpty.png";

import { formatDateTime } from "../../hooks/format";
import {
  getOrders,
  typeStatusMyOrders,
  upDateStateMyOrders,
} from "../../hooks/MyOrders";
import { NEW_ORDERS } from "../../store/Actions/types";

const MyOrders = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [myOrders, setMyOrders] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const { update } = useSelector((state) => state.Notificate);

  useEffect(() => {
    (() => {
      listMyOrders();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const MyDropdown = (myOrder) => {
    const isFinally = myOrder.item.statusRequest_id === 6 ? false : true;
    const statusRequest = myOrder.item.statusRequest;
    return (
      <div style={{ overflow: "auto" }}>
        <UncontrolledDropdown group>
          {isFinally && (
            <Button
              onClick={() => upDateStateMyOrders(myOrder.item)}
              size="sm"
              title="Próximo >>"
            >
              <TfiControlForward />
            </Button>
          )}
          <DropdownToggle
            caret
            size="sm"
            color="warning"
            title="Escolha o estágio"
          />
          <DropdownMenu container="body" style={{ border: "1px solid #000" }}>
            <DropdownItem onClick={() => upDateStateMyOrders(myOrder.item, 1)}>
              {statusRequest === "Em Analise" ? "✅" : "🔲"} Em Análise
            </DropdownItem>
            <DropdownItem onClick={() => upDateStateMyOrders(myOrder.item, 2)}>
              {statusRequest === "Em Preparação" ? "✅" : "🔲"}Em Preparação
            </DropdownItem>
            <DropdownItem onClick={() => upDateStateMyOrders(myOrder.item, 3)}>
              {statusRequest === "Rota entrega" ? "✅" : "🔲"}Rota de Entrega
            </DropdownItem>
            <DropdownItem onClick={() => upDateStateMyOrders(myOrder.item, 4)}>
              {statusRequest === "Retirada Loja" ? "✅" : "🔲"}Retirar na Loja
            </DropdownItem>
            <DropdownItem onClick={() => upDateStateMyOrders(myOrder.item, 6)}>
              {statusRequest === "Finalizado" ? "✅" : "🔲"}Finalizado
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  };

  function listMyOrders(status = typeStatusMyOrders.ACTIVE) {
    setIsloading(true);
    getOrders(status)
      .then((response) => {
        setMyOrders(response);
        dispatch({
          type: NEW_ORDERS,
          payload: response,
        });
        setIsloading(false);
      })
      .catch((error) => {
        alert("Opss!!! ocorreu algum erro na comunição com o servidor.");
      });
  }

  function goToDetailsMyOrders(order) {
    history.push({
      pathname: "DetailsMyOrder",
      state: order,
    });
  }

  function handleSelectStatus(value) {
    listMyOrders(value);
  }

  async function printCoupom(data) {
    const objectWithConfigPrint = {
      coupom: [data],
      sound: false,
      dialogMessage: true,
    };

    window.indexBridge.servicePrintCoupom(objectWithConfigPrint);
  }

  return (
    <>
      <div className="content">
        {isloading && (
          <div className="spinner">
            <Spinner color="light" />
          </div>
        )}
        <Row>
          <Col md="12">
            <Card style={{ minHeight: "88vh" }}>
              <CardHeader>
                <div className="SelectStatus">
                  <CardTitle tag="h5">🛒Meus Pedidos</CardTitle>
                  <div>
                    <Button>Telefone/Balcão</Button>
                    <Button onClick={() => history.push("tables")}>
                      Atendimento Mesa
                    </Button>
                  </div>
                  <select
                    name="statusOrder"
                    id="statusOrder"
                    onChange={(event) => handleSelectStatus(event.target.value)}
                  >
                    <option value={typeStatusMyOrders.ACTIVE}>
                      Em processo
                    </option>
                    <option value={typeStatusMyOrders.ALL}>Todos</option>
                    <option value={typeStatusMyOrders.EM_PREPARACAO}>
                      Preparado
                    </option>
                    <option value={typeStatusMyOrders.RETIRAR_LOJA}>
                      Retirar Loja
                    </option>
                    <option value={typeStatusMyOrders.ROTA_ENTREGA}>
                      Confirmar entrega
                    </option>
                    <option value={typeStatusMyOrders.FINALIZADO}>
                      Finalizado
                    </option>
                  </select>
                </div>
                {/* <div>
                  <Button onClick={() => history.push("pdv")}>
                    Pedido Balcão
                  </Button>
                </div> */}
              </CardHeader>
              <CardBody style={{ width: "100%" }}>
                <Table responsive style={{ border: "solid 1px #a9a9a9" }}>
                  <thead className="text-primary">
                    <tr>
                      <th>Tipo</th>
                      <th>Data</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th className="text-right">Valor</th>
                      <th>Telefone</th>
                      <th>Cidade</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={
                              item.deliveryType_id === 1
                                ? imgDelivery
                                : imgStore
                            }
                            alt={item.deliveryType}
                            className="imgTypeDelivery"
                          />
                        </td>
                        <td>{formatDateTime(item.dateTimeOrder)}</td>
                        <td
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                          onClick={() => goToDetailsMyOrders(item)}
                        >
                          {item.name}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                            className="text-center"
                          >
                            <div
                              className="statusMyOrders"
                              style={{
                                background: item.BGcolor,
                                marginRight: "8px",
                              }}
                            />

                            <span>{item.statusRequest}</span>
                          </div>
                        </td>
                        <td className="text-right">
                          <strong>{item.totalPurchase} </strong>
                          <img
                            src={item.image}
                            alt="icone"
                            title={item.payment}
                            style={{ width: "1.6rem" }}
                          />
                        </td>
                        <td>{item.phone}</td>
                        <td>
                          {item.city}/{item.uf}
                        </td>
                        <td className="text-center">
                          <div className="groupButton">
                            <Button
                              style={{ position: "relative" }}
                              size="sm"
                              onClick={() => printCoupom(item)}
                              title="Imprimir Cupom"
                            >
                              {item.print && (
                                <span
                                  title="Cupom já foi impresso"
                                  style={{
                                    position: "absolute",
                                    top: -6,
                                    left: -6,
                                  }}
                                >
                                  🟢
                                </span>
                              )}
                              <TfiPrinter />
                            </Button>

                            <Button
                              outline
                              size="sm"
                              onClick={() => goToDetailsMyOrders(item)}
                              title="detalhes"
                            >
                              <TfiTag />
                            </Button>

                            {item.statusRequest_id !== 6 && (
                              <MyDropdown item={item} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {myOrders.length <= 0 && (
                  <div className="imgOrderEmpty">
                    <img src={imgOrderEmpty} alt="empty" />
                    <h4>Aguardando novos pedidos</h4>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default MyOrders;
