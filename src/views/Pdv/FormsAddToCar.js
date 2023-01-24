import React, { useState, useEffect } from "react";
import { CardText, Button, FormGroup, Input } from "reactstrap";

import { getAdditional } from "../../hooks/TypeAdditional";
import ModalView from "../../components/ModalView";
import { formatCurrency } from "../../hooks/format";
import ShowAdditional from "./ShowAdditional";

export const FormsAddToCar = ({ open, product, toogle }) => {
  const [additional, setAdditional] = useState([]);
  const [titleAdditional, setTitleAdditional] = useState([]);

  useEffect(() => {
    const listAdditionalProduct = async () =>
      await getAdditional(product.additional).then((resp) => {
        setTitleAdditional([
          ...new Set(resp.map((item) => item.typeAdditional)),
        ]);
        setAdditional(resp);
      });

    listAdditionalProduct();
  }, [product.additional]);

  return (
    <ModalView
      size="lg"
      title={"🔖Seu Produto"}
      modal={open}
      toggle={() => toogle(!open)}
      confirmed={() => {}}
    >
      <HeaderProduct product={product} />

      <AmountProduct />

      {titleAdditional.map((title, idx) => (
        <ShowAdditional
          key={idx}
          title={title}
          additional={additional.filter(
            (elem) => elem.typeAdditional === title
          )}
          open={idx === 0 ? true : false}
          valueDefault={product.valueDefautAdditional.split(",").map(Number)}
        />
      ))}
      <NoteOrderProduct />
    </ModalView>
  );
};

const HeaderProduct = ({ product }) => {
  const priceProduct = product.promotion
    ? product.pricePromotion
    : product.price;

  return (
    <div className="container-header-add-to-car">
      <div className="content-image-product">
        <img className="avatar" src={product.image_url} alt="lanche" />
      </div>
      <div className="content-description-product">
        <CardText tag="h5">{product.name}</CardText>
        {product.promotion && (
          <span>De {formatCurrency(product.price)} por</span>
        )}
        <CardText tag="h5">{formatCurrency(priceProduct)}</CardText>

        <CardText tag="cite">{product.ingredient}</CardText>
      </div>
    </div>
  );
};

const AmountProduct = () => {
  return (
    <div className="content-amount-product">
      <div className="action-amount-product">
        <Button>-</Button>
        <Input value="1" />
        <Button>+</Button>
      </div>
    </div>
  );
};

const NoteOrderProduct = () => {
  return (
    <FormGroup>
      <Input
        type="textarea"
        name="noteOrderProduct"
        // value={formState.values.ingredient || ""}
        // onChange={(event) => handleChange(event)}
        placeholder="Observação do produto"
      />
    </FormGroup>
  );
};
