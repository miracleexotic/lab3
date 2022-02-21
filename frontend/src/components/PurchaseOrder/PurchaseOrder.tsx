import React, {
  useState,
  useEffect,
  ChangeEvent,
  Fragment,
  SetStateAction,
  Dispatch,
} from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { createStyles, Theme, makeStyles, IconButton } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { ManagePromotionsInterface } from "../../models/IManagePromotion";
import { ProductstocksInterface } from "../../models/IProductstock";
import {
  PaymentMethodsInterface,
  PurchaseOrdersInterface, PurchaseOrderItemsInterface
} from "../../models/IPurchaseOrder";

import { UsersInterface } from "../../models/ISignIn";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { flexGrow: 1 },
    container: { marginTop: theme.spacing(2) },
    paper: {
      padding: theme.spacing(3),
    },
    tableContainer: { maxHeight: 480 },
    tableHead: {
      "& .MuiTableCell-head": {
        color: "white",
        backgroundColor: "navy",
      },
    },
    typoHeader: {
      fontWeight: "bold"
    },
    tableCellNormal: {
      color: "green",
    },
    tableCellDisabled: {
      color: "gray",
    }
  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export interface ListPromotionsProps {
  promotions: ManagePromotionsInterface[];
  order: Partial<PurchaseOrdersInterface>;
  setOrder: Dispatch<SetStateAction<Partial<PurchaseOrdersInterface>>>;
}

