import React from "react";
import { formatDateTime, formatCurrency } from "../../hooks/format";

const Commads = ({ commad, ...rest }) => {
  return (
    <div {...rest} className="content-commads">
      <div className="commads-title">
        <span>#{commad.id_commads}</span>
        <span>🕑 {formatDateTime(commad.created_at)}</span>
      </div>
      <div className="commads-client">
        <span>{commad.name_client}</span>
        <span>{formatCurrency(commad.totalValueToOrder)}</span>
      </div>
    </div>
  );
};

export default Commads;
