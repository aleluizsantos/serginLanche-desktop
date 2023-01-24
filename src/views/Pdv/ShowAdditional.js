import { useState } from "react";
import { Input, FormGroup, Label } from "reactstrap";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import { formatCurrency } from "../../hooks/format";

const ShowAdditional = ({ title, additional, open, valueDefault }) => {
  const [openAccordion, setOpenAccordion] = useState(open);

  return (
    <div className="content-additional-product">
      <div
        className="titleAdditional"
        onClick={() => setOpenAccordion(!openAccordion)}
      >
        <span className="title">{title}</span>
        {!openAccordion ? (
          <BsChevronDown size={26} />
        ) : (
          <BsChevronUp size={26} />
        )}
      </div>
      {additional.map((item, idx) => (
        <div
          key={idx}
          className="list-additional"
          style={{ display: openAccordion ? "" : "none" }}
        >
          <FormGroup>
            <Input
              name="additional"
              type="checkbox"
              checked={valueDefault.includes(item.id)}
            />
            <div className="descripton-additional">
              <Label for="additional" check>
                {item.description}
              </Label>
              <Label check>{formatCurrency(item.price)}</Label>
            </div>
          </FormGroup>
        </div>
      ))}
    </div>
  );
};

export default ShowAdditional;
