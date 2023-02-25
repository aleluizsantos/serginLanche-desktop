import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// Lista as venda de semanas posteriores
import { addDays, subDays, format } from "date-fns";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// reactstrap components
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from "reactstrap";

import { getSaleWeek } from "../../../hooks/Reports";
import { formatDate } from "../../../hooks/format";

export default function GraphicSaleWeek() {
  const [saleweek, setSaleWeek] = useState({});
  const { user } = useSelector((state) => state.Authenticate);

  const isAdmin = user.typeUser === "admin";

  useEffect(() => {
    (async () => {
      isAdmin &&
        getSaleWeek().then((respSaleWeek) => {
          setSaleWeek(respSaleWeek);
        });
    })();
  }, []);

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
  // Lista as venda Semana ATUAL
  const currentWeek = () => {
    getSaleWeek().then((response) => {
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

  if (!isAdmin) return;

  return (
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
          <i className=" nc-icon nc-minimal-left" onClick={decrementWeek} />
          <i className="nc-icon nc-shop" onClick={currentWeek} />
          <i className=" nc-icon nc-minimal-right" onClick={incrementWeek} />
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
  );
}
