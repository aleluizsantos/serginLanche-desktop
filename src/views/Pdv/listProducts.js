import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";

import { getProductCategory, getProductSearch } from "../../hooks/Product";
import { formatCurrency, debounceEvent } from "../../hooks";
import ListCategory from "./listCategory";
import { FormsAddToCar } from "./FormsAddToCar";

export default function ListProducts() {
  const [modalFormAddToCar, setModalFormAddToCar] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [search, setSearch] = useState([]);
  const [categorySelected, setCategorySelected] = useState(1);
  const [productSelected, setProductSelected] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const listProduct = await getProductCategory(categorySelected);
      setListProduct(listProduct.products);
      setSearch(listProduct.products);
    };

    categorySelected !== null && fetchData();
  }, [categorySelected]);

  const handleSearch = async (value) => {
    if (value === "") setSearch(listProduct);
    debounceEvent(async () => {
      // Fazer uma pesquisa na lista produtos ja carregados
      const searchProduct = listProduct.filter((elem) =>
        elem.name.toLowerCase().includes(value)
      );
      if (searchProduct.length === 0) {
        getProductSearch(value).then((resp) => {
          setListProduct([...listProduct, ...resp.products]);
          setSearch(resp.products);
        });
      }

      setSearch(searchProduct);
    });
  };

  const handleProductSelected = (product) => {
    setProductSelected(product);
    setModalFormAddToCar(true);
  };

  return (
    <div className="content-products">
      <SearchBar onChange={(event) => handleSearch(event)} />
      <div className="products">
        {search.map((item, idx) => (
          <ItemProduc key={idx} item={item} action={handleProductSelected} />
        ))}
      </div>
      <ListCategory onClick={setCategorySelected} />
      <FormsAddToCar
        toogle={setModalFormAddToCar}
        open={modalFormAddToCar}
        product={productSelected}
      />
    </div>
  );
}

const ItemProduc = ({ item, action }) => {
  return (
    <div className="item-product" onClick={() => action(item)}>
      <div className="price-products">
        <span className="title">{formatCurrency(item.price)}</span>
        {item.promotion && (
          <span
            style={{
              color: "#BE1919",
              marginTop: 6,
              background: "rgba(217, 217, 217, 0.7)",
              padding: 4,
            }}
          >
            PROMOÇÃO
          </span>
        )}
      </div>
      <div className="description">
        <span>{item.name} </span>
      </div>
      <img src={item.image_url} alt={item.name} />
    </div>
  );
};
