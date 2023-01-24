import React from "react";
import { Button } from "reactstrap";

import "./styles.css";
import ConfigSystem from "../ConfigSystem";
import FormTaxaDelivery from "./formTaxaDelivery";
import AutoOpenCloseSetting from "./autoOpenClose";

const Setting = ({ open, onChange }) => {
  const width = open ? 280 : 0;

  return (
    <div className="containerSetting" style={{ width: width }}>
      <div className="headerSetting">
        <span>Configurações</span>
        <Button close onClick={onChange} />
      </div>
      <div className="bodySetting">
        <AutoOpenCloseSetting />
        <FormTaxaDelivery />
        <ConfigSystem />
      </div>
    </div>
  );
};

export default Setting;