function ListPromotions(props: ListPromotionsProps) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [promotions, setPromotions] = useState<ManagePromotionsInterface[]>([]);
  const [order, setOrder] = useState<Partial<PurchaseOrdersInterface>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const handleClickOpen = () => {
    setOpenDialog(true);
    setPromotions(props.promotions);
    // setOrder(props.order);
  }
  const handleCloseDialog = () => {
    setOpenDialog(false);
    props.setOrder({ ...order, PromotionID: selected.length === 1 ? selected[0] : 0 });
  }
  const handleClickCell = (event: React.MouseEvent<unknown>, PromotionID: number) => {
    // If promotionMinPrice is lower than TotalPrice, it cannot checked!
    if (!checkMinPrice(promotions.find(p => p.ID === PromotionID)?.MinPrice || 0))
      return;

    const selectedIndex = selected.indexOf(PromotionID)
    let newSelected: number[] = [];
    if (selectedIndex === -1 && selected.length === 0) {
      newSelected = newSelected.concat(selected, PromotionID);
    }
    else if (selectedIndex === 0 && selected.length === 1) {
      newSelected = newSelected.concat(selected.slice(1));
    }
    else if (selectedIndex === -1 && selected.length === 1) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelected.push(PromotionID);
    }

    setSelected(newSelected);
  }
  const isSelected = (PromotionID: number) => selected.indexOf(PromotionID) !== -1;
  const checkMinPrice = (promotionMinPrice: number) => Number(order.OrderTotalPrice) >= promotionMinPrice ? true : false;
  const checkCellColorWithMinPrice = (promotionMinPrice: number) => {
    if (checkMinPrice(promotionMinPrice))
      return classes.tableCellNormal;
    return classes.tableCellDisabled;
  }

  // set variable order inside ListPromotions()
  useEffect(() => {
    setOrder(order => {
      return {...order, ...props.order};
    })
  }, [props.order]);
  // set OrderDiscount when PromotionID is changing
  useEffect(() => {
    const subPromotionDiscount = (PromotionID: number | undefined) => {
      let discount = 0;
      if (PromotionID !== 0) {
        discount = promotions.find(p => p.ID === PromotionID)?.Discount || 0;
        return discount;
      }
      return discount;
    }
    setOrder(order => {
      return {
        ...order,
        OrderDiscount: subPromotionDiscount(selected[0] ? selected[0] : 0),
      }
    });
  }, [selected, promotions]);
  // when OrderTotalPrice is less then promotionMinPrice, it will be reset var selected to empty array.
  useEffect(() => {
    setSelected(selected => {
      if (Number(props.order.PromotionID === 0))
        return [];
      else
        return [...selected];
    });
  }, [props.order.PromotionID]);

  // console.log("props.order from main", props.order);
  // console.log("props.order inside", order);
  // console.log("SelectedPromotionID", selected);
  return (
    <Fragment>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12} >
              <Typography color="primary" component="h4" variant="h6" style={{ paddingBottom: "1rem", textAlign: "center" }}>
                กรุณาเลือกโปรโมชั่น
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" style={{ float: "right", paddingBottom: "0.5rem" }}>
                ราคารวมต่อ 1 ใบเสร็จในขณะนี้: {order.OrderTotalPrice?.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingBottom: "1rem" }}>
              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table stickyHeader>
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      <TableCell width="1%"></TableCell>
                      <TableCell width="10%" align="center">รหัสโปรโมชั่น</TableCell>
                      <TableCell width="10%" align="center">ชื่อโปรโมชั่น</TableCell>
                      <TableCell width="5%" align="center">ราคาขั้นต่ำต่อ 1 ใบเสร็จ</TableCell>
                      <TableCell width="5%" align="center">ส่วนลดจากโปรโมชั่น</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {promotions.map((row: ManagePromotionsInterface, index) => {
                      const isItemSelected = isSelected(row.ID);
                      return (
                        <TableRow
                          hover
                          onClick={(e) => handleClickCell(e, row.ID)}
                          role="checkbox"
                          key={index}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              disabled={!checkMinPrice(row.MinPrice)}
                            />
                          </TableCell>
                          <TableCell width="10%" align="center" className={checkCellColorWithMinPrice(row.MinPrice)}>
                            {row.PromotionCode}
                          </TableCell>
                          <TableCell width="10%" className={checkCellColorWithMinPrice(row.MinPrice)}>
                            {row.NamePromotion.Name}
                          </TableCell>
                          <TableCell width="5%" align="center" className={checkCellColorWithMinPrice(row.MinPrice)}>
                            {row.MinPrice.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
                          </TableCell>
                          <TableCell width="5%" align="center" className={checkCellColorWithMinPrice(row.MinPrice)}>
                            {row.Discount}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" variant="contained" onClick={handleCloseDialog} style={{ float: "right" }}>
                เลือกโปรโมชั่นนี้
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
      <Button color="primary" variant="outlined" onClick={handleClickOpen} style={{ marginTop: ".5rem" }}>
        เลือกโปรโมชั่น
      </Button>
    </Fragment>
  );
}

export default function PurchaseOrder() {
  const classes = useStyles();

  const [user, setUser] = useState<UsersInterface>();

  const [productStocks, setProductStocks] = useState<ProductstocksInterface[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsInterface[]>([]);
  const [promotions, setPromotions] = useState<ManagePromotionsInterface[]>([]);
  const [order, setOrder] = useState<Partial<PurchaseOrdersInterface>>({
    PromotionID: 0,
    PaymentMethodID: 0,
    OrderDiscount: 0,
    OrderTotalPrice: 0,
  });
  const [orderItem, setOrderItem] = useState<Partial<PurchaseOrderItemsInterface>[]>([]);
  const [orderTime, setOrderTime] = useState<Date | null>(new Date());

  /* --- TABLE CUSTOMIZE --- */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* --- QUERY DATA FROM DATABASE --- */
  const getUser = async () => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setUser(JSON.parse(localStorage.getItem("user") || ""));
    }
  }
  const getProductStock = async () => {
    const apiUrl = "http://localhost:8080/productstock";
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
        // console.log("ProductStocks: ", res.data);
        if (res.data) {
          setProductStocks(res.data);
        } else {
          console.log("else");
        }
      })
  }

  const getPaymentMethod = async () => {
    const apiUrl = "http://localhost:8080/payment-methods";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    }

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        // console.log("PaymentMethods: ", res.data);
        if (res.data) {
          setPaymentMethods(res.data);
        } else {
          console.log("else");
        }
      })
  }

  const getPromotion = async () => {
    const apiUrl = "http://localhost:8080/listpromotion";
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
        // console.log("Promotions: ", res.data);
        if (res.data) {
          setPromotions(res.data);
        } else {
          console.log("else");
        }
      })
  }

  /* --- SUTMIT AND MESSAGE --- */
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const submit = () => {
    let orderItemsSubmit: Partial<PurchaseOrderItemsInterface>[] = [];
    orderItem.forEach(element => {
      orderItemsSubmit.push({
        ProductstockID: element.ProductstockID,
        OrderAmount: element.OrderAmount,
        ItemPrice: element.ItemPrice,
        AmountPrice: element.AmountPrice,
      });
    });

    let data = {
      MemberID: user?.ID,
      PaymentMethodID: order.PaymentMethodID,
      PromotionID: order.PromotionID === 0 ? 1 : order.PromotionID,
      OrderTime: orderTime,
      DeliveryAddress: order.DeliveryAddress,
      OrderDiscount: order.OrderDiscount,
      OrderTotalPrice: order.OrderTotalPrice,
      OrderItems: orderItemsSubmit,
    }

    const apiUrl = "http://localhost:8080/purchase-order";
    const requestPostOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }

    fetch(apiUrl, requestPostOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setError(false);
          setSuccess(true);
        } else {
          console.log(res.error);
          setError(true);
          setErrorMsg(res.error);
        }
      });
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
    setErrorMsg("");
  };

  /* --- HANDLE ON-CHANGE --- */
  const handleChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof order;
    setOrder({ ...order, [name]: event.target.value });
  }

  const handleInputChange = (event: ChangeEvent<{ id?: string; value: any }>) => {
    const id = event.target.id as keyof typeof order;
    const { value } = event.target;
    setOrder({ ...order, [id]: value });
  }

  const handleChangeProduct = (event: ChangeEvent<{}>, newProductStock: ProductstocksInterface | null) => {
    let currentItem = [...orderItem];
    if (!newProductStock)
      return
    currentItem.push({
      ProductstockID: newProductStock.ID as number,
      Productstock: newProductStock,
      OrderAmount: 0,  // default amount when select product
      ItemPrice: newProductStock.Product.Price,  // record currently product price
      AmountPrice: 0, // product_price * default_amount
    });
    setOrderItem(currentItem);
  }

  const handleOrderDateTime = (date: Date | null) => {
    setOrderTime(date);
  }

  /* --- UPDATE QUANTITY OF PRODUCT CART --- */
  const ADD_QUANTITY = 1;
  const DEC_QUANTITY = -1;

  const updateChangeQuantity = (currentItem: Partial<PurchaseOrderItemsInterface>, index: number, stepAmount: number) => {
    if (Number(currentItem.OrderAmount) >= Number(currentItem.Productstock?.Amount_remain) && stepAmount === ADD_QUANTITY) {
      return
    }
    // Update product amount, then update amount price
    let newItem: Partial<PurchaseOrderItemsInterface> = {
      ...currentItem,
      OrderAmount: (currentItem.OrderAmount || 0) + stepAmount,
      AmountPrice: ((currentItem.OrderAmount || 0) + stepAmount) * Number(productStocks.find(ps => ps.ID === currentItem.ProductstockID)?.Product.Price),
    };
    // If amount is 0, it will cannot be set negative number
    if (Number(currentItem.OrderAmount) === 0 && stepAmount === DEC_QUANTITY) {
      return
    }
    let newOrderItem = [...orderItem]
    newOrderItem[index] = newItem;
    setOrderItem(newOrderItem);
  }

  const removeFromCart = (index: number) => {
    let updatedOrderItem = orderItem.filter((_, i) => i !== index);
    setOrderItem(updatedOrderItem);
  }

  /* --- USE EFFECT --- */
  useEffect(() => {
    getUser();
    getProductStock();
    getPromotion();
    getPaymentMethod();
  }, []);

  /* --- PRODUCT CART'S TOTAL PRICE --- */
  // Calculate total price
  useEffect(() => {
    setOrder(order => {
      return {
        ...order,
        OrderTotalPrice: orderItem.map(({ AmountPrice }) => AmountPrice).reduce((sum, i) => Number(sum) + Number(i), 0),
      };
    });
  }, [orderItem]);
  // Check total price if less than promotionMinPrice, it will be reset discount
  useEffect(() => {
    setOrder(order => {
      let promotionMinPrice = promotions.find(p => p.ID === order.PromotionID)?.MinPrice;
      if (Number(order.OrderTotalPrice) < Number(promotionMinPrice))
        return {
          ...order,
          PromotionID: 0,
          OrderDiscount: 0,
        };
      else
        return {...order};
    });
  }, [order.OrderTotalPrice, promotions]);

  // DEBUG CONSOLE MONITOR
  // console.log("Order: ", order);
  // console.log("OrderItems: ", orderItem);

  return (
    <div>
      <Container className={classes.container} maxWidth="lg">
        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            บันทึกข้อมูลสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            บันทึกข้อมูลไม่สำเร็จ: {errorMsg}
          </Alert>
        </Snackbar>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            {/* Head */}
            <Grid item xs={8} style={{ paddingBottom: "1rem" }}>
              <Typography component="h4" variant="h5" color="primary">
                ชำระสินค้า
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ paddingBottom: "1rem" }}>
              <Button
                color="primary"
                variant="contained"
                style={{ float: "right" }}
                component={RouterLink}
                to="/member/order-history"
              >
                ประวัติการชำระสินค้า
              </Button>
            </Grid>

            {/* Left Column */}
            <Grid item xs={8}>
              <Paper elevation={1} className={classes.paper} style={{ marginRight: ".5rem" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <Typography className={classes.typoHeader} variant="subtitle2">ค้นหาสินค้า</Typography>
                      <Autocomplete
                        id="ProductstockID"
                        options={productStocks}
                        getOptionLabel={(option) => (option.Product.Name)}
                        onChange={handleChangeProduct}
                        renderInput={(params) => <TextField {...params} placeholder="Product" variant="outlined" />}
                        renderOption={(option) => (
                          <Grid container>
                            <Grid item xs={12}>
                              {option.Product.Name}
                            </Grid>
                            <Grid item xs={6}>
                              ราคาต่อหน่วย: {option.Product.Price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
                            </Grid>
                            <Grid item xs={6}>
                              คงเหลือ: {option.Amount_remain}
                            </Grid>
                          </Grid>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
              <Paper elevation={1} className={classes.paper} style={{ marginRight: ".5rem", marginTop: "1rem" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography className={classes.typoHeader} variant="subtitle2">ตะกร้าสินค้า</Typography>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                      <Table stickyHeader>
                        <TableHead className={classes.tableHead}>
                          <TableRow>
                            <TableCell width="15%" align="center">ชื่อสินค้า</TableCell>
                            <TableCell width="5%" align="center">ราคาต่อหน่วย</TableCell>
                            <TableCell width="5%" align="center">สินค้าคงเหลือ</TableCell>
                            <TableCell width="5%" align="center">จำนวน</TableCell>
                            <TableCell width="5%" align="center">รวมทั้งหมด</TableCell>
                            <TableCell width="5%" align="center"><IconButton disabled></IconButton></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderItem.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Partial<PurchaseOrderItemsInterface>, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell width="15%">{productStocks.find(p => p.ID === row.ProductstockID)?.Product.Name}</TableCell>
                                <TableCell width="5%" align="center">{productStocks.find(p => p.ID === row.ProductstockID)?.Product.Price.toLocaleString("th-Th", { style: "currency", currency: "THB" })}</TableCell>
                                <TableCell width="5%" align="center">{productStocks.find(p => p.ID === row.ProductstockID)?.Amount_remain}</TableCell>
                                <TableCell width="5%" align="center">
                                  <ButtonGroup>
                                    <Button size="small" onClick={() => updateChangeQuantity(row, index, DEC_QUANTITY)}>
                                      <RemoveIcon fontSize="small" />
                                    </Button>
                                    <Button size="small" disableTouchRipple>
                                      {row.OrderAmount}
                                    </Button>
                                    <Button size="small" onClick={() => updateChangeQuantity(row, index, ADD_QUANTITY)}>
                                      <AddIcon fontSize="small" />
                                    </Button>
                                  </ButtonGroup>
                                </TableCell>
                                <TableCell width="5%" align="center">{row.AmountPrice?.toLocaleString("th-Th", { style: "currency", currency: "THB" })}</TableCell>
                                <TableCell padding="checkbox" align="center"><IconButton size="small" onClick={() => removeFromCart(index)}><DeleteIcon /></IconButton></TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={orderItem.length}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column */}
            <Grid item xs={4}>
              <Paper elevation={1} className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Typography className={classes.typoHeader} variant="subtitle2">กรุณากรอกที่อยู่</Typography>
                      <TextField
                        id="DeliveryAddress"
                        variant="outlined"
                        type="string"
                        multiline
                        minRows={4}
                        value={order.DeliveryAddress || ""}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Typography className={classes.typoHeader} variant="subtitle2">กรุณาเลือกโปรโมชั่น (ถ้ามี)</Typography>
                      <Paper variant="outlined" style={{ padding: ".5rem", paddingBottom: ".5rem" }}>
                        <Typography variant="subtitle2" noWrap style={{ height: "1rem" }}>
                          {promotions.find(pr => pr.ID === order.PromotionID)?.PromotionCode}&nbsp;
                          {promotions.find(pr => pr.ID === order.PromotionID)?.NamePromotion.Name}
                        </Typography>
                      </Paper>
                      <Fragment>
                        <ListPromotions promotions={promotions} order={order} setOrder={setOrder} />
                      </Fragment>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Typography className={classes.typoHeader} variant="subtitle2">เลือกวิธีการชำระเงิน</Typography>
                      <Select
                        id="PaymentMethodID"
                        value={order.PaymentMethodID}
                        inputProps={{ name: "PaymentMethodID" }}
                        onChange={handleChange}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                          },
                          getContentAnchorEl: null
                        }}
                      >
                        <MenuItem value={0} key={0} disabled>วิธีการชำระเงิน</MenuItem>
                        {paymentMethods.map((payment: PaymentMethodsInterface) => (
                          <MenuItem value={payment.ID} key={payment.ID}>{payment.MethodName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                      <Typography className={classes.typoHeader} variant="subtitle2">วันที่และเวลา</Typography>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                          disableToolbar
                          id="enrollDateTime"
                          name="enrollDateTime"
                          value={orderTime}
                          onChange={handleOrderDateTime}
                          margin="dense"
                          label="กรุณาเลือกวันที่และเวลา"
                          minDate={new Date("2018-01-01T00:00")}
                          format="yyyy/MM/dd hh:mm a"
                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.typoHeader} variant="subtitle2">ราคาสินค้า</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" variant="subtitle2">{order.OrderTotalPrice?.toLocaleString("th-Th", { style: "currency", currency: "THB" })}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.typoHeader} variant="subtitle2">ส่วนลดจากโปรโมชั่น</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" variant="subtitle2">{order.OrderDiscount === 0 ? "" : "-"}{order.OrderDiscount?.toLocaleString("th-Th", { style: "currency", currency: "THB" })}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.typoHeader} variant="subtitle2">รวมทั้งหมด</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" variant="subtitle2">
                      {(Number(order.OrderTotalPrice) - Number(order.OrderDiscount)).toLocaleString("th-Th", { style: "currency", currency: "THB" })}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Bottom */}
            <Grid item xs={12} style={{ marginTop: ".5rem" }}>
              <Button
                color="inherit"
                variant="contained"
                style={{ float: "left" }}
                component={RouterLink}
                to="/"
              >
                กลับ
              </Button>
              <Button
                color="primary"
                variant="contained"
                disabled={orderItem.length === 0}
                style={{ float: "right" }}
                onClick={submit}
              >
                บันทึกการชำระสินค้า
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}