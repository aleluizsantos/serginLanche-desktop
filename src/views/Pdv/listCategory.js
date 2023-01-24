import React, { useState, useEffect } from "react";

import { getCategory } from "../../hooks/Product";

export default function ListCategory({ onClick }) {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const listCategory = await getCategory();
      setCategory(listCategory);
    };

    fetchData();
  }, []);

  return (
    <div className="footer-category">
      <div className="content-category">
        {category.map((item, idx) => (
          <ItemCategoy onClick={() => onClick(item.id)} key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}

const ItemCategoy = ({ item, onClick }) => {
  return (
    <div className="item-category" onClick={onClick}>
      <img src={item.image_url} alt={item.name} />
      <span>{item.name}</span>
    </div>
  );
};
