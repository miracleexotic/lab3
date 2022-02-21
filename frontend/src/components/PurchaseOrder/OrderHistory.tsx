import React, { useEffect, useState, Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import { Theme, makeStyles, createStyles } from "@material-ui/core";

import { PurchaseOrdersInterface,
  PurchaseOrderItemsInterface,  } from "../../models/IPurchaseOrder";
import { UsersInterface } from "../../models/ISignIn";

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: { flexGrow: 1 },
    container: { marginTop: theme.spacing(2) },
    paper: { 
      padding: theme.spacing(3),
    },
    orderItem: { padding: theme.spacing(3), marginBottom: theme.spacing(2) },
    tableHead: {
      "& .MuiTableCell-head": {
        color: "white",
        backgroundColor: "navy"
      },
    },
  })
);

export interface OrderListProps {
  order: PurchaseOrdersInterface;
}

function ListOrderItems(ord: OrderListProps) {
  const classes = useStyles();
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Typography gutterBottom>
            <b>วันที่สั่งซื้อ:</b> {moment(ord.order.OrderTime).format("YYYY MMMM DD - HH:mm:ss")}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell width="15%" align="center"><b>ชื่อสินค้า</b></TableCell>
              <TableCell width="5%" align="center"><b>ราคาต่อหน่วย</b></TableCell>
              <TableCell width="5%" align="center"><b>จำนวน</b></TableCell>
              <TableCell width="5%" align="center"><b>รวมทั้งหมด</b></TableCell>
            </TableRow>
          </TableHead>
          {ord.order.OrderItems.map((item: PurchaseOrderItemsInterface, index) => (
            <TableBody key={index}>
              <TableRow>
                <TableCell width="15%" align="left">{item.Productstock.Product.Name}</TableCell>
                <TableCell width="5%" align="center">{item.ItemPrice.toLocaleString('th-TH', { style: "currency", currency: "THB" })}</TableCell>
                <TableCell width="5%" align="center">{item.OrderAmount}</TableCell>
                <TableCell width="5%" align="center">{(item.OrderAmount * item.ItemPrice).toLocaleString('th-TH', { style: "currency", currency: "THB" })}</TableCell>
              </TableRow>
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </Fragment>
  );
}

function ListOrderDetails(ord: OrderListProps) {
  const [open, setOpen] = useState(false);
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="subtitle2" style={{fontWeight: "bold"}}>
          ราคาสินค้า
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" align="right">
          {ord.order.OrderTotalPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" style={{fontWeight: "bold"}}>
          ส่วนลดจากโปรโมชั่น
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" align="right" style={{ color: "red"}}>
          {ord.order.OrderDiscount === 0 ? "" : "-"}{ord.order.OrderDiscount.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" style={{fontWeight: "bold"}}>
          รวมทั้งหมด
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" align="right">
          {(ord.order.OrderTotalPrice - ord.order.OrderDiscount).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" style={{fontWeight: "bold"}}>
          วิธีการชำระเงิน
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" align="right">
          {ord.order.PaymentMethod.MethodName}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" style={{fontWeight: "bold", marginTop: ".25rem"}}>
          ที่อยู่การสั่งซื้อ
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Button onClick={() => {setOpen(open => !open)}} size="small" style={{float: "right"}}>
          {open ? (
            <Typography variant="subtitle2">
              [ ซ่อน ]
            </Typography>
          ) : (
            <Typography variant="subtitle2">
              [ แสดง ]
            </Typography>
          )}
        </Button>
      </Grid>
      {open && (
        <Grid item xs={12}>
          <Paper variant="outlined" style={{ padding: ".5rem" }}>
            <Typography variant="subtitle2" noWrap>
              {ord.order.DeliveryAddress}
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}

export default function OrderHistory() {
  const classes = useStyles();

  const [orders, setOrders] = useState<PurchaseOrdersInterface[]>([]);

  useEffect(() => {
    const user: UsersInterface = JSON.parse(localStorage.getItem("user") || "");
  
    const getOrders = async() => {
      const apiUrl = `http://localhost:8080/order-history/${user?.ID}`;
      const requestOptions = {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json", 
        },
      }
  
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setOrders(res.data);
          } else {
            console.log("else");
          }
        });
    }

    getOrders();
  }, []);
  
  console.log("history orders: ", orders);
  
  return (
    <div>
      <Container className={classes.container}>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            <Grid item xs={8} style={{ paddingBottom: "1rem" }}>
              <Typography component="h4" variant="h5" color="primary">
                ประวัติการชำระสินค้า
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ paddingBottom: "1rem" }}>
              <Button 
                color="primary" 
                variant="contained" 
                style={{float: "right"}}
                component={RouterLink}
                to="/member/order"
              >
                ชำระสินค้า
              </Button>
            </Grid>
            <Grid item xs={12}>
              {orders.length !== 0 ? (
                orders.map((row: PurchaseOrdersInterface, index) => (
                  <Fragment key={index}>
                    <Grid container>
                      <Grid item xs={8}>              
                        <Paper className={classes.orderItem} style={{ marginRight: "1rem"}} elevation={1}>
                          <ListOrderItems order={row} />
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper className={classes.orderItem} elevation={1}>
                          <ListOrderDetails order={row} />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Fragment>
                ))
              ) : (
                <Paper className={classes.paper}>
                  <Box textAlign="center">
                    <Typography component="h4" variant="h6">
                      ไม่พบรายการ
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}