import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TfiTag, TfiPrinter, TfiControlForward } from "react-icons/tfi";
import { BsLayersFill, BsFillBasket2Fill } from "react-icons/bs";
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
  Label,
} from "reactstrap";

import "./styles.css";
import imgDelivery from "../../assets/img/delivery.png";
import imgStore from "../../assets/img/store.png";
import imgOrderEmpty from "../../assets/img/orderEmpty.png";
import imgTable from "../../assets/img/table.png";

import { formatDateTime } from "../../hooks/format";
import { getOrders, upDateStateMyOrders } from "../../hooks/MyOrders";
import { stageDelivery, typeDelivery } from "../../variables/types";
import { NEW_ORDERS } from "../../store/Actions/types";
import { MenuDropDown } from "../../components";

const MyOrders = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [myOrders, setMyOrders] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [menuStatus, setMenuStatus] = useState(false);
  const { update } = useSelector((state) => state.Notificate);

  useEffect(() => {
    (() => {
      listMyOrders();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const MyDropdown = (myOrder) => {
    const isFinally =
      myOrder.item.statusRequest_id === stageDelivery.FINALIZADO ? false : true;
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

  function listMyOrders(status = stageDelivery.ACTIVE) {
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

  const optionMenuStatus = [
    {
      title: "Em Processo",
      value: stageDelivery.ACTIVE,
      action: handleSelectStatus,
    },
    {
      title: "Todos",
      value: stageDelivery.ALL,
      action: handleSelectStatus,
    },
    {
      title: "Preparando",
      value: stageDelivery.EM_PREPARACAO,
      action: handleSelectStatus,
    },
    {
      title: "Retirar Loja",
      value: stageDelivery.RETIRAR_LOJA,
      action: handleSelectStatus,
    },
    {
      title: "Confirmado entrega",
      value: stageDelivery.ROTA_ENTREGA,
      action: handleSelectStatus,
    },
    {
      title: "Finalizado",
      value: stageDelivery.FINALIZADO,
      action: handleSelectStatus,
    },
  ];

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
                    <Button
                      id="btn-goto-salePhone"
                      onClick={() => history.push("salephone")}
                      className="btn-round btn-icon"
                      color="info"
                    >
                      <BsFillBasket2Fill size={24} color="#007bff" />
                    </Button>
                    <Label
                      style={{ paddingLeft: 5, paddingRight: 10 }}
                      for="btn-goto-salePhone"
                    >
                      Telefone/Balcão
                    </Label>

                    <Button
                      id="btn-goto-tables"
                      onClick={() => history.push("tables")}
                      className="btn-round btn-icon"
                      color="info"
                    >
                      <BsLayersFill size={22} color="#007bff" />
                    </Button>
                    <Label
                      style={{ paddingLeft: 5, paddingRight: 10 }}
                      for="btn-goto-tables"
                    >
                      Atendimento Mesa
                    </Label>
                  </div>
                  <MenuDropDown
                    isOpen={menuStatus}
                    toogle={() => setMenuStatus(!menuStatus)}
                    data={optionMenuStatus}
                  />
                </div>
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
                          {item.deliveryType_id === typeDelivery.TABLE && (
                            <span
                              style={{
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 20,
                                width: 20,
                                top: 5,
                                left: 5,
                                background: `rgba(24, 157, 14, 0.5)`,
                                boxShadow: `0px 2px 2px rgba(0, 0, 0, 0.25)`,
                                fontWeight: "bold",
                                color: "#fff",
                                padding: 8,
                                fontSize: "0.6rem",
                                borderRadius: 15,
                              }}
                            >
                              {item.table_id}
                            </span>
                          )}
                          <img
                            src={imgHeader(item.deliveryType_id)}
                            alt={item.deliveryType}
                            className="type delivery"
                          />
                        </td>
                        <td>{formatDateTime(item.dateTimeOrder)}</td>
                        <td
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                          onClick={() => goToDetailsMyOrders(item)}
                        >
                          {item.name_client}
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
                    <h4>Aguardando pedidos</h4>
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
