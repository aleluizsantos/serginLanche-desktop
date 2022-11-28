import React from "react";
import AsyncSelect from "react-select/async";

const SelectDropdown = ({ options, onChange, placeholder, invalid }) => {
  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(options(inputValue));
    });

  const customStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: state.isFocused ? "0 0 0 0.15rem rgba(218,165,32, 0.5)" : 0,
      borderColor: invalid ? "#DC3545" : "#DDDDDD",
    }),
  };

  return (
    <AsyncSelect
      styles={customStyles}
      placeholder={placeholder}
      onChange={(event) => onChange(event)}
      cacheOptions
      loadOptions={promiseOptions}
      defaultOptions
    />
  );
};

export default SelectDropdown;
