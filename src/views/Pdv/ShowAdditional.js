import { useState, useEffect } from "react";

import { CardText, Button, Input } from "reactstrap";
import { getAdditional, formatCurrency } from "../../hooks";
import { ItemsAdditional } from "./ItemsAdditional";

const ShowAdditional = ({ product, changerAdditional }) => {
  const [titles, setTitles] = useState([]);
  const [listAllAdditionalProduct, setListAllAdditionalProduct] = useState([]);
  const [selectedAdditional, setSelectedAdditional] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [amountProduct, setAmountProduct] = useState(1);

  useEffect(() => {
    const listAdditionalProduct = async () =>
      // Realizar chamada api para buscar todos os tipos
      // de adicionais do produto
      await getAdditional(product.additional).then((resp) => {
        // Quais são os adicionais padrões
        const additDefault =
          product.valueDefautAdditional &&
          product.valueDefautAdditional.split(",").map(Number);
        // Salvar no state os adicionais padrão como um objeto
        const filterAddicionaisDefault = resp.filter((item) =>
          additDefault.includes(item.id)
        );
        // Preço inicial do produto
        const price = product.promotion
          ? product.pricePromotion
          : product.price;
        // Atualiza o componete pai adicionais padrões
        changerAdditional(filterAddicionaisDefault, 1, Number(price));
        // Adicionar na lista dos adicionais os item padrão do produto
        setSelectedAdditional(filterAddicionaisDefault);
        // Adicinar todos os tipos de adicionais possível do produto
        setListAllAdditionalProduct(resp);
        // Separar os Tipos de adicionais colocando como Titulo
        setTitles([...new Set(resp.map((item) => item.typeAdditional))]);
      });

    // Excecutar a função
    listAdditionalProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Seleciona o adicionar para passar para o componete pai
  // e guarda também no state
  const handleSelectedAdditional = (itemSelected) => {
    setSelectedAdditional(itemSelected);
    handleSumTotalProductMoreAdditional(itemSelected, amountProduct);
  };

  // Somar o valor do produto com os adicionais e multiplica pela
  // quantidade que o cliente escolher
  const handleSumTotalProductMoreAdditional = (itemSelected, amount = 1) => {
    const valueProduct = product.promotion
      ? Number(product.pricePromotion)
      : Number(product.price);

    const sumTotalAdditional = itemSelected.reduce((total, item) => {
      return total + parseFloat(item.price);
    }, 0);

    const sumTotal = (valueProduct + sumTotalAdditional) * amount;
    // Atualizar o state do componete com o novo valor
    setCurrentProduct({
      ...currentProduct,
      price: sumTotal,
      pricePromotion: sumTotal,
    });
    changerAdditional(itemSelected, amount, sumTotal);
    return sumTotal;
  };

  const handleAmountProduct = (event) => {
    let amount = Number(amountProduct);
    const value = event.target.innerText;

    value === "+" ? (amount += 1) : (amount -= 1);
    if (amount > 0) {
      setAmountProduct(amount);
      handleSumTotalProductMoreAdditional(selectedAdditional, amount);
    }
  };

  return (
    <>
      <div className="container-header-add-to-car">
        <div className="content-image-product">
          <img className="avatar" src={currentProduct.image_url} alt="lanche" />
        </div>
        <div className="content-description-product">
          <CardText tag="h4">{currentProduct.name}</CardText>
          {currentProduct.promotion && (
            <span>De {formatCurrency(product.price)} por</span>
          )}
          <CardText tag="h5">
            {formatCurrency(
              currentProduct.promotion
                ? currentProduct.pricePromotion
                : currentProduct.price
            )}
          </CardText>

          <CardText tag="cite">{currentProduct.ingredient}</CardText>
        </div>
      </div>

      <div className="content-amount-product">
        <div className="action-amount-product">
          <Button onClick={(e) => handleAmountProduct(e)}>-</Button>
          <Input
            value={amountProduct || 1}
            type="number"
            onChange={(e) => setAmountProduct(e.target.value)}
            onBlur={(e) =>
              handleSumTotalProductMoreAdditional(
                selectedAdditional,
                e.target.value
              )
            }
          />
          <Button onClick={(e) => handleAmountProduct(e)}>+</Button>
        </div>
      </div>

      <div className="content-additional-product">
        {titles.map((title, idx) => (
          <ItemsAdditional
            key={idx}
            id={idx}
            title={title}
            allAdditionalProduct={listAllAdditionalProduct}
            selectedAdditionalDefault={selectedAdditional}
            changeAdditional={handleSelectedAdditional}
          />
        ))}
      </div>
    </>
  );
};

export default ShowAdditional;
