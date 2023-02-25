import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import DefinitionPix from "./DefinitionPix";
import TypePayment from "./TypePayment";
import { getListPayments, updateActivePayment } from "../../hooks";
import OpeningHours from "./OpeningHours";

export default function DefinitionSystem() {
  const [selectedPayPix, setSelectedPayPix] = useState(null);
  const [listTypePayment, setListTypePayment] = useState([]);

  useEffect(() => {
    loadingListTypePay({ active: false, renew: false });
  }, []);

  // Carregar a lista de tipo de pagamento
  const loadingListTypePay = async (typeQuery) =>
    getListPayments(typeQuery).then((resp) => {
      setListTypePayment(resp);
      setSelectedPayPix(null);
    });

  // Selecionar tipo de pagamento
  const handleSelectedTypePayment = (typePayment) => {
    // Verificar se o tipo de pagamento não é PIX
    if (typePayment.type === "Pix") {
      // Setar os dados do pix
      setSelectedPayPix(typePayment);
    } else {
      setSelectedPayPix(null); //definir dados do pix como null
      // Se for outro tipo de pagamento ativa e desativa
      updateActivePayment(typePayment).then(() => {
        loadingListTypePay({ active: false, renew: true });
      });
    }
  };

  return (
    <div className="content">
      <OpeningHours />
      <Row>
        <Col md="6">
          <TypePayment
            listTypePayment={listTypePayment}
            selected={handleSelectedTypePayment}
          />
        </Col>
        <Col md="6">
          {selectedPayPix && (
            <DefinitionPix
              dataPix={selectedPayPix}
              loadingListTypePay={loadingListTypePay}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
