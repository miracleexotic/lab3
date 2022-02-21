import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ButtonGroup from '@material-ui/core/ButtonGroup';
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
import moment from "moment";
import PropTypes from 'prop-types'; 
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { EmployeesInterface } from "../../models/IUser";
import { ManageWorkTimeInterface } from "../../models/IManageWorkTime";
import { AssessmentInterface, BonusStatusInterface, ManageSalaryInterface } from "../../models/IManageSalary";

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

function Row(props: any) {
  const { emp } = props;
  const [openRow, setOpenRow] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleClickOpenDialog = (id: string) => {
    setOpenDialog(true);
    setCancelMS(id)
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [employeeManageSalaries, setEmployeeManageSalaries] = React.useState<ManageSalaryInterface[]>([]);
  function getManageSalaries() {
    const apiUrl = "http://localhost:8080/managesalary/employee/"+emp.ID;
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
          setEmployeeManageSalaries(res.data)
        }
      });
  }

  const [employeeManageWorkTime, setEmployeeManageWorkTime] = React.useState<ManageWorkTimeInterface[]>([]);
  function getManageWorkTime() {
    const apiUrl = "http://localhost:8080/managesalary/manageworktime/"+emp.ID;
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
          setEmployeeManageWorkTime(res.data)
        }
      });
  }

  const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const [cancelMS, setCancelMS] = useState<string>('')
  const handleCancel = async () => {
    setOpenDialog(false);
    const apiUrl = "http://localhost:8080/managesalary/"+cancelMS;
    const requestOptions = {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const reponse = await fetch(apiUrl, requestOptions);

    const res = await reponse.json()
    if (res.data) {
      console.log(res.data)
      await sleep(1000)
      window.location.reload()
    } else {
      console.log(res.data)
    }
  }

  function handleEdit(msID: string) {
    localStorage.setItem("update_status", "true")
    localStorage.setItem("update_msID", msID)
  }

  React.useEffect(() => {
    getManageSalaries()
    getManageWorkTime()
  }, [])

  let total_last = emp.Position.Salary
  if (employeeManageSalaries.length != 0) {
    total_last += (employeeManageSalaries[employeeManageSalaries.length-1].BonusStatusID != 1 ? employeeManageSalaries[employeeManageSalaries.length-1].BonusAmount : 0);
  }
  
  return (
   <React.Fragment>
     <TableRow key={emp.ID}>
       <TableCell>
         <IconButton aria-label="expand row" size="small" onClick={() => setOpenRow(!openRow)}>
           {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
         </IconButton>
       </TableCell>
       <TableCell align="center">{emp.ID}</TableCell>
       {/* <TableCell align="center">{emp.Detail.Code}</TableCell> */}
       <TableCell align="center">{emp.UserDetail.FirstName+" "+emp.UserDetail.LastName}</TableCell>
       <TableCell align="center">{emp.Position.PositionNameTH}</TableCell>
       <TableCell align="center">{emp.UserDetail.PhoneNumber}</TableCell>
       <TableCell align="center">{(total_last).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</TableCell>
     </TableRow>
     <TableRow>
       <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
         <Collapse in={openRow} timeout="auto" unmountOnExit>
           <Box margin={1}>
             <Typography variant="h6" gutterBottom component="div">
               เวลาทำงาน
             </Typography>
             <Table size="small" aria-label="purchases">
               <TableHead>
                 <TableRow>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>ID</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>Schedule</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>Day</TableCell>
                   {/* <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>Weekly</TableCell> */}
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>Mouth</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>WorkingDate</TableCell>
                   {/* <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>Time</TableCell> */}
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>TimeTotal (hr)</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {employeeManageWorkTime.map((mwt: ManageWorkTimeInterface) => (  
                   <TableRow key={mwt.ID} hover >
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

           <Box margin={1}>
             <Typography variant="h6" gutterBottom component="div">
               ประวัติการรับเงินโบนัส
             </Typography>
             <Table size="small" aria-label="purchases">
               <TableHead>
                 <TableRow>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>ระดับการประเมิน</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>หมายเหตุ</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>สถานะการจ่ายเงินโบนัส</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>วันที่และเวลา</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>จำนวนเงินโบนัส (บาท)</TableCell>
                   <TableCell align="center" style={{backgroundColor: '#757575', color: '#ffffff'}}>แก้ไข/ลบ</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {employeeManageSalaries.map((ms: ManageSalaryInterface) => (
                   <TableRow key={ms.ID} hover >
                     <TableCell component="th" scope="row" align="center">{ms.Assessment.Level+" = "+ms.Assessment.Name}</TableCell>
                     <TableCell align="center">{ms.BonusDetail}</TableCell>
                     <TableCell align="center" style={{color: (ms.BonusStatus.ID != 1 ? '#03ac13' : '#ff0000')}}>{ms.BonusStatus.Name}</TableCell>
                     <TableCell align="center">{moment(ms.CreateAt).format("DD/MM/YYYY")}</TableCell>
                     <TableCell align="right">{(ms.BonusAmount).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</TableCell>
                     <TableCell>
                       <ButtonGroup disableElevation variant="contained" color="primary">
                         { ms.BonusStatus.ID != 1 ? (<Button size="small" disabled><EditIcon fontSize="small"/></Button>) :
                         (<Button 
                            size="small" 
                            onClick={() => handleEdit(ms.ID.toString())}
                            component={RouterLink} to="/manager/manage-salary/create"
                         >
                           <EditIcon fontSize="small"/>
                         </Button>)}
                         <Button 
                            size="small"
                            color="secondary"
                            onClick={() => handleClickOpenDialog(ms.ID.toString())}
                         >
                           <DeleteForeverIcon fontSize="small"/>
                         </Button>
                         <Dialog
                           open={openDialog}
                           onClose={handleCloseDialog}
                           aria-labelledby="alert-dialog-title"
                           aria-describedby="alert-dialog-description"
                         >
                           <DialogTitle id="alert-dialog-title">{"ต้องการลบข้อมูลเงินโบนัสใช่หรือไม่?"}</DialogTitle>
                           <DialogContent>
                             <DialogContentText id="alert-dialog-description">
                               ⚠️ หากลบข้อมูลแล้ว <b>จะไม่สามารถกู้คืนข้อมูลได้ </b>
                             </DialogContentText>
                             <DialogContentText>
                               หมายเหตุ : ถ้าต้องการแก้ไขสามารถกดปุ่มแก้ไขแทนได้ หากแก้ไขไม่ได้ หมายความว่า ข้อมูลนั้นได้รับการอนุมัติแล้ว
                             </DialogContentText>
                           </DialogContent>
                           <DialogActions>
                             <Button onClick={handleCloseDialog} color="primary">
                               ยกเลิก
                             </Button>
                             <Button onClick={handleCancel} color="primary" autoFocus>
                               ยอมรับ
                             </Button>
                           </DialogActions>
                         </Dialog>
                       </ButtonGroup>
                     </TableCell>
                   </TableRow>
                 ))}
                 <TableRow>
                   <TableCell />
                   <TableCell />
                   <TableCell />
                   <TableCell colSpan={1} align="left">เงินประจำตำแหน่ง</TableCell>
                   <TableCell align="right">{(emp.Position.Salary).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</TableCell>
                   <TableCell/>
                 </TableRow>
                 <TableRow>
                   <TableCell />
                   <TableCell />
                   <TableCell />
                   <TableCell colSpan={1} align="left"><b>รวมทั้งสิ้น</b></TableCell>
                   <TableCell align="right"><b>{(total_last).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</b></TableCell>
                   <TableCell/>
                 </TableRow>
               </TableBody>
             </Table>
           </Box>
         </Collapse>
       </TableCell>
     </TableRow>
   </React.Fragment>
  )
}
 
Row.propTypes = {
    emp: PropTypes.object
}
 
function SalaryDetail() {
 const classes = useStyles();

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

 React.useEffect(() => {
  getEmployees()
 }, [])

  return (     
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
              ข้อมูลเงินเดือนพนักงาน
            </Typography>
          </Box>
          <Button
            style={{ float: "right", marginBottom: '0.5rem', marginRight: '0.7rem' }}
            component={RouterLink} to="/manager/manage-salary/create"
            variant="contained"
            color="primary"
          >
            สร้างข้อมูล
          </Button>
        </Box>

        <Divider />

        <Grid container className={classes.root}>
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
                      เบอร์โทร
                    </StyledTableHead>
                    <StyledTableHead align="center" width="15%">
                      เงินเดือน (บาท)
                    </StyledTableHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((emp: EmployeesInterface) => (
                      <Row emp={emp}/>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        
        <Grid item xs={12} style={{marginTop: '1.5rem'}}>
          <Button component={RouterLink} to="/" variant="contained">
            Back
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}
 
export default SalaryDetail;