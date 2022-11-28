import React from "react";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ title, label, sourceData, iconTitle = "" }) => {
  const data = {
    labels: label,
    datasets: [
      {
        label: { title },
        data: sourceData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="content-cardTitle">
            <span>{title}</span>
            {iconTitle && <img src={iconTitle} alt="icone usser" />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Doughnut
          data={data}
          options={{
            cutoutPercentage: 50,
            rotation: 180,
            legend: {
              display: true,
              position: "right",
              labels: {
                fontSize: 16,
                fontColor: "#6D7278",
              },
            },
          }}
        />
      </CardBody>
    </Card>
  );
};

export default DoughnutChart;
