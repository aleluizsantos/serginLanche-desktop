import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// reactstrap components
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from "reactstrap";

import { getSaleYear } from "../../../hooks/Reports";

// Somente usuário com perfil de administrador poderá exibir a tela
export default function GraphicSaleYear() {
  const [saleYear, setSaleYear] = useState([]);
  const { user } = useSelector((state) => state.Authenticate);

  const isAdmin = user.typeUser === "admin";

  useEffect(() => {
    (async () => {
      isAdmin &&
        getSaleYear().then((respSaleYear) => {
          setSaleYear(respSaleYear);
        });
    })();
  }, [isAdmin]);

  //data do computador
  const date = new Date().toLocaleString();

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

  if (!isAdmin) return;

  return (
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
  );
}
