import React, { useState, useEffect, ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, Theme, makeStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { MuiPickersUtilsProvider, DateTimePicker, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";



// import { MembersInterface } from "../../models/IUser";
import { PremiumMemberPeriodInterface } from "../../models/IPremiumMemberPeriod";
import { MemberClassInterface } from "../../models/IMemberClass";
import { PremiumMemberInterface } from "../../models/IPremiumMember";

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
    }
  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function CreatePremiumMember() {
  const classes = useStyles();

  const [user, setUser] = useState<UsersInterface>();

  //const [member, setMember] = useState<MembersInterface[]>([]);
  const [premiumMemberPeriod, setPremiumMemberPeriod] = useState<PremiumMemberPeriodInterface[]>([]);
  const [memberClass, setMemberClass] = useState<MemberClassInterface[]>([]);
  const [premiumMember, setPremiumMember] = useState<Partial<PremiumMemberInterface>>({
    MemberClassID: 0,
    PremiumMemberPeriodID: 0,
  });
  const [createTime, setCreateTime] = useState<Date | null>(new Date());
  const [errorMassage, SetErrorMassage] = useState("");

  const [pointInputError, setPointInputError]  = React.useState(false);
  const [pointError, setPointError] = React.useState("");

  const [pIDInputError, setPIDInputError]  = React.useState(false);
  const [pIDError, setPIDError] = React.useState("");


  // QUERY DATA FROM DATABASE
  const getUser = async () => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setUser(JSON.parse(localStorage.getItem("user") || ""));
    }
  }

  // const getPremiumMember = async () => {
  //   const apiUrl = "http://localhost:8080/premium_members";
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       "Content-Type": "application/json",
  //     },
  //   }

  //   fetch(apiUrl, requestOptions)
  //     .then((response) => response.json())
  //     .then((res) => {
  //       console.log(res.data);
  //       if (res.data) {
  //         setPremiumMember(res.data);
  //       } else {
  //         console.log("else");
  //       }
  //     })
  // }

  const getPremiumMemberPeriod = async () => {
    const apiUrl = "http://localhost:8080/premium_member_period";
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
        console.log(res.data);
        if (res.data) {
          setPremiumMemberPeriod(res.data);
        } else {
          console.log("else");
        }
      })
  }

  const getMemberClasss = async () => {
    const apiUrl = "http://localhost:8080/member_class";
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
          setMemberClass(res.data);
        } else {
          console.log("else");
        }
      })
  }

  // SUTMIT AND MESSAGE
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };


  const submit = () => {
    let data = {
      MemberID: user?.ID,
      MemberClassID: premiumMember.MemberClassID,
      PremiumMemberPeriodID: convertType(premiumMember.PremiumMemberPeriodID),
      CreateAt: createTime,
      Point: convertType(premiumMember.Point),
      PremiumMemberID: premiumMember.PremiumMemberID,
    }

    const apiUrl = "http://localhost:8080/premium_members";
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
          SetErrorMassage("");
        } else {
          console.log(res.error);
          setError(true);
          setErrorMsg(res.error);
          SetErrorMassage(res.error);
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

  // HANDLE ON-CHANGE
  const handleChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof premiumMember;
    setPremiumMember({ ...premiumMember, [name]: event.target.value });
  };

  const handleInputChange = (event: ChangeEvent<{ id?: string; value: any }>) => {
    const id = event.target.id as keyof typeof premiumMember;
    const { value } = event.target;
    setPremiumMember({ ...premiumMember, [id]: value });
    const validateValue = value.toString();
    checkPoint(id, validateValue);
  };

  const handleCreateDateTime = (date: Date | null) => {
    console.log(date);
    setCreateTime(date);
  }
  

  useEffect(() => {
    getUser();
    //getPremiumMember();
    getPremiumMemberPeriod();
    getMemberClasss();

  }, []);

  // DEBUG CONSOLE MONITOR
  console.log("user: ", user);
  console.log("class: ", memberClass);
  console.log("period: ", premiumMemberPeriod);
  console.log("premium: ", premiumMember);

  //validation
  const validatePoint = (point:string) => {
    if (Number(point) >=  0) {
      return true;
    }
    else {
      return false;
    }
  }

  const validateFcPID = (pid: string) => {
    if (pid[0] == 'P'){
      return true;
    }
    else {
      return false;
    }
  }
  const validatePID = (pid: string) => {
    if (pid.length == 8) {
      return true;
    }
    else {
      return false;
    }
  }

  const checkPoint = (id: string, value: string) => {
    switch (id) {
      case 'Point':
        validatePoint(value) ? setPointError(''): setPointError("Point ต้องมากกว่า 0");
        validatePoint(value) ? setPointInputError(false) : setPointInputError(true)
        return;
      case 'PremiumMemberID':
        validateFcPID(value) ? setPIDError(''): setPIDError("อักษรตัวแรกต้องเป็น P");
        validateFcPID(value) ? setPIDInputError(false): setPIDInputError(true)
        if (validateFcPID(value) == true) { 
          validatePID(value) ? setPIDError(''): setPIDError("ต้องมีตัวอักษรจํานวน 8 ตัวอักษร");
          validatePID(value) ? setPIDInputError(false): setPIDInputError(true)
          return;
        }
        else {
          return;
        }
      default:
        return;
    }
  }

  return (
    <div>
      <Container className={classes.container} maxWidth="lg">
        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            สมัครสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {errorMassage}
          </Alert>
        </Snackbar>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            {/* Head */}
            <Grid item xs={12}>
              <Typography component="h4" variant="h5" color="primary">
                สมัครสมาชิกพรีเมียม
              </Typography>
            </Grid>

            {/* Left Column */}
            <Grid item xs={8}>
              <Paper elevation={1} className={classes.paper} style={{ marginRight: "-9.5rem" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <p>Member Class</p>
                      <Select                       
                        value={premiumMember.MemberClassID}
                        inputProps={{ name: "MemberClassID" }}
                        onChange={handleChange}
                      >
                        <MenuItem value={0} key={0}>Select Class</MenuItem>
                        {memberClass.map((item: MemberClassInterface) => (
                          <MenuItem value={item.ID} key={item.ID}>{item.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <p>Period</p>
                      <Select
                        value={premiumMember.PremiumMemberPeriodID}
                        inputProps={{ name: "PremiumMemberPeriodID" }}
                        onChange={handleChange}
                      >
                        <MenuItem value={0} key={0}>Select Period</MenuItem>
                        {premiumMemberPeriod.map((item: PremiumMemberPeriodInterface) => (
                          <MenuItem value={item.ID} key={item.ID}>{item.Period}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <p>Premium Member ID</p>
                      <TextField
                        fullWidth
                        id="PremiumMemberID"
                        variant="outlined"
                        placeholder="ID"
                        label = "Premium ID"
                        value={premiumMember.PremiumMemberID}
                        onChange={handleInputChange}
                        inputProps={{ name: "Name" }}
                        helperText = {pIDError}
                        error = {pIDInputError}
                      />
                      <p>Point</p>
                      <TextField
                        fullWidth
                        id="Point"
                        variant="outlined"
                        type="number"
                        label = "Point"
                        placeholder="0"
                        value={premiumMember.Point}
                        onChange={handleInputChange}                       
                        inputProps={{ name: "Point" }}
                        helperText={pointError}
                        error={pointInputError}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth size="small" variant="outlined">
                    <p>วันที่และเวลา</p>
                      <Typography className={classes.typoHeader} variant="subtitle2"></Typography>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          style={{ justifyContent: "center" }}
                          name="CreateAt"
                          value={createTime}
                          onChange={handleCreateDateTime}
                          label="กรุณาเลือกวันที่และเวลา"
                          minDate={new Date("2018-01-01T00:00")}
                          format="yyyy/MM/dd"

                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  </Grid>
              </Paper>
            </Grid>           

            {/* Bottom */}
            <Grid item xs={12} style={{ marginTop: ".5rem" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={submit}
              >
                สมัครสมาชิกพรีเมียม
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
export default CreatePremiumMember;