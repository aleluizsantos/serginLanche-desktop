import React, { useEffect, useState } from "react";
import { FormGroup, Input } from "reactstrap";
import { useQRCode } from "react-qrcode";
import { BsTrash } from "react-icons/bs";

import { formatCurrency, formatDateTime, getListPayments } from "../../hooks";
import ModalView from "../../components/ModalView";

import "./styles.css";

/**
 * Modal de Pagamento
 * @param {object} Object parametro de funcionalidade
 * @returns JSX Modal
 */
const ModalPayments = ({ dataCommad, open, toogle, makePayment }) => {
  const { commad } = dataCommad;
  const [listPayment, setListPayment] = useState([]);
  const [selectedPayment, setPaymentSelected] = useState("");
  const [cash, setCash] = useState(0);
  const [thing, setThing] = useState(0);

  const dataUrl = useQRCode(selectedPayment?.key_pix || "");

  useEffect(() => {
    const fetchData = async () =>
      await getListPayments().then((resp) => setListPayment(resp));
    fetchData();
  }, []);

  // Fechar o modal cancelando, não fazendo nenhuma alteração
  const handleCancel = () => {
    setPaymentSelected("");
    toogle(!open);
  };

  // Excluir da lista o tipo de pagamento selecionado
  const handleDeletePaymentSelected = () => {
    setPaymentSelected("");
    setCash(0);
    setThing(0);
  };

  // Capturar o valor digitado no formulário do troco
  // após calcular o valor do troco
  const handleCast = (event) => {
    const valueCast = Number(event.target.value);
    const isNumber = isNaN(event.target.value);
    if (!isNumber) {
      setCash(event.target.value);
      const valueTring = valueCast - Number(commad.totalValueToOrder);
      setThing(valueTring);
    }
  };

  // Gravar o tipo de pagamento selecionado
  const handleMakePayment = async () => {
    if (selectedPayment) {
      await makePayment(
        commad.id_commads,
        commad.tokenOperation,
        selectedPayment.id,
        cash
      );
      toogle(false);
      setPaymentSelected("");
    } else {
      alert("💰 Selecione um tipo de pagamento");
    }
  };

  return (
    <ModalView
      size="md"
      title={"💰Pagamento"}
      modal={open}
      toggle={handleCancel}
      confirmed={handleMakePayment}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Mesa: {commad.table_id}</span>
        <span>Comanda: {commad.id_commads}</span>
        <span>🕓 {formatDateTime(commad.created_at)}</span>
      </div>

      <h4>{commad.name_client}</h4>
      <h6>Selecione tipo de pagamento</h6>
      {selectedPayment ? (
        <div className="content-type-payment-selected">
          <img src={selectedPayment.image_url} alt={selectedPayment.type} />
          <span>{selectedPayment.type}</span>
          <BsTrash
            size={18}
            className="trash"
            color="red"
            onClick={handleDeletePaymentSelected}
          />
          {selectedPayment.id === 1 && (
            <div className="value-cast">
              <FormGroup>
                <Input
                  autoFocus={true}
                  value={cash || ""}
                  onChange={(event) => handleCast(event)}
                />
              </FormGroup>
              <span>Troco: {formatCurrency(thing)}</span>
            </div>
          )}

          {selectedPayment.key_pix && (
            <div className="content-image-pix">
              <img src={dataUrl} alt="pix" />
            </div>
          )}
        </div>
      ) : (
        listPayment.map((item, idx) => (
          <ul key={idx} className="content-type-payment">
            <li onClick={() => setPaymentSelected(item)}>
              <img src={item.image_url} alt={item.type} />
              <span>{item.type}</span>
            </li>
          </ul>
        ))
      )}
      <div className="footer-value-total-order">
        <span>TOTAL:</span>{" "}
        <span>{formatCurrency(commad.totalValueToOrder)}</span>
      </div>
    </ModalView>
  );
};

export default ModalPayments;
