import React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {
    Divider,
    Grid,
    Snackbar,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"
import { ManageWorkTimeInterface } from "../../models/IManageWorkTime";
import { format } from 'date-fns';

import AddCircleIcon from '@material-ui/icons/AddCircle';


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: "100%",
            marginTop: "20px"
        },
        container: {
            maxHeight: 440,
            marginTop: theme.spacing(2)
        },
        table: {
            minWidth: 650,
        },
        tableSpace: {
            marginTop: 20,
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
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

export default function ScheduleTable() {
    const classes = useStyles();
    const [manageWorkTime, setManageWorkTime] = useState<ManageWorkTimeInterface[]>([]);
    const BaseURL = "http://127.0.0.1:8080";
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [saveID, setSaveID] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [openAlertSucess, setOpenAlertSucess] = useState(false);
    const [openAlertError, setOpenAlertError] = useState(false);
    const handleCloseAlert = () => {
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

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveID = (mwID: any) => {
        setSaveID(mwID);
        setOpen(true);
    }

    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };
    const getAllManageWorkTime = async () => {
        fetch(`${BaseURL}/manage/all`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                // console.log(res.data);
                if (res.data) {
                    setManageWorkTime(res.data);
                } else {
                    console.log("else");
                }
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        getAllManageWorkTime();
    }, []);

    const deleteManageWorkTime = async () => {
        handleClose();
        const request = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${BaseURL}/manage/${saveID}`, request)
            .then(response => response.text())
            .then((result) => {
                console.log(result)
                getAllManageWorkTime();
                setOpenAlertSucess(true);
                handleClose();
            })
            .catch((error) => {
                console.log('error', error);
                getAllManageWorkTime();
                setOpenAlertError(true);
                handleClose();
            });
    }

    return (
        <Container className={classes.container} maxWidth="md">
            <Snackbar open={openAlertSucess} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    ลบข้อมูลสำเร็จ
                </Alert>
            </Snackbar>
            <Snackbar open={openAlertError} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="error">
                    ลบข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>
            <Paper className={classes.root}>
                <Box>
                    <Box flexGrow={1}>
                        <Typography
                            style={{ marginBottom: '0.5rem', marginLeft: '30px', marginTop: "20px" }}
                            component="h2"
                            variant="h5"
                            color="primary"
                            gutterBottom
                        >
                            ข้อมูลการจัดตารางงาน
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            style={{ float: "right", marginBottom: '0.5rem', marginRight: '30px', marginTop: "20px" }}
                            component={RouterLink}
                            to="/manager/manage-schedule/create"
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleIcon />}
                        >
                            สร้างข้อมูล
                        </Button>
                    </Box>
                </Box>
                <Divider />
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                    ลำดับ
                                </StyledTableHead>
                                <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                    ชื่อพนักงาน
                                </StyledTableHead>
                                <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                    ตำแหน่ง
                                </StyledTableHead>
                                <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                    ความคิดเห็น
                                </StyledTableHead>
                                {/* <StyledTableHead align="center" style={{ maxWidth: "20%" }}>
                                    สัปดาห์ที่
                                </StyledTableHead> */}
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
                            {manageWorkTime.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={item.ID}>
                                        <TableCell align="center">{item.ID}</TableCell>
                                        <TableCell align="center">{item.Employee.UserDetail.FirstName}</TableCell>
                                        <TableCell align="center">{item.Employee.Position.PositionNameTH}</TableCell>
                                        {item.Comment.length <= 15 ? (<TableCell align="center">{item.Comment}</TableCell>) :
                                            (<TableCell align="center">{item.Comment.substring(0, 5)}...{item.Comment.substring(item.Comment.length - 5, item.Comment.length)}</TableCell>)}
                                        <TableCell align="center">{item.Day.DayNumber}</TableCell>
                                        <TableCell align="center">{item.Month.MonthOfYear}</TableCell>
                                        <TableCell align="center">{item.StartWorkTime.TimeStart}</TableCell>
                                        <TableCell align="center">{item.EndWorkTime.TimeEnd}</TableCell>
                                        <TableCell align="center">{item.TimeTotal}</TableCell>
                                        <TableCell align="center">{format((new Date(item.WorkingDate)), 'dd/MMMM/yyyy')}</TableCell>
                                        <TableCell align="center">
                                            <IconButton aria-label="delete">
                                                <DeleteIcon onClick={() => handleSaveID(item.ID)} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={manageWorkTime.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                // onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">คุณต้องการลบข้อมูลใช่หรือไม่ ?</h2>
                        <Grid container spacing={5}>
                            <Grid item xs={6} container direction="row" justifyContent="flex-start" alignContent="flex-start">
                                <Button
                                    style={{ float: "right" }}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={deleteManageWorkTime}
                                >
                                    ใช่
                                </Button>
                            </Grid>
                            <Grid item xs={6} container direction="row" justifyContent="flex-end" alignContent="flex-end">
                                <Button
                                    style={{ float: "right" }}
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={handleClose}
                                >
                                    ไม่
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </Container>
    );
}