import React from "react";
// reactstrap components
import { InputGroup, InputGroupText, InputGroupAddon, Input } from "reactstrap";

const SearchBar = ({ onChange }) => {
  const handleSearch = (event) => {
    event.preventDefault();
    onChange(event.target.value);
  };

  return (
    <>
      {/* Search  */}
      <InputGroup className="no-border">
        <Input
          placeholder="Pesquisar..."
          onChange={(event) => handleSearch(event)}
        />
        <InputGroupAddon addonType="append">
          <InputGroupText>
            <i className="nc-icon nc-zoom-split" />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

export default SearchBar;
