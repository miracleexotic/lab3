import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Box, Paper, Select } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormControl from "@material-ui/core/FormControl";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";


// import { EmployeesInterface } from "../../models/IUser";
import { ManagePromotionsInterface } from "../../models/IManagePromotion";
import { NamePromotionsInterface } from "../../models/INamePromotion";
import { PromotionPeriodsInterface } from "../../models/IPromotionPeriod";
import { PromotionTypesInterface } from "../../models/IPromotionType";


import { Details } from "@material-ui/icons";
//import { stringify } from "querystring";

import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
  //การกำหนดลักษณะ

  createStyles({
    root: { flexGrow: 1 },

    container: { marginTop: theme.spacing(2) },

    paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },

    table: { minWidth: 20 },

    position: { marginleft: theme.spacing(5) },
  })
);
const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};
export default function ManagePromotion() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMassage] = useState(""); 



  const [Promotion, setPromotion] = React.useState<Partial<ManagePromotionsInterface>>({
    NamePromotionID: 0,
    PromotionPeriodID: 0,
    PromotionTypeID: 0,
    MinPrice: 0,
    Discount: 0,
  });
  const [NamePromotion, setNamePromotion] = React.useState<NamePromotionsInterface[]>([]);
  const [PromotionPeriod, setPromotionPeriod] = React.useState<PromotionPeriodsInterface[]>([]);
  const [PromotionType, setPromotionType] = React.useState<PromotionTypesInterface[]>([]);
  const [detail,setdetail] = React.useState<NamePromotionsInterface>()
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof Promotion;
    const { value } = event.target;
    setPromotion({ ...Promotion, [id]: value === "" ? "" : Number(value) });
  };
  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof Promotion;
    setPromotion({
      ...Promotion,
      [name]: event.target.value,
    });
    //การล็อครายละเอียดโปรโมชั่นตามชื่อ
    if (event.target.name === "NamePromotionID") {
      setdetail(NamePromotion.find((r) => r.ID === event.target.value));
    }
  };
 


  function submit() {

   


    let data = {
      PromotionPeriodID: Promotion?.PromotionPeriodID,
      NamePromotionID: Promotion?.NamePromotionID,
      PromotionTypeID: Promotion?.PromotionTypeID,
      MinPrice: typeof Promotion?.MinPrice === "string" ? (Promotion?.MinPrice === "" ? 0 : Promotion?.MinPrice) : Promotion?.MinPrice,
      Discount: typeof Promotion?.Discount === "string" ? (Promotion?.Discount === "" ? 0 : Promotion?.Discount) : Promotion?.Discount,
      PromotionCode: Promotion?.PromotionCode,
      Createdatetime: selectedDate,
    }; 
    console.log(data);
    const apiUrl = "http://localhost:8080/createpromotion";
    const requestOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          setErrorMassage("")
        } else {
          setError(true);
          setErrorMassage(res.error)
        }
      });
   
    
  }
  const getNamePromotion = async () => {
    const apiUrl = `http://localhost:8080/getnamepromotion`;

    const requestOptions = {
      method: "GET",

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    //การกระทำ
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setNamePromotion(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getPromotionPeriod = async () => {
    const apiUrl = `http://localhost:8080/getpromotionperiod`;

    const requestOptions = {
      method: "GET",

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    //การกระทำ
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setPromotionPeriod(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getPromotionType = async () => {
    const apiUrl = `http://localhost:8080/getpromotiontype`;

    const requestOptions = {
      method: "GET",

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    //การกระทำ
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);

        if (res.data) {
          setPromotionType(res.data);
        } else {
          console.log("else");
        }
      });
  };

  console.log(Promotion);

  useEffect(() => {
    getNamePromotion();
    getPromotionPeriod();
    getPromotionType();
  }, []);
  
 
  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ {errorMessage}
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex">
          <br />
          <br />
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
              align="center"
            >
              การจัดการโปรโมชั่น
            </Typography>
            <br />
          </Box>
        </Box>
        <Box flexGrow={1}>
          <Button
            component={RouterLink}
            to="/employee/history-promotion"
            variant="contained"
            color="primary"
            style={{ float: "right" }}
          >
            ประวัติโปรโมชั่น
          </Button>
        </Box>
        <br />
        <br />
        <Divider />
        <br />

        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={6}>
            <p>รหัสโปรโมชั่น</p>
            <TextField
              fullWidth
              id="Promotioncode"
              type="string"
              inputProps={{ name: "PromotionCode" }}
              value={Promotion.PromotionCode || ""}
              onChange={handleChange}
              label=""
              variant="outlined"
              //className ={classes.fullbox}
              multiline
              rows={1}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อโปรโมชั่น</p>
              <Select
                //การกำหนดค่า
                value={Promotion.NamePromotionID}
                //เปลี่ยนค่าที่รับเข้ามาจาก Value
                onChange={handleChange}
                //กำหนดให้ value
                inputProps={{
                  name: "NamePromotionID",
                }}
                defaultValue={0}
              >
                <MenuItem value={0} key={0}>
                  เลือกชื่อโปรโมชั่น
                </MenuItem>
                {NamePromotion.map((item: NamePromotionsInterface) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.Name}
                  </MenuItem>
                ))}
                )
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
              <p>รายละเอียดโปรโมชั่น</p>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                value={detail?.Detail}
                multiline rows={4}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชนิดโปรโมชั่น</p>
              <Select
                value={Promotion.PromotionTypeID}
                onChange={handleChange}
                inputProps={{
                  name: "PromotionTypeID",
                }}
                defaultValue={0}
              >
                <MenuItem value={0} key={0}>
                  เลือกชนิดโปรโมชั่น
                </MenuItem>
                {PromotionType.map((item: PromotionTypesInterface) => (
                  <MenuItem value={item.ID} key={item.Type}>
                    {item.Type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <p>ราคาขั้นต่ำ (ราคาที่ซื้อต่อ 1 บิล)</p>
            
            <TextField
              fullWidth
              id="MinPrice"
              type="number"
              inputProps={{ name: "MinPrice", min: 0 }}
              value={Promotion.MinPrice}
              onChange={handleInputChange}
              label=""
              defaultValue={0}
              variant="outlined"
              //className ={classes.fullbox}
            />
          </Grid>

          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <p>ราคาที่ลด</p>
            <TextField
              fullWidth
              id="Discount"
              type="number"
              inputProps={{ name: "Discount", min: 0 }}
              value={Promotion.Discount}
              onChange={handleInputChange}
              label=""
              defaultValue={0}
              variant="outlined"
              //className ={classes.fullbox}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>ช่วงเวลาโปรโมชั่น</p>
              <Select
                value={Promotion.PromotionPeriodID}
                onChange={handleChange}
                inputProps={{
                  name: "PromotionPeriodID",
                }}
                defaultValue={0}
              >
                <MenuItem value={0} key={0}>
                  เลือกช่วงเวลาโปรโมชั่น
                </MenuItem>
                {PromotionPeriod.map((item: PromotionPeriodsInterface) => (
                  
                  <MenuItem value={item.ID}  key={item.ID}>
                     เวลา {moment(item.StartDate).format("DD/MM/YYYY hh:mm A")} ถึง {moment(item.EndDate).format("DD/MM/YYYY hh:mm A")}
                  </MenuItem> 
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <p>วันที่เเละเวลาที่บันทึกโปรโมชั่น</p>

            <form className={classes.container} noValidate>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="WatchedTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label=""
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </form>
          </Grid>

          <Grid item xs={12}>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

