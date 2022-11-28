import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addDays, subDays, format } from "date-fns";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
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

import {
  getSaleDay,
  getSaleWeek,
  getSaleYear,
  getTop10,
} from "../../hooks/Reports";
import { formatTime, formatDate, formatCurrency } from "../../hooks/format";
import { Graphic } from "../../components";

import imgTop10 from "../../assets/img/imgTop10.png";
import imgDelivery from "../../assets/img/imgDelivery.png";
import imgPayment from "../../assets/img/imgPayment.png";

//data do computador
const date = new Date().toLocaleString();

const Dashboard = (props) => {
  const history = useHistory();
  const [saleDay, setSaleDay] = useState("");
  const [saleweek, setSaleWeek] = useState({});
  const [saleYear, setSaleYear] = useState([]);
  const [top10, setTop10] = useState(null);
  const { clientsOnline, clientsRegistered, newOrders } = useSelector(
    (state) => state.Notificate
  );

  useEffect(() => {
    (async () => {
      getSaleDay().then((respSaleDay) => {
        setSaleDay(respSaleDay.totalSaleDay);
        getSaleWeek().then((respSaleWeek) => {
          setSaleWeek(respSaleWeek);
          getSaleYear().then((respSaleYear) => {
            setSaleYear(respSaleYear);
            getTop10().then((respTop10) => setTop10(respTop10));
          });
        });
      });
    })();
  }, []);

  // Lista as venda Semana ATUAL
  const currentWeek = () => {
    getSaleWeek().then((response) => {
      setSaleWeek(response);
    });
  };
  // Lista as venda de semanas posteriores
  const incrementWeek = () => {
    const currentWeek = new Date(saleweek.interval?.from);
    const lastWeek = addDays(currentWeek, 7);
    const lastWeekFormated = format(lastWeek, "yyyy-M-d");

    getSaleWeek(lastWeekFormated).then((response) => {
      setSaleWeek(response);
    });
  };
  // Lista as venda de semanas anteriores
  const decrementWeek = async () => {
    const currentWeek = new Date(saleweek.interval?.from);
    const lastWeek = subDays(currentWeek, 7);
    const lastWeekFormated = format(lastWeek, "yyyy-M-d");

    getSaleWeek(lastWeekFormated).then((response) => {
      setSaleWeek(response);
    });
  };

  const chartSaleWeek = {
    data: (canvas) => {
      return {
        labels: [
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
          "Domingo",
        ],
        datasets: [
          {
            label: "Venda Diária",
            fill: true,
            borderColor: "#00bf55",
            backgroundColor: "#6bd098",
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 2,
            data: saleweek.data,
          },
        ],
      };
    },
    options: {
      legend: {
        display: true,
      },

      tooltips: {
        enabled: true,
      },

      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 20,
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "#ccc",
              color: "rgba(255,255,255,0.05)",
            },
          },
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(255,255,255,0.1)",
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f",
            },
          },
        ],
      },
    },
  };

  const chartSaleYear = {
    data: {
      labels: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      datasets: [
        {
          data: saleYear,
          fill: false,
          borderColor: "#fbc658",
          backgroundColor: "transparent",
          pointBorderColor: "#fbc658",
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 4,
        },
      ],
    },
    options: {
      legend: {
        display: false,
        position: "top",
      },
    },
  };

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
                  <i className="fas fa-sync-alt" /> {formatDate(new Date())}
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
                  <i className="far fa-calendar" /> {formatDate(new Date())}
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
                  <i className="far fa-clock" /> {formatTime(new Date())}
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
                  <i className="fas fa-sync-alt" /> {formatDate(new Date())}
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="headerWeek">
                <CardTitle tag="h5">
                  Vendas Semanal
                  {saleweek.interval && (
                    <p className="card-category">
                      Período: {formatDate(saleweek.interval?.from)} à{" "}
                      {formatDate(saleweek.interval?.to)}
                    </p>
                  )}
                </CardTitle>
                <div className="action">
                  <i
                    className=" nc-icon nc-minimal-left"
                    onClick={decrementWeek}
                  />
                  <i className="fa fa-ellipsis-h" onClick={currentWeek} />
                  <i
                    className=" nc-icon nc-minimal-right"
                    onClick={incrementWeek}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <Line
                  data={chartSaleWeek.data}
                  options={chartSaleWeek.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" />
                  {formatDate(new Date())}
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Vendas anuais</CardTitle>
                <p className="card-category">Totais vendas mês a mês.</p>
              </CardHeader>
              <CardBody>
                <Line
                  data={chartSaleYear.data}
                  options={chartSaleYear.options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-warning" />{" "}
                  {1900 + new Date().getYear()}
                </div>
                <hr />
                <div className="card-stats">
                  <i className="fa fa-check" /> Dados atualizados {date}
                </div>
              </CardFooter>
            </Card>
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
                          <span>{item.address}</span>
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
