import React, { useState } from "react";
import { FormGroup, Input } from "reactstrap";

import ModalView from "../../components/ModalView";
import ShowAdditional from "./ShowAdditional";

export const FormsAddToCar = ({ open, product, toogle, addProductCar }) => {
  const [selectedAdditional, setSelectedAdditional] = useState([]);
  const [amountProduct, setAmountProduct] = useState(1);
  const [sumTotalProduct, setSumTotalProduct] = useState(0);
  const [noteItem, setNoteItem] = useState("");

  // Recebe com parametros os adicionais escolhidos
  // a soma total e a quantidade escolhida e grava no state
  const handleSelectedAdditional = (
    additional,
    amount = 1,
    sumTotalProductMoreAdditional = 0
  ) => {
    setSelectedAdditional(additional);
    setSumTotalProduct(sumTotalProductMoreAdditional);
    setAmountProduct(amount);
  };

  const addCar = () => {
    const itemProduct = {
      amount: amountProduct,
      product: product,
      price: product.promotion ? product.pricePromotion : product.price,
      note: noteItem,
      additionItem: selectedAdditional.map((item) => item.id).join(","),
      listAdditional: selectedAdditional,
      sumTotalProduct: sumTotalProduct,
    };
    setNoteItem("");
    addProductCar(itemProduct);
    toogle(!open);
  };

  return (
    <ModalView
      size="lg"
      title={"🔖Seu Produto"}
      modal={open}
      toggle={() => toogle(!open)}
      confirmed={addCar}
    >
      <ShowAdditional
        product={product}
        changerAdditional={handleSelectedAdditional}
      />

      <FormGroup>
        <Input
          type="textarea"
          name="noteOrderProduct"
          maxLength={256}
          value={noteItem || ""}
          onChange={(e) => setNoteItem(e.target.value)}
          placeholder="Observação do produto"
        />
      </FormGroup>
    </ModalView>
  );
};
