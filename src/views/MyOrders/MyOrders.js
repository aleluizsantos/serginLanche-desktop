import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TfiTag, TfiPrinter } from "react-icons/tfi";
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
} from "reactstrap";

import "./styles.css";
import imgDelivery from "../../assets/img/delivery.png";
import imgStore from "../../assets/img/store.png";
import imgOrderEmpty from "../../assets/img/orderEmpty.png";

import { formatDateTime } from "../../hooks/format";
import { getOrders, typeStatusMyOrders } from "../../hooks/MyOrders";
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
            <Card>
              <CardHeader>
                <div className="SelectStatus">
                  <CardTitle tag="h5">Meus Pedidos</CardTitle>
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
              </CardHeader>
              <CardBody>
                <Table responsive>
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
                        <td className="text-right">{item.totalPurchase}</td>
                        <td>{item.phone}</td>
                        <td>
                          {item.city}/{item.uf}
                        </td>
                        <td className="text-center">
                          <div className="groupButton">
                            <Button
                              className="btn-icon"
                              outline
                              color="default"
                              size="sm"
                              onClick={() => printCoupom(item)}
                              title="Imprimir Cupom"
                            >
                              <TfiPrinter />
                            </Button>
                            <Button
                              className="btn-icon"
                              color="default"
                              outline
                              size="sm"
                              onClick={() => goToDetailsMyOrders(item)}
                              title="detalhes"
                            >
                              <TfiTag />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {myOrders.length <= 0 && (
                  <div className="imgOrderEmpty">
                    <img src={imgOrderEmpty} alt="empty" />
                    <h3>Aguardando novos pedidos</h3>
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
