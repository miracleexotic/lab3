import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from '@material-ui/core/FormHelperText';
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {MuiPickersUtilsProvider,KeyboardDatePicker,KeyboardTimePicker,} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';

import { EmployeesInterface } from "../../models/IUser";
import { ManageWorkTimeInterface } from "../../models/IManageWorkTime";
import { AssessmentInterface, BonusStatusInterface, ManageSalaryInterface } from "../../models/IManageSalary";
import moment from "moment";
 
function Alert(props: AlertProps) {
 return <MuiAlert elevation={6} variant="filled" {...props} />;
}
 
const useStyles = makeStyles((theme: Theme) =>
 createStyles({
   root: {flexGrow: 1, display: 'flex'},
   container: {marginTop: theme.spacing(2)},
   paper: {padding: theme.spacing(2),color: theme.palette.text.secondary},
   table: {minWidth: 400},
   formControl: {margin: theme.spacing(1),minWidth: 200},
 })
);

const StyledTableHead = withStyles((theme) => ({
  head: {
    backgroundColor: '#334756',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
 
function SalaryCreate() {
 const classes = useStyles();

//  const [checkBoxMwt, setCheckBoxMwt] = React.useState<string | null>('');
//  const [updateMS, setUpdateMS] = useState(localStorage.getItem("update_msID"))
 const [updateMS, setUpdateMS] = useState(localStorage.getItem("update_msID"))
 function getEmployeesMS() {
  const apiUrl = "http://localhost:8080/managesalary/"+updateMS;
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
        console.log(res.data)
        setEmployee(res.data.ManageWorkTime.Employee.ID)
        localStorage.setItem("update_mwtID", res.data.ManageWorkTimeID.toString())
        localStorage.setItem("check_mwtID", "true")
        setManageSalary({ ...ManageSalary, ["BonusAmount"]: res.data.BonusAmount.toString(), 
          ["BonusDetail"]: res.data.BonusDetail,
          ["ManageWorkTimeID"]: res.data.ManageWorkTimeID.toString(),
          ["AssessmentID"]: res.data.AssessmentID,
        });
        console.log(ManageSalary)
      }
    });
 }
 
 function handleClickCheckBox(id: string) {
  localStorage.setItem("check_mwtID", (localStorage.getItem("check_mwtID") === "true" ? "false" : "true"))
  localStorage.setItem("update_mwtID", id)
  if (localStorage.getItem("check_mwtID") === "false") {
    localStorage.setItem("update_mwtID", "0")
  }
 }

 function cancelUpdateMS() {
  localStorage.removeItem("update_status");
  localStorage.removeItem("update_msID");
  localStorage.removeItem("update_mwtID");
  localStorage.removeItem("check_mwtID");
 }

 const [ManageSalary, setManageSalary] = React.useState<Partial<ManageSalaryInterface>>({BonusStatusID: 1});
 const handleInputChange = (
   event: React.ChangeEvent<{ name?: string; value: any }>
 ) => {
   console.log(event)
   const name = event.target.name as keyof typeof ManageSalary;
   const { value } = event.target;
   if (name === "ManageWorkTimeID") {
    if (ManageSalary.ManageWorkTimeID !== value) {
      setManageSalary({ ...ManageSalary, [name]: value });
    } else {
      setManageSalary({ ...ManageSalary, [name]: 0 });
    }
   } else {
     setManageSalary({ ...ManageSalary, [name]: value });
   }
   console.log(ManageSalary)
 };

 const [employees, setEmployees] = React.useState<EmployeesInterface[]>([]);
 function getEmployees() {
  const apiUrl = "http://localhost:8080/managesalary/employees";
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
        console.log(res.data)
        setEmployees(res.data)
      }
    });
 }
 const [employee, setEmployee] = React.useState<number | string>("")
 const handleEmployeeInputChange = (
   event: React.ChangeEvent<{ id?: string; value: any }>
 ) => {
   setEmployee(event.target.value);
 };

 const [manageWorkTime, setManageWorkTime] = React.useState<ManageWorkTimeInterface[]>([]);
 function getManageWorkTime(id: string) {
  const apiUrl = "http://localhost:8080/managesalary/manageworktime/"+id;
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
        console.log(res.data)
        setManageWorkTime(res.data)
        // setCheckBoxMwt(updateMS)
        setUpdateMS(updateMS)
      }
    });
 }

 const [assessments, setAssessments] = React.useState<AssessmentInterface[]>([]);
 function getAssessments() {
  const apiUrl = "http://localhost:8080/managesalary/assessments";
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
        console.log(res.data)
        setAssessments(res.data)
      }
    });
 }

 const [bonusStatus, setBonusStatus] = React.useState<BonusStatusInterface[]>([]);
 function getBonusStatus() {
  const apiUrl = "http://localhost:8080/managesalary/bonusstatus";
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
        console.log(res.data)
        setBonusStatus(res.data)
      }
    });
 }

 React.useEffect(() => {
  getEmployees()
  getAssessments()
  getBonusStatus()
  if (employee !== "") {
    getManageWorkTime(employee.toString())
    setOpenRow(true)
  }
  if (updateMS != null) {
    console.log(updateMS)
    getEmployeesMS()
  }
  window.addEventListener("beforeunload", cancelUpdateMS);
    return () => {
      window.removeEventListener("beforeunload", cancelUpdateMS);
    };
 }, [employee])

 const [selectedDate, setSelectedDate] = React.useState<Date | null>(
   new Date()
 );
 const handleDateChange = (date: Date | null) => {
   setSelectedDate(date);
 };

 const [success, setSuccess] = React.useState(false);
 const [error, setError] = React.useState(false);
 const [errorBonusAmount, setErrorBonusAmount] = React.useState(false);
 const [errorBonusDetail, setErrorBonusDetail] = React.useState(false);
 const [errorCreateAt, setErrorCreateAt] = React.useState(false);
 const [errorMessage, setErrorMessage] = React.useState("");
 const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
   if (reason === "clickaway") {
     return;
   }
   setSuccess(false);
   setError(false);
   setErrorBonusAmount(false);
   setErrorBonusDetail(false);
   setErrorCreateAt(false);
 };

 const [openRow, setOpenRow] = React.useState(false);
 

 function submit() {
   let data = {
    //  ManagerID: typeof localStorage.getItem("eid") === "string" ? parseInt(localStorage.getItem("eid")) : 0,
     ManageWorkTimeID: typeof ManageSalary.ManageWorkTimeID === "string" ? parseInt(ManageSalary.ManageWorkTimeID) : 0,
     AssessmentID: ManageSalary.AssessmentID,
     BonusAmount: typeof ManageSalary.BonusAmount === "string" ? parseFloat(ManageSalary.BonusAmount) : 0,
     BonusDetail : ManageSalary.BonusDetail ?? "",
     BonusStatusID: ManageSalary.BonusStatusID,
     CreateAt: selectedDate,
   };

   console.log(data)
   
   let apiUrl: string
   let requestOptions: object
   if (localStorage.getItem("update_status") === "true") {
     apiUrl = "http://localhost:8080/managesalary/"+localStorage.getItem("update_msID");
     requestOptions = {
       method: "PATCH",
       headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
        "Content-Type": "application/json", 
       },
       body: JSON.stringify(data),
     };
   } else {
     apiUrl = "http://localhost:8080/managesalary";
     requestOptions = {
       method: "POST",
       headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
        "Content-Type": "application/json", 
       },
       body: JSON.stringify(data),
     };
   }
 
   fetch(apiUrl, requestOptions)
     .then((response) => response.json())
     .then((res) => {
       if (res.data) {
         setSuccess(true);
         cancelUpdateMS();
       } else {
         setError(true);
         setErrorMessage(res.error);
         cancelUpdateMS();
         const text = res.error.trim().split(" ", 1)[0];
         if (text === "BonusAmount") {
           console.log(text)
           setErrorBonusAmount(true)
          } else if (text === "BonusDetail") {
           console.log(text)
           setErrorBonusDetail(true)
          } else if (text === "CreateAt") {
           console.log(text)
           setErrorCreateAt(true)
          } else {
           console.log(text)
          //  setError(true);
         }
       }
     });
 }

  return (     
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ: {errorMessage}
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกเงินเดือนพนักงาน
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Grid container className={classes.root}>
          <Grid item xs={12} justify="flex-end" alignContent="flex-end">
            <Box display="flex">
              <Box flexGrow={1}>
                <Typography
                  component="h5"
                  variant="h6"
                  color="textSecondary"
                  gutterBottom
                  style={{marginTop: 5}}
                >
                  พนักงาน
                </Typography>
              </Box>
              <Button
                style={{ float: "right", marginTop: '0.5rem' }}
                component={RouterLink} to="/manager/manage-salary/detail"
                onClick={cancelUpdateMS}
                variant="contained"
                color="primary"
              >
                รายละเอียดเงินเดือน
              </Button>
            </Box>
          </Grid>

          <Grid container item xs={12} spacing={3} className={classes.root} >
            <Grid item xs={3} justify="flex-end" alignContent="flex-end">
              <Typography variant="body1" align="right" style={{marginTop: '1.3rem'}}>ชื่อพนักงาน</Typography>
            </Grid>
            <Grid item xs={3}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="Code">กรุณาเลือกพนักงาน</InputLabel>
                <Select
                  labelId="Code"
                  id="ManageWorkTimeID"
                  value={employee || ""}
                  onChange={handleEmployeeInputChange}
                  label="กรุณาเลือกรหัสพนักงาน"
                >
                  <MenuItem value="">
                    <em>กรุณาเลือกพนักงาน</em>
                  </MenuItem>
                  {employees.map((employee: EmployeesInterface) => (
                    // employee.PositionID == 2 ? (<MenuItem value={employee.ID}>{employee.Detail.Code}</MenuItem>) : ("")
                    (<MenuItem value={employee.ID}>{employee.UserDetail.FirstName+" "+employee.UserDetail.LastName}</MenuItem>)
                  ))}
                </Select>
                <FormHelperText>เพื่อดูรายละเอียดพนักงาน</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={3} className={classes.root} style={{marginTop: 5}} >
            <TableContainer component={Paper} style={{marginLeft: '1.1rem'}}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableHead width="5%"/>
                    <StyledTableHead align="center" width="5%">
                      ID
                    </StyledTableHead>
                    {/* <StyledTableHead align="center" width="10%">
                      CODE
                    </StyledTableHead> */}
                    <StyledTableHead align="center" width="15%">
                      ชื่อ&nbsp;-&nbsp;นามสกุล
                    </StyledTableHead>
                    <StyledTableHead align="center" width="15%">
                      ตำแหน่ง
                    </StyledTableHead>
                    <StyledTableHead align="center" width="15%">
                      เพศ
                    </StyledTableHead>
                    <StyledTableHead align="center" width="15%">
                      เบอร์โทร
                    </StyledTableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((emp: EmployeesInterface) => (
                      emp.ID === employee ? (
                      <TableRow key={emp.ID}>
                      <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpenRow(!openRow)}>
                          {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">{emp.ID}</TableCell>
                      {/* <TableCell align="center">{emp.UserDetail.Code}</TableCell> */}
                      <TableCell align="center">{emp.UserDetail.FirstName+" "+emp.UserDetail.LastName}</TableCell>
                      <TableCell align="center">{emp.Position.PositionNameTH}</TableCell>
                      <TableCell align="center">{emp.UserDetail.Gender.GenderName}</TableCell>
                      <TableCell align="center">{emp.UserDetail.PhoneNumber}</TableCell>
                    </TableRow>) : ""
                    ))}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={openRow} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                              WorkTime
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell width="5%"></TableCell>
                                  <TableCell align="center">ID</TableCell>
                                  <TableCell align="center">Schedule</TableCell>
                                  <TableCell align="center">Day</TableCell>
                                  {/* <TableCell align="center">Weekly</TableCell> */}
                                  <TableCell align="center">Mouth</TableCell>
                                  <TableCell align="center">WorkingDate</TableCell>
                                  {/* <TableCell align="center">Time</TableCell> */}
                                  <TableCell align="center">TimeTotal (hr)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {manageWorkTime.map((mwt: ManageWorkTimeInterface) => (
                                  <TableRow key={mwt.ID} hover >
                                    <TableCell>
                                      <Checkbox
                                        checked={localStorage.getItem("update_mwtID") === mwt.ID.toString() ? (localStorage.getItem("check_mwtID") === "true" ? true : false ) : false}
                                        name="ManageWorkTimeID"
                                        value={mwt.ID}
                                        onClick={() => handleClickCheckBox(mwt.ID.toString())}
                                        onChange={handleInputChange}
                                      />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">{mwt.ID}</TableCell>
                                    <TableCell align="center">{mwt.Comment}</TableCell>
                                    <TableCell align="center">{mwt.Day.DayNumber}</TableCell>
                                    {/* <TableCell align="center">{mwt.Weekly.WeekAt}</TableCell> */}
                                    <TableCell align="center">{mwt.Month.MonthOfYear}</TableCell>
                                    <TableCell align="center">{moment(mwt.WorkingDate).format("DD/MM/YYYY")}</TableCell>
                                    {/* <TableCell align="center">{mwt.WorkingTime.TimeToTime}</TableCell> */}
                                    <TableCell align="center">{mwt.TimeTotal}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid container item xs={12} spacing={3} className={classes.root} style={{marginTop: 5}} >
            <Grid item xs={6} justify="flex-end" alignContent="flex-end">
              <Box display="flex">
                <Box flexGrow={1}>
                  <Typography
                    component="h5"
                    variant="h6"
                    color="textSecondary"
                    gutterBottom
                    style={{marginTop: 5}}
                  >
                    การประเมินผล
                  </Typography>
                </Box>
              </Box>
            </Grid>    
            <Grid item xs={6} justify="flex-end" alignContent="flex-end">
              <Box display="flex">
                <Box flexGrow={1}>
                  <Typography
                    component="h5"
                    variant="h6"
                    color="textSecondary"
                    gutterBottom
                    style={{marginTop: 5}}
                  >
                    โบนัส
                  </Typography>
                </Box>
              </Box>
            </Grid>  

            <Grid container item xs={12} spacing={3} className={classes.root} >
              <div>
              <Grid container item xs={12} className={classes.root} >
                <Grid item xs={6} justify="flex-end" alignContent="flex-end">
                  <Typography variant="body1" align="right" style={{marginTop: '1.3rem'}} >ระดับการประเมิน</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" className={classes.formControl} >
                    <InputLabel id="AssessmentID">กรุณาเลือกระดับ</InputLabel>
                    <Select
                      labelId="AssessmentID"
                      name="AssessmentID"
                      value={ManageSalary.AssessmentID || ""}
                      onChange={handleInputChange}
                      label="กรุณาเลือกระดับ"
                    >
                      <MenuItem value="">
                        <em>กรุณาเลือกระดับ</em>
                      </MenuItem>
                      {assessments.map((assessment: AssessmentInterface) => (
                        <MenuItem value={assessment.ID}>{assessment.Level}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container item xs={12} className={classes.root} >
                <TableContainer component={Paper} style={{marginLeft: '1.1rem', display: 'flex'}}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableHead align="center" width="50%">
                          ระดับ
                        </StyledTableHead>
                        <StyledTableHead align="center" width="50%">
                          คุณภาพ
                        </StyledTableHead>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assessments.map((assessment: AssessmentInterface) => (
                        <TableRow key={assessment.ID}>
                          <TableCell align="center">{assessment.Level}</TableCell>
                          <TableCell align="center">{assessment.Name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              </div>

              <div>
              <Grid container item xs={12} className={classes.root} >
                <Grid item xs={6} justify="flex-end" alignContent="flex-end">
                  <Typography variant="body1" align="right" style={{marginTop: '0.5rem'}}>จำนวนเงินโบนัส</Typography>
                </Grid>
                <Grid item xs={6} >
                  <FormControl fullWidth variant="outlined">
                    {errorBonusAmount ? (
                    <TextField
                      error
                      name="BonusAmount"
                      variant="outlined"
                      size="small"
                      placeholder="กรุณากรอกจำนวนเงิน"
                      style={{marginLeft: '0.5rem'}}
                      value={ManageSalary.BonusAmount}
                      onChange={handleInputChange}
                      helperText="!ต้องเป็นจำนวนจริงบวก"
                    />) : (
                    <TextField
                      name="BonusAmount"
                      variant="outlined"
                      size="small"
                      placeholder="กรุณากรอกจำนวนเงิน"
                      style={{marginLeft: '0.5rem'}}
                      value={ManageSalary.BonusAmount}
                      onChange={handleInputChange}
                    />  
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container item xs={12} className={classes.root} style={{marginTop: '1rem'}} >
                <Grid item xs={6} justify="flex-end" alignContent="flex-end">
                  <Typography variant="body1" align="right" style={{marginTop: '1.5rem'}}>สถานะการจ่ายเงินโบนัส</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="BonusStatus">กรุณาระบุสถานะ</InputLabel>
                    <Select
                      labelId="BonusStatus"
                      name="BonusStatus"
                      value={ManageSalary.BonusStatusID}
                      onChange={handleInputChange}
                      label="กรุณาระบุสถานะ"
                      disabled
                    >
                      <MenuItem value="">
                        <em>กรุณาระบุสถานะ</em>
                      </MenuItem>
                      {bonusStatus.map((status: BonusStatusInterface) => (
                        <MenuItem value={status.ID}>{status.Name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Grid container item xs={12} className={classes.root} style={{marginTop: '1rem'}} >
                <Grid item xs={6} justify="flex-end" alignContent="flex-end">
                  <Typography variant="body1" align="right" style={{marginTop: '1rem'}}>หมายเหตุ</Typography>
                </Grid>
                <Grid item xs={6} >
                  <FormControl fullWidth variant="outlined">
                    {errorBonusDetail ? (
                    <TextField
                      error
                      name="BonusDetail"
                      variant="outlined"
                      multiline
                      rows={4}
                      style={{marginLeft: '0.5rem'}}
                      value={ManageSalary.BonusDetail || ""}
                      onChange={handleInputChange}
                      helperText="!ความยาวไม่เกิน 200 ตัวอักษร"
                    />) : (
                      <TextField
                      name="BonusDetail"
                      variant="outlined"
                      multiline
                      rows={4}
                      style={{marginLeft: '0.5rem'}}
                      value={ManageSalary.BonusDetail || ""}
                      onChange={handleInputChange}
                    />
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container item xs={12} className={classes.root} >
                <Grid item xs={6} justify="flex-end" alignContent="flex-end">
                  <Typography variant="body1" align="right" style={{marginTop: '2.1rem'}}>วันที่และเวลา</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined">
                    {errorCreateAt ? (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        error
                        margin="normal"
                        id="Day"
                        label="Day picker"
                        format="yyyy-MM-dd"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        style={{marginLeft: '0.5rem'}}
                        />
                        <div></div>
                        <KeyboardTimePicker
                          error
                          margin="normal"
                          id="time-picker"
                          label="Time picker"
                          format="HH:mm"
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                          style={{marginLeft: '0.5rem'}}
                          helperText="!ต้องไม่เป็นวันที่ในอดีต"
                        />
                    </MuiPickersUtilsProvider>) : (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="Day"
                        label="Day picker"
                        format="yyyy-MM-dd"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        style={{marginLeft: '0.5rem'}}
                        />
                        <div></div>
                        <KeyboardTimePicker
                          margin="normal"
                          id="time-picker"
                          label="Time picker"
                          format="HH:mm"
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                          style={{marginLeft: '0.5rem'}}
                        />
                    </MuiPickersUtilsProvider>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} style={{marginTop: '1.5rem'}}>
          <Button component={RouterLink} to="/" variant="contained" onClick={cancelUpdateMS}>
            Back
          </Button>
          <Button
            style={{ float: "right" }}
            onClick={submit}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}
 
export default SalaryCreate;