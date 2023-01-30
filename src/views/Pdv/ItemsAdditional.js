import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Input, FormGroup, Label } from "reactstrap";

import { formatCurrency } from "../../hooks";

export const ItemsAdditional = ({
  id,
  title,
  allAdditionalProduct,
  selectedAdditionalDefault,
  changeAdditional,
}) => {
  const [openChev, setOpenChev] = useState(id === 0 ? true : false);
  const [selectedAdditional, setSelectedAdditional] = useState(
    selectedAdditionalDefault
  );

  // Separar os adicionais pertencente ao tipo passado
  const filterAdditional = allAdditionalProduct.filter(
    (elem) => elem.typeAdditional === title
  );

  // Selecionar os adicionais
  const handleSelectedAdditional = (itemSelected) => {
    // Verificar se pode escolhar mais de um item
    if (itemSelected.manySelected) {
      // Verificar se já foi escolhido
      existElement(itemSelected.id)
        ? removeElement(itemSelected.id)
        : addElement(itemSelected);
    } else {
      if (!existElement(itemSelected.id)) {
        const removeAlltypeunique = selectedAdditional.filter(
          (item) => item.manySelected !== itemSelected.manySelected
        );
        setSelectedAdditional([...removeAlltypeunique, itemSelected]);
        changeAdditional([...removeAlltypeunique, itemSelected]);
      }
    }
  };

  // Verifica se o adicional já foi escolhido
  const existElement = (id) => {
    return selectedAdditional.findIndex((item) => item.id === id) >= 0
      ? true
      : false;
  };

  // Remove o adicional da lista escolhida
  const removeElement = (idItem) => {
    const removeSelectedAdditional = selectedAdditional.filter(
      (item) => item.id !== idItem
    );
    setSelectedAdditional(removeSelectedAdditional);
    changeAdditional(removeSelectedAdditional);
  };

  // Crescente o adicional na lista escolhida
  const addElement = (item) => {
    const additionalAdd = [...selectedAdditional, item];
    setSelectedAdditional(additionalAdd);
    changeAdditional(additionalAdd);
  };

  return (
    <div>
      <div onClick={() => setOpenChev(!openChev)} className="titleAdditional">
        <span className="title">{title}</span>
        {openChev ? <BsChevronUp size={16} /> : <BsChevronDown size={16} />}
      </div>

      <div className="list-additional">
        {openChev &&
          filterAdditional.map((item, idx) => (
            <FormGroup key={idx}>
              <Input
                name="additional"
                type="checkbox"
                checked={existElement(item.id)}
                onChange={() => handleSelectedAdditional(item)}
              />
              <div className="descripton-additional">
                <Label for="additional" check>
                  {item.description}
                </Label>
                <Label check>{formatCurrency(item.price)}</Label>
              </div>
            </FormGroup>
          ))}
      </div>
    </div>
  );
};
