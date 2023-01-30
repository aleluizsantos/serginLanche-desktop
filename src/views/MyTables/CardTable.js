import React from "react";

import "./styles.css";

const CardTable = ({ table, ...rest }) => {
  return (
    <div {...rest} className="cardTable">
      <div className="badgesTable">
        <span>{table.amount}</span>
      </div>
      <div className="content-table">
        <div
          className="imageTable"
          style={{ filter: table.busy && "grayscale(2)" }}
        >
          <span>Mesa {table.id}</span>
        </div>
        <div
          className="statusTable"
          style={{
            background: table.busy ? "#FFA4A4" : "#A0EE85",
          }}
        >
          <span>{table.busy ? "Ocupado" : "Liberado"}</span>
        </div>
      </div>
    </div>
  );
};

export default CardTable;
