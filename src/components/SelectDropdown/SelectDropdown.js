import React from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async"; // https://react-select.com/async
import { BsThreeDotsVertical } from "react-icons/bs";

import "./styles.css";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

export const SelectDropdown = ({ options, onChange, placeholder, invalid }) => {
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

export const SelectSingle = ({
  options = [],
  isDisabled,
  isLoading = false,
  isClearable,
  isSearchable,
  defaultValue,
  onChange,
}) => {
  return (
    <Select
      className="basic-single"
      defaultValue={options[defaultValue]}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      onChange={(event) => onChange(event)}
      options={options}
    />
  );
};

export const MenuDropDown = ({
  data = [],
  color = "#007bff",
  isOpen,
  toogle,
  direction = "left",
}) => {
  return (
    data.length > 0 && (
      <Dropdown
        direction={direction}
        inNavbar={true}
        isOpen={isOpen}
        toggle={(e) => toogle(e)}
      >
        <DropdownToggle data-toggle="dropdown" tag="span">
          <BsThreeDotsVertical size={28} color={color} />
        </DropdownToggle>
        <DropdownMenu>
          {React.Children.toArray(
            data.map((item) => (
              <DropdownItem onClick={() => item.action(item.value)}>
                {item.title}
              </DropdownItem>
            ))
          )}
        </DropdownMenu>
      </Dropdown>
    )
  );
};

// const colourOptions = [
//   { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
//   { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
//   { value: "purple", label: "Purple", color: "#5243AA" },
//   { value: "red", label: "Red", color: "#FF5630", isFixed: true },
//   { value: "orange", label: "Orange", color: "#FF8B00" },
//   { value: "yellow", label: "Yellow", color: "#FFC400" },
//   { value: "green", label: "Green", color: "#36B37E" },
//   { value: "forest", label: "Forest", color: "#00875A" },
//   { value: "slate", label: "Slate", color: "#253858" },
//   { value: "silver", label: "Silver", color: "#666666" },
// ];
