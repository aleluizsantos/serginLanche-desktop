import React, { useState } from "react";
import { useQRCode } from "react-qrcode";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Input,
  CustomInput,
  Label,
  FormGroup,
  Button,
} from "reactstrap";

import { updateTypePayment } from "../../../hooks";
import imgLogoPix from "../../../assets/img/logo-pix.png";
import "./styles.css";

export default function DefinitionPix({ dataPix, loadingListTypePay }) {
  const [keyPix, setKeyPix] = useState(dataPix?.key_pix || "");
  const [activePix, setActivePix] = useState(dataPix?.active || false);
  const urlQRcode = useQRCode(keyPix);

  const handleChangeKeyPix = (event) => {
    event.persist();
    const value = event.target.value;
    setActivePix(value === "" ? false : true);
    setKeyPix(value);
  };

  const handleChangeActivePix = (event) => {
    event.persist();
    if (keyPix !== "") setActivePix(event.target.checked);
  };

  const handleSaveDataPix = () => {
    const data = { ...dataPix, active: activePix, key_pix: keyPix };
    updateTypePayment(data).then(() =>
      loadingListTypePay({ active: false, renew: true })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5">
          <img src={dataPix?.image_url} alt="icone" /> Definir Pix
        </CardTitle>
      </CardHeader>
      <CardBody>
        <FormGroup>
          <CustomInput
            id="componet-active-key-pix"
            checked={activePix}
            onChange={handleChangeActivePix}
            type="switch"
            label="Ativar cobrança pix"
          />
        </FormGroup>

        <p>Para obter o QR Code da sua chave PIX</p>
        <p style={{ textAlign: "justify" }}>
          {" "}
          Abra o aplicativo do Banco no seu celular, faça login em sua conta,
          toque em "Pix" na tela inicial, clique em "Cobrar com QR Code", dê um
          nome para a cobrança não defina o valor da cobrança.
        </p>

        <div className="content-key-pix">
          <img
            src={urlQRcode}
            alt="QRcode"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = imgLogoPix;
            }}
          />
        </div>
        <FormGroup>
          <Label>Chave Pix</Label>
          <Input value={keyPix || ""} onChange={handleChangeKeyPix} />
        </FormGroup>
      </CardBody>
      <CardFooter>
        <Button onClick={handleSaveDataPix}>Definir</Button>
      </CardFooter>
    </Card>
  );
}
