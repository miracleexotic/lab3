import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { EmployeesInterface } from "../../models/IUser";
import {
  ShelfstoresInterface,
  ProductsInterface,
  ProductstocksInterface,
  TypeproductsInterface,
} from "../../models/IProductstock";
import { format } from "date-fns";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  containner: {
    marginTop: 25,
  },
});

export default function Productstock() {
  const classes = useStyles();
  const [Productstock, setProductstock] = useState<ProductstocksInterface[]>(
    []
  );

  const getProductstock = async () => {
    const apiUrl = "http://localhost:8080/productstock";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setProductstock(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getProductstock();
  }, []);
  console.log(Productstock);
  return (
    <Container maxWidth="md" className={classes.containner}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ backgroundColor: "#0276aa", color: "#ffffff" }}
              >
                Name
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#0276aa", color: "#ffffff" }}
              >
                Amount
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#0276aa", color: "#ffffff" }}
              >
                Date-Time update
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#0276aa", color: "#ffffff" }}
              >
                Detail
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#0276aa", color: "#ffffff" }}
              >
                Type
              </TableCell>
              <TableCell
                align="right"
                style={{ backgroundColor: "#0276aa", color: "#ffffff" }}
              >
                Unit Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Productstock.map((item: ProductstocksInterface) => (
              <TableRow key={item.ID}>
                <TableCell component="th" scope="item">
                  {item.Product.Name}
                </TableCell>
                <TableCell align="right">{item.Amount_remain}</TableCell>
                <TableCell align="right">
                  {format(
                    new Date(item.Update_datetime),
                    "dd MMMM yyyy hh:mm a"
                  )}
                </TableCell>
                <TableCell align="right">{item.Detail}</TableCell>
                <TableCell align="right">
                  {item.Product.Typeproduct.Name}
                </TableCell>
                <TableCell align="right">{item.Product.Price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
