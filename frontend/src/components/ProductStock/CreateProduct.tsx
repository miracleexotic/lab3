import React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { EmployeesInterface } from "../../models/IUser";
import { ShelfstoresInterface, ProductsInterface ,ProductstocksInterface ,TypeproductsInterface } from "../../models/IProductstock";
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
import { colors } from "@material-ui/core";


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
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function CreateProduct() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };
  const classes = useStyles();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const username = user.UserDetail.FirstName + " " + user.UserDetail.LastName;
  const [product, setProduct] = useState<Partial<ProductsInterface>>({});

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof product;
    setProduct({
      ...product,
      [name]: event.target.value,
    });
  };

  const [typeproduct, setTypedroduct] = useState<TypeproductsInterface[]>([]);
  const getTypeproduct = async () => {
    const apiUrl = "http://localhost:8080/typeproduct";
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
          setTypedroduct(res.data);
        } else {
          console.log("else");
        }
      });
  };


  useEffect(() => {
    getTypeproduct();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      Name : product.Name,
      Price : convertType(product.Price),
      typeproductID : convertType(product.TypeproductID),
    };
    const apiUrl = "http://localhost:8080/product";
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
          setError(false);
          setSuccess(true);
          console.log("บันทึกได้");
        } else {
          setError(true);
          console.log("บันทึกไม่ได้");
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
          ไม่สามารถบันทึกได้
        </Alert>
      </Snackbar>
      <Container className={classes.container} maxWidth="md">
        <Paper className={classes.paper}>
          <Box display="flex">
            <Box flexGrow={1}>
              <Typography
                component="h2"
                variant="h6"
                gutterBottom
                color="primary"
              >
                บันทึกสินค้าใหม่
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
              <p>ชื่อสินค้า</p>
              <TextField
                fullWidth
                id="outlined-basic"
                placeholder="กรอกชื่อสินค้า"
                value={product.Name}
                onChange={handleChange}
                inputProps={{ name: "Name" }}
              />
            </Grid>

            <Grid item xs={12}>
              <p>ราคา</p>
              <TextField
                fullWidth
                id="outlined-basic"
                type = "number"
                placeholder="กรอกราคาสินค้า"
                value={product.Price}
                onChange={handleChange}
                inputProps={{ name: "Price" }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <p>ประเภทสินค้า</p>
                <Select
                  native
                  value={product.TypeproductID}
                  onChange={handleChange}
                  inputProps={{
                    name: "TypeproductID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกรายการสินค้า
                  </option>
                  {typeproduct.map((item: TypeproductsInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
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

export default CreateProduct;
