import React, { Children } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { BsDashCircleDotted, BsCheck2Circle } from "react-icons/bs";

export default function TypePayment({ listTypePayment, selected }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5">Tipos de pagamentos</CardTitle>
        <CardBody>
          <section id="transaction">
            <table id="data-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th align="left">Status</th>
                </tr>
              </thead>
              <tbody>
                {Children.toArray(
                  listTypePayment.map((item) => (
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => selected(item)}
                    >
                      <td>
                        <img
                          style={{ height: 25 }}
                          src={item.image_url}
                          alt="icone"
                        />{" "}
                        {item.type}
                      </td>
                      <td align="left">
                        {item.active ? (
                          <>
                            <BsCheck2Circle size={22} color="green" />
                            <span> Ativo</span>
                          </>
                        ) : (
                          <BsDashCircleDotted size={22} color="red" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </CardBody>
      </CardHeader>
    </Card>
  );
}
