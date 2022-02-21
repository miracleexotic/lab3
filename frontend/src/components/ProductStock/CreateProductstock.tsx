import React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ShelfstoresInterface,
  ProductsInterface,
  ProductstocksInterface,
  TypeproductsInterface,
} from "../../models/IProductstock";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function CreateProductstock() {
  const classes = useStyles();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [productstock, setProductstock] = useState<
    Partial<ProductstocksInterface>
  >({});
  const username = user.UserDetail.FirstName + " " + user.UserDetail.LastName;
  const ID = user.ID;
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const [product, setProduct] = useState<ProductsInterface[]>([]);
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof productstock;
    setProductstock({
      ...productstock,
      [name]: event.target.value,
    });
  };

  const getProduct = async () => {
    const apiUrl = "http://localhost:8080/product";
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
          setProduct(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const [shelfstore, setShelfstore] = useState<ShelfstoresInterface[]>([]);

  const getShelfstore = async () => {
    const apiUrl = "http://localhost:8080/shelfstore";
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
          setShelfstore(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getProduct();
    getShelfstore();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      Amount_remain: convertType(productstock.Amount_remain),
      Detail: productstock.Detail,
      ProductID: convertType(productstock.ProductID),
      ShelfstoreID: convertType(productstock.ShelfstoreID),
      Update_datetime: selectedDate,
      EmployeeID: convertType(ID),
    };

    const apiUrl = "http://localhost:8080/productstock";
    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(apiUrl, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          console.log("บันทึกได้");
          setErrorMessage("")
        } else {
          setError(true);
          console.log("บันทึกไม่ได้");
          setErrorMessage(res.error)
        }
      });
  }

  return (
    <div>
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ : {errorMessage}
        </Alert>
      </Snackbar>
      <Container className={classes.container} maxWidth="md">
        <Paper className={classes.paper}>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                บันทึกสินค้าเข้าคลังฟาร์มมาร์ท
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Grid container spacing={2} className={classes.root}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <p>ชื่อผู้ใช้งานระบบ</p>
                <Select
                  native
                  value={username}
                  onChange={handleChange}
                  disabled
                >
                  <option aria-label="None" value="">
                    {username}
                  </option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <p>รายการสินค้า</p>
                <Select
                  native
                  value={productstock.ProductID}
                  onChange={handleChange}
                  inputProps={{
                    name: "ProductID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกรายการสินค้า
                  </option>
                  {product.map((item: ProductsInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <p>ชั้นวางสินค้า</p>
                <Select
                  native
                  value={productstock.ShelfstoreID}
                  onChange={handleChange}
                  inputProps={{
                    name: "ShelfstoreID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกชั้นวางสินค้า
                  </option>
                  {shelfstore.map((item: ShelfstoresInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Zone}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <p>จำนวนสินค้า</p>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  type="number"
                  placeholder="กรอกจำนวนสินค้า"
                  value={productstock.Amount_remain}
                  onChange={handleChange}
                  inputProps={{ name: "Amount_remain" }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <p>รายอะเลียดสินค้า</p>
              <TextField
                fullWidth
                id="outlined-basic"
                placeholder="กรอกรายละเอียดสินค้า"
                value={productstock.Detail}
                onChange={handleChange}
                inputProps={{ name: "Detail" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <p>วันที่และเวลา</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    name="WatchedTime"
                    value={selectedDate}
                    onChange={handleDateChange}
                    label="กรุณาเลือกวันที่และเวลา"
                    format="dd/MM/yyyy hh:mm a"
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
              >
                กลับ
              </Button>
              <Button
                style={{ float: "right" }}
                variant="contained"
                onClick={submit}
                color="primary"
              >
                บันทึก
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}

export default CreateProductstock;
