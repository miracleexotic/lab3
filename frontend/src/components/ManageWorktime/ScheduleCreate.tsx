import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    createStyles,
    makeStyles,
    Theme,
    withStyles,
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormControl from '@material-ui/core/FormControl';
import {
    Grid,
    Paper,
    Select,
    Button,
    Snackbar,
    MenuItem,
    InputLabel,
    Divider
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"
import TextField from '@material-ui/core/TextField';
import {
    MuiPickersUtilsProvider,
    DatePicker
} from "@material-ui/pickers";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DateFnsUtils from "@date-io/date-fns";
import { format } from 'date-fns';

import TableChartIcon from '@material-ui/icons/TableChart';

import {
    DayInterface,
    MonthInterface,
    StartWorkTimeInterface,
    EndWorkTimeInterface,
    ManageWorkTimeInterface
} from '../../models/IManageWorkTime'
import { EmployeesInterface } from "../../models/IUser";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 5,
        },
        container: {
            marginTop: theme.spacing(2),
        },
        table: {
            minWidth: 650,
        },
        tableSpace: {
            marginTop: 20,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 200,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        margin: {
            margin: theme.spacing(1),
        },
        containerTable: {
            maxHeight: 400,
        },
        rootCard: {
            minWidth: 275,
        },
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

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ScheduleCreate() {
    const classes = useStyles();
    const [employee, setEmployee] = useState<EmployeesInterface[]>([]);
    const [day, setDay] = useState<DayInterface[]>([]);
    const [month, setMonth] = useState<MonthInterface[]>([]);
    const [startWorkTime, setStartWorkingTime] = useState<StartWorkTimeInterface[]>([]);
    const [endWorkTime, setEndWorkingTime] = useState<EndWorkTimeInterface[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [manageWorkTime, setManageWorkTime] = useState<Partial<ManageWorkTimeInterface>>({});
    const [allManageWorkTime, setAllManageWorkTime] = useState<ManageWorkTimeInterface[]>([]);
    const [allDayOfMonth, setAllDayOfMonth] = useState<number>(0);
    const [createdDayWorking, setCreatedDayWorking] = useState<number[]>([]);
    const [selectMwtByEm, setselectMwtByEm] = useState<ManageWorkTimeInterface[]>([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [openAlertSucess, setOpenAlertSucess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorComment, setErrorComment] = useState(false);
    const [errorWorkingDate, setErrorWorkingDate] = useState(false);
    const [errorTimeTotal, setErrorTimeTotal] = useState(false);
    const handleClose = () => {
        setErrorMessage("");
        setOpenAlertSucess(false);
        setOpenAlertError(false);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const BaseURL = "http://127.0.0.1:8080";
    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };
    const getCreatedDay = (emId: any, mId: any) => {
        const saveDay: any = [];
        // eslint-disable-next-line
        allManageWorkTime.map((item: ManageWorkTimeInterface) => {
            // console.log(manageWorkTime.MonthID)
            if (item.EmployeeID === emId && item.MonthID === mId) {
                saveDay.push(item.Day.DayNumber)
            }
        });
        setCreatedDayWorking(saveDay);
    }

    const getWeeksInMonth = (month: any) => {
        let date = new Date(),
            year = date.getFullYear(),
            tMonth = month - 1
        const lastDate = new Date(year, tMonth + 1, 0),
            numDays = lastDate.getDate();
        setAllDayOfMonth(numDays);
    }

    const getSelectManageByEmployee = (emId: any, mwt: any) => {
        const tempManage = mwt;
        const tempData: any = [];
        for (const data of tempManage) {
            if (data.EmployeeID === emId) {
                tempData.push(data)
            }
        }
        setselectMwtByEm(tempData)
    }
    const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        // console.log(event.target.name, event.target.value)
        const name = event.target.name as keyof typeof manageWorkTime;
        if (name === "EmployeeID") {
            getSelectManageByEmployee(event.target.value, allManageWorkTime)
            getCreatedDay(event.target.value, manageWorkTime.MonthID);
        } else if (name === "StartWorkTimeID" || name === "EndWorkTimeID") {
            setErrorTimeTotal(false);
            if (name === "StartWorkTimeID" && !manageWorkTime.EndWorkTimeID) {
                manageWorkTime.TimeTotal = 0;
            } else if (name === "StartWorkTimeID" && manageWorkTime.EndWorkTimeID) {
                // let start = startWorkTime.filter(val => val.ID === event.target.value)
                // let end = endWorkTime.filter(val => val.ID === manageWorkTime.EndWorkTimeID)

                // let tStart: number = parseInt(start[0].TimeStart.split(':')[0])
                // let tEnd: number = parseInt(end[0].TimeEnd.split(':')[0])
                // console.log(tStart, tEnd)
                manageWorkTime.EndWorkTimeID = 0;
                manageWorkTime.TimeTotal = 0;
            } else {
                let start = startWorkTime.filter(val => val.ID === manageWorkTime.StartWorkTimeID);
                let end = endWorkTime.filter(val => val.ID === event.target.value);
                let tStart: number = parseInt(start[0].TimeStart.split(':')[0]);
                let tEnd: number = parseInt(end[0].TimeEnd.split(':')[0]);
                // console.log(tStart, tEnd)
                manageWorkTime.TimeTotal = tEnd - tStart;
            }
        } else if (name === "MonthID") {
            manageWorkTime.DayID = manageWorkTime.MonthID !== event.target.value ? 0 : manageWorkTime.DayID;
            getWeeksInMonth(event.target.value);
            getCreatedDay(manageWorkTime.EmployeeID, event.target.value);
        }
        setManageWorkTime({
            ...manageWorkTime,
            [name]: event.target.value,
        });
    };

    const handleInputChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
        const id = event.target.id as keyof typeof manageWorkTime;
        const { value } = event.target;
        if (errorTimeTotal && id === "TimeTotal") setErrorTimeTotal(false);
        if (errorComment && id === "Comment") setErrorComment(false);
        setManageWorkTime({ ...manageWorkTime, [id]: value });
    };

    const handleDateChange = (date: Date | null) => {
        // console.log(date)
        if (errorWorkingDate) setErrorWorkingDate(false);
        setSelectedDate(date);
    };


    const getEmployee = async () => {
        fetch(`${BaseURL}/manage/employee/all`, requestOptions)
            .then(response => response.json())
            .then(res => {
                if (res.data) {
                    // console.log("[GET] Employee => ", res.data);
                    setEmployee(res.data);
                } else {
                    console.log("FAIL!")
                }
            })
            .catch(error => console.log('error', error));
    };
    const getDay = async () => {
        fetch(`${BaseURL}/manage/day/all`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    // console.log("[GET] Day => ", res.data)
                    setDay(res.data)
                } else {
                    console.log("FAIL!")
                }
            })
    };
    const getMonth = async () => {
        fetch(`${BaseURL}/manage/month/all`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    // console.log("[GET] Month => ", res.data)
                    setMonth(res.data)
                } else {
                    console.log("FAIL!")
                }
            })
    };
    const getStartWorkTime = async () => {
        fetch(`${BaseURL}/manage/work/starttime`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    // console.log("[GET] StartWorkTime => ", res.data)
                    setStartWorkingTime(res.data)
                } else {
                    console.log("FAIL!")
                }
            })
    };

    const getEndWorkTime = async () => {
        fetch(`${BaseURL}/manage/work/endtime`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    // console.log("[GET] EndWorkTime => ", res.data)
                    setEndWorkingTime(res.data)
                } else {
                    console.log("FAIL!")
                }
            })
    };

    const getAllManageWorkTime = async () => {
        fetch(`${BaseURL}/manage/all`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    // console.log("[GET] All ManageWorkingTime => ", res.data)
                    setAllManageWorkTime(res.data)
                    getCreatedDay(manageWorkTime.EmployeeID, manageWorkTime.MonthID);
                    getSelectManageByEmployee(manageWorkTime.EmployeeID, res.data);
                } else {
                    console.log("FAIL!")
                }
            })
    }

    useEffect(() => {
        getEmployee();
        getDay();
        getMonth();
        getStartWorkTime();
        getEndWorkTime();
        getAllManageWorkTime();
        // eslint-disable-next-line
    }, []);

    const minDateSelect = () => {
        let date = new Date();
        return date.setDate(date.getDate() - 1);
    }
    const convertType = (data: string | number | undefined) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
    };

    const submit = async () => {
        let data = {
            Comment: manageWorkTime.Comment,
            WorkingDate: selectedDate,
            TimeTotal: convertType(manageWorkTime.TimeTotal),
            EmployeeID: convertType(manageWorkTime.EmployeeID),
            DayID: convertType(manageWorkTime.DayID),
            MonthID: convertType(manageWorkTime.MonthID),
            StartWorkTimeID: convertType(manageWorkTime.StartWorkTimeID),
            EndWorkTimeID: convertType(manageWorkTime.EndWorkTimeID)
        }
        console.log(data)
        const requestOptionsPost = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch(`${BaseURL}/manage/create`, requestOptionsPost)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    console.log("บันทึกได้")
                    getAllManageWorkTime();
                    manageWorkTime.DayID = 0;
                    manageWorkTime.MonthID = 0;
                    manageWorkTime.StartWorkTimeID = 0;
                    manageWorkTime.EndWorkTimeID = 0;
                    manageWorkTime.TimeTotal = 0;
                    setOpenAlertSucess(true);
                } else {
                    console.log("บันทึกไม่ได้")
                    let msg = res.error.toString().replace(/[;]/g, ", ")
                    if (msg.indexOf('Comment') >= 0) {
                        setErrorComment(true);
                    }
                    if (msg.indexOf('WorkingDate') >= 0) {
                        setErrorWorkingDate(true);
                    }
                    if (msg.indexOf('TimeTotal') >= 0) {
                        setErrorTimeTotal(true);
                    }
                    setErrorMessage(msg);
                    setOpenAlertError(true);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <Container className={classes.container} maxWidth="md">
                <Snackbar open={openAlertSucess} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        บันทึกข้อมูลสำเร็จ
                    </Alert>
                </Snackbar>
                <Snackbar open={openAlertError} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        บันทึกข้อมูลไม่สำเร็จ - "{errorMessage}"
                    </Alert>
                </Snackbar>
                <h1 style={{ textAlign: "center" }}>จัดตารางงาน</h1>
                <Paper elevation={2} className={classes.root}>
                    <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                        <Grid item xs={12} style={{ marginTop: "5px", marginRight: "20px" }} container direction="row" justifyContent="flex-end" alignItems="center">
                            <Button
                                component={RouterLink}
                                to="/manager/manage-schedule/table"
                                variant="contained"
                                color="primary"
                                startIcon={<TableChartIcon />}
                            >
                                ข้อมูลทั้งหมด
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={5} style={{ marginTop: "0.7rem" }}>
                        <Grid container style={{ marginLeft: "5rem" }} direction="row" justifyContent="flex-start" alignItems="stretch">
                            <Grid item xs>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel shrink id="Employee">
                                        ชื่อพนักงาน
                                    </InputLabel>
                                    <Select
                                        // native
                                        labelId="Employee"
                                        value={manageWorkTime.EmployeeID || ""}
                                        onChange={handleChange}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{
                                            name: 'EmployeeID',
                                        }}
                                    >
                                        <MenuItem value="" disabled><em>กรุณาเลือกชื่อพนักงาน</em></MenuItem>
                                        {employee.map((item: EmployeesInterface) => (
                                            <MenuItem value={item.ID} key={item.ID}>
                                                {item.UserDetail.FirstName + " " + item.UserDetail.LastName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {/* <FormHelperText>Some important helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            <Grid item xs={10}>
                                <Card className={classes.rootCard}>
                                    <CardContent>
                                        <TableContainer className={classes.containerTable} style={{ maxWidth: "100vw" }}>
                                            <Table stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            ลำดับ
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            ตำแหน่ง
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            ความคิดเห็น
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            วันที่
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            เดือน
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            เวลาเริ่มทำงาน
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            เวลาเลิกทำงาน
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            เวลารวม
                                                        </StyledTableHead>
                                                        <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                                            วันที่สร้าง
                                                        </StyledTableHead>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectMwtByEm.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={item.ID}>
                                                                <TableCell align="center">{item.ID}</TableCell>
                                                                {/* <TableCell align="center">{item.Employee.UserDetail.FirstName}</TableCell> */}
                                                                <TableCell align="center">{item.Employee.Position.PositionNameTH}</TableCell>
                                                                {item.Comment.length <= 20 ? (<TableCell align="center">{item.Comment}</TableCell>) :
                                                                    (<TableCell align="center">{item.Comment.substring(0, 5)}...{item.Comment.substring(item.Comment.length - 5, item.Comment.length)}</TableCell>)}
                                                                <TableCell align="center">{item.Day.DayNumber}</TableCell>
                                                                <TableCell align="center">{item.Month.MonthOfYear}</TableCell>
                                                                <TableCell align="center">{item.StartWorkTime.TimeStart}</TableCell>
                                                                <TableCell align="center">{item.EndWorkTime.TimeEnd}</TableCell>
                                                                <TableCell align="center">{item.TimeTotal}</TableCell>
                                                                <TableCell align="center">{format((new Date(item.WorkingDate)), 'dd/MMMM/yyyy')}</TableCell>
                                                                {/* <TableCell align="center">
                                                            <IconButton aria-label="delete">
                                                                <DeleteIcon onClick={() => handleSaveID(item.ID)} />
                                                            </IconButton>
                                                        </TableCell> */}
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[5]}
                                            component="div"
                                            count={selectMwtByEm.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </CardContent>
                                </Card>

                            </Grid>
                        </Grid>
                        <Grid container spacing={1} justifyContent="center" style={{ marginTop: "0.5rem" }}>
                            <Grid item>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel shrink id="MonthID">
                                        เดือน
                                    </InputLabel>
                                    <Select
                                        // native
                                        value={manageWorkTime.MonthID || ""}
                                        onChange={handleChange}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{
                                            name: 'MonthID'
                                        }}
                                    >
                                        <MenuItem value="" disabled><em>กรุณาเลือกเดือน</em></MenuItem>
                                        {month.map((item: MonthInterface) => (
                                            <MenuItem value={item.ID} key={item.ID}>
                                                {item.MonthOfYear}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {/* <FormHelperText>Some important helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined" className={classes.formControl} disabled={manageWorkTime.MonthID ? false : true}>
                                    <InputLabel shrink id="DayID">
                                        วัน
                                    </InputLabel>
                                    <Select
                                        // native
                                        value={manageWorkTime.DayID || ""}
                                        onChange={handleChange}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{
                                            name: 'DayID'
                                        }}
                                    >
                                        <MenuItem value="" disabled><em>กรุณาเลือกวัน</em></MenuItem>
                                        {(() => {
                                            let items: any = [];
                                            let newDay = day.slice(0, allDayOfMonth)
                                            newDay.map((item: DayInterface) => (
                                                items.push(createdDayWorking.indexOf(parseInt(item.DayNumber)) < 0 ? (
                                                    <MenuItem value={item.ID} key={item.ID}>
                                                        {item.DayNumber}
                                                    </MenuItem>
                                                ) : (
                                                    <MenuItem value={item.ID} key={item.ID} disabled>
                                                        {item.DayNumber} - สร้างตารางแล้ว
                                                    </MenuItem>
                                                ))
                                            ))
                                            return items;
                                        })()}
                                    </Select>
                                    {/* <FormHelperText>Some important helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} direction="row" justifyContent="center">
                            <Grid item>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel shrink id="StartWorkTimeID">
                                        เวลาเริ่มทำงาน
                                    </InputLabel>
                                    <Select
                                        // native
                                        value={manageWorkTime.StartWorkTimeID || ""}
                                        onChange={handleChange}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{
                                            name: 'StartWorkTimeID'
                                        }}
                                    >
                                        <MenuItem value="" disabled><em>กรุณาเลือกเวลาเริ่มทำงาน</em></MenuItem>
                                        {startWorkTime.map((item: StartWorkTimeInterface) => (
                                            <MenuItem value={item.ID} key={item.ID}>
                                                {item.TimeStart}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel shrink id="EndWorkTimeID">
                                        เวลาเลิกทำงาน
                                    </InputLabel>
                                    <Select
                                        // native
                                        disabled={manageWorkTime.StartWorkTimeID ? false : true}
                                        value={manageWorkTime.EndWorkTimeID || ""}
                                        onChange={handleChange}
                                        displayEmpty
                                        className={classes.selectEmpty}
                                        inputProps={{
                                            name: 'EndWorkTimeID'
                                        }}
                                    >
                                        <MenuItem value="" disabled><em>กรุณาเลือกเวลาเลิกทำงาน</em></MenuItem>
                                        {/* {endWorkTime.map((item: EndWorkTimeInterface) => (
                                            <MenuItem value={item.ID} key={item.ID}>
                                                {item.TimeEnd}
                                            </MenuItem>
                                        ))} */}
                                        {(() => {
                                            let items: any = [];
                                            if (manageWorkTime.StartWorkTimeID) {
                                                let start = startWorkTime.filter(val => val.ID === manageWorkTime.StartWorkTimeID);
                                                let tStart: number = parseInt(start[0].TimeStart.split(':')[0]);
                                                endWorkTime.map((item: EndWorkTimeInterface) => (
                                                    items.push(tStart < parseInt(item.TimeEnd.split(':')[0]) ? (
                                                        <MenuItem value={item.ID} key={item.ID}>
                                                            {item.TimeEnd}
                                                        </MenuItem>
                                                    ) : (
                                                        <MenuItem value={item.ID} key={item.ID} disabled>
                                                            {item.TimeEnd}
                                                        </MenuItem>
                                                    ))
                                                ))
                                            }
                                            return items;
                                        })()}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction="row" justifyContent="center" alignContent="center">
                            <Grid item>
                                <p></p>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <TextField
                                        disabled={manageWorkTime.StartWorkTimeID ? false : true}
                                        error={errorTimeTotal}
                                        helperText={errorTimeTotal ? "!เวลาทำงานทั้งหมดต้องไม่น้อยกว่า 6 และไม่เกิน 9 ชม. " : ""}
                                        id="TimeTotal"
                                        name="TimeTotal"
                                        type="number"
                                        variant="outlined"
                                        label="เวลางานทั้งหมด ชม."
                                        value={manageWorkTime.TimeTotal || 0}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction="row" justifyContent="center" alignContent="center">
                            <FormControl variant="outlined">
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        error={errorWorkingDate}
                                        helperText={errorWorkingDate ? "!ต้องเป็นวันปัจจุบัน" : ""}
                                        id="WorkingDate"
                                        name="WorkingDate"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        label="กรุณาเลือกวันที่และเวลา"
                                        minDate={minDateSelect}
                                        format="yyyy/MM/dd"
                                    />
                                </MuiPickersUtilsProvider>
                            </FormControl>
                        </Grid>
                        <Grid container spacing={3} direction="row" justifyContent="center" alignContent="center">
                            <Grid item xs={8}>
                                <form>
                                    <InputLabel shrink id="Comment">
                                        คำอธิบาย - {manageWorkTime.Comment?.length}
                                    </InputLabel>
                                    <TextField
                                        error={errorComment}
                                        helperText={errorComment ? "!ความยาวข้อความต้องไม่เกิน 200 ตัวอักษร" : ""}
                                        id="Comment"
                                        name="Comment"
                                        type="text"
                                        // label="คำอธิบาย"
                                        placeholder="คำอธิบาย"
                                        multiline
                                        rows={5}
                                        fullWidth
                                        variant="filled"
                                        value={manageWorkTime.Comment || ""}
                                        onChange={handleInputChange}
                                    />
                                </form>
                            </Grid>
                        </Grid>
                        <Grid container spacing={5} justifyContent="center" style={{ marginTop: "10px", marginBottom: "5px" }}>
                            <Grid item>
                                <Button
                                    style={{ float: "right" }}
                                    onClick={submit}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                ><b>บันทึก</b></Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div >
    );
}