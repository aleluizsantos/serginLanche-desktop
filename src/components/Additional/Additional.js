import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";
// reactstrap components
import { Label } from "reactstrap";

import { getTypeAdditional } from "../../hooks";
import imgUniqueChoice from "../../assets/img/imgUniqueChoice.png";
import imgMultChoice from "../../assets/img/imgMultChoice.png";
import icoPlus from "../../assets/img/icoPlus.png";

const ItemAdditional = ({ item, selected, onClick }) => {
  const styleItemAdditional = selected.includes(item.id)
    ? "item-addidional selected"
    : "item-addidional";

  return (
    <div className={styleItemAdditional} onClick={() => onClick(item.id)}>
      <img
        src={item.manySelected ? imgMultChoice : imgUniqueChoice}
        alt="icone unique choice"
      />
      <span>{item.description}</span>
    </div>
  );
};

const Additional = ({ selected, onClick }) => {
  const history = useHistory();
  const [listAdditional, setListAdditional] = useState([]);

  useEffect(() => {
    getTypeAdditional().then((response) => setListAdditional(response));
  }, []);

  const ItemNewAdditional = () => {
    return (
      <div
        className="item-new-additional"
        onClick={() =>
          history.push({
            pathname: "categoryProduct",
            state: { showTypeAdditional: true },
          })
        }
      >
        <img src={icoPlus} alt="icone unique choice" />
      </div>
    );
  };

  return (
    <>
      <Label tag="h6">
        Selecione os itens de adicionais disponível para o produto.
      </Label>
      <div className="container">
        {listAdditional.map(
          (item, idx) =>
            item.typeAdditionVisible && (
              <ItemAdditional
                key={idx}
                item={item}
                selected={selected}
                onClick={onClick}
              />
            )
        )}
        <ItemNewAdditional />
      </div>
    </>
  );
};

export default Additional;
