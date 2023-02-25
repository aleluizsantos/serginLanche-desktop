import React, { useEffect, useState, Children } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Form,
} from "reactstrap";
import { CustomInput, FormGroup, Input, Button } from "reactstrap";

import { getListAllHoursOpening, updateListHoursOpening } from "../../../hooks";

const typeFormHoursOpening = {
  isValid: false,
  errors: [],
  values: [],
};

export default function OpeningHours() {
  const [listHoursOpening, setListHoursOpening] =
    useState(typeFormHoursOpening);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    getListAllHoursOpening().then((resp) =>
      setListHoursOpening({ ...typeFormHoursOpening, values: resp })
    );
  };

  const hasError = (id) => {
    const error = listHoursOpening.errors.findIndex((item) => item.id === id);
    return error === 0 ? true : false;
  };

  // Atualizar a lista de horário de funcionamento
  const handleUpdateListHoursOpening = () => {
    updateListHoursOpening(listHoursOpening.values).then((resp) => {
      setListHoursOpening({
        ...listHoursOpening,
        isValid: false,
        errors: resp.errors,
      });
    });
  };

  // Atualização dos campos
  const handleChangeHours = (event, item) => {
    event.persist();
    let value = event.target.value === "" ? "00:00" : event.target.value;

    const changeListHours = listHoursOpening.values.map((hour) => {
      if (hour.id === item.id) {
        return {
          ...hour,
          [event.target.name]:
            event.target.type === "checkbox" ? event.target.checked : value,
        };
      }
      return hour;
    });
    setListHoursOpening({
      ...listHoursOpening,
      isValid: true,
      values: changeListHours,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5">Horário de Atendimento</CardTitle>
        <CardBody>
          <section id="transaction">
            <table id="data-table">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Aberto/Fechado</th>
                  <th>Horário</th>
                </tr>
              </thead>
              <tbody>
                {Children.toArray(
                  listHoursOpening.values.map((item) => (
                    <tr>
                      <td>{item.week}</td>
                      <td>
                        <FormGroup>
                          <CustomInput
                            id={`open${item.id}`}
                            name="open"
                            type="switch"
                            checked={item.open || false}
                            onChange={(event) => handleChangeHours(event, item)}
                          />
                        </FormGroup>
                      </td>
                      <td>
                        {!item.open ? (
                          <Form inline>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                              <Input
                                name="start"
                                type="time"
                                value={item.start || ""}
                                invalid={hasError(item.id)}
                                onChange={(event) =>
                                  handleChangeHours(event, item)
                                }
                              />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                              <Input
                                name="end"
                                type="time"
                                value={item.end || ""}
                                invalid={hasError(item.id)}
                                onChange={(event) =>
                                  handleChangeHours(event, item)
                                }
                              />
                            </FormGroup>
                          </Form>
                        ) : (
                          <span
                            style={{ fontWeight: "bold", color: "#8B0000" }}
                          >
                            Fechado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </CardBody>
        <CardFooter>
          {listHoursOpening.isValid && (
            <>
              <Button onClick={handleUpdateListHoursOpening} color="info">
                Salvar
              </Button>{" "}
              <Button onClick={fetchData} color="link">
                Cancelar
              </Button>
            </>
          )}
        </CardFooter>
      </CardHeader>
    </Card>
  );
}
