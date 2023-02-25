import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import "./styles.css";

import { getSaleDay, getTop10 } from "../../hooks/Reports";
import { formatTime, formatDate, formatCurrency } from "../../hooks/format";
import { Graphic } from "../../components";

import imgTop10 from "../../assets/img/imgTop10.png";
import imgDelivery from "../../assets/img/imgDelivery.png";
import imgPayment from "../../assets/img/imgPayment.png";
import GraphicSaleWeek from "./GraphicSaleWeek";
import GraphicSaleYear from "./GraphicSaleYear";

const Dashboard = (props) => {
  const history = useHistory();
  const [saleDay, setSaleDay] = useState("");
  const [top10, setTop10] = useState(null);
  const { clientsOnline, clientsRegistered, newOrders } = useSelector(
    (state) => state.Notificate
  );

  useEffect(() => {
    (async () => {
      getSaleDay().then((respSaleDay) => {
        setSaleDay(respSaleDay.totalSaleDay);
        getTop10().then((respTop10) => setTop10(respTop10));
      });
    })();
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="3" xs="4">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="9" xs="8">
                    <div
                      style={{ cursor: "pointer" }}
                      className="numbers"
                      onClick={() => history.push("userClient")}
                    >
                      <p className="card-category">Cliente Inscritos</p>
                      <CardTitle tag="p">{clientsRegistered}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> 📅 {formatDate(new Date())}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="3" xs="4">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="9" xs="8">
                    <div className="numbers">
                      <p className="card-category">Receita dia</p>
                      <CardTitle tag="p">{formatCurrency(saleDay)}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" />
                  📅 {formatDate(new Date())}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="2" xs="3">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="10" xs="9">
                    <div className="numbers">
                      <p className="card-category">Pedidos Recebidos</p>
                      <CardTitle tag="p">{newOrders.length}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> 🕜 {formatTime(new Date())}
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="3" xs="4">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="9" xs="8">
                    <div className="numbers">
                      <p className="card-category">Online</p>
                      <CardTitle tag="p">{clientsOnline}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" />
                  📅 {formatDate(new Date())}
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <GraphicSaleWeek />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <GraphicSaleYear />
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="content-cardTitle">
                    <span>Top 10 clientes</span>
                    <img src={imgTop10} alt="icone usser" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="content-cardBody">
                  {top10 !== null &&
                    top10.top10Client.map((item, idx) => (
                      <div key={idx} className="itemTop10client">
                        <div className="itemCountClient">{idx + 1}</div>
                        <div className="itemClient">
                          <span>{item.name}</span>
                          {/* <span>{item.address}</span> */}
                        </div>
                        <div className="itemTotalPur">
                          <span>R$ {item.totalPur}</span>
                          <span>{item.amountOrder} pedidos</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardBody>
              <CardFooter>
                Ver mais <i className="fa fa-caret-right" />
              </CardFooter>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="content-cardTitle">
                    <span>Top 10 produtos</span>
                    <img src={imgTop10} alt="icone usser" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="content-cardBody">
                  <div className="itemTop10client">
                    <div className="itemCountClient">#</div>
                    <div className="itemClient">
                      <span>Produto</span>
                    </div>
                    <div className="itemTotalPur">
                      <span>Qtd</span>
                    </div>
                  </div>

                  {top10 !== null &&
                    top10.top10Product.map((item, idx) => (
                      <div key={idx} className="itemTop10client">
                        <div className="itemCountClient">{idx + 1}</div>
                        <div className="itemClient">
                          <span>{item.name}</span>
                        </div>
                        <div className="itemTotalPur">
                          <span>{item.amountProduct}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardBody>
              <CardFooter>
                Ver mais <i className="fa fa-caret-right" />
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="6">
            <Graphic
              title="Pagamentos"
              iconTitle={imgPayment}
              label={top10?.topPayDelivery.graphic.label}
              sourceData={top10?.topPayDelivery.graphic.data}
            />
          </Col>
          <Col md="6">
            <Graphic
              title="Tipo entrega"
              iconTitle={imgDelivery}
              label={top10?.topDelivery.graphic.label}
              sourceData={top10?.topDelivery.graphic.data}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
