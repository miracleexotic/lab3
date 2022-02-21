import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Theme, makeStyles, createStyles } from "@material-ui/core";

import PersonPinIcon from "@material-ui/icons/PersonPin";
import ShoppingCartIcon from  "@material-ui/icons/ShoppingCart";
import StorefrontIcon from '@material-ui/icons/Storefront';
import StoreIcon from '@material-ui/icons/Store';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { UsersInterface } from "../models/ISignIn";


const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    // root: { flexGrow: 1 },
    container: { 
      marginTop: theme.spacing(2),
    },
    paper: { 
      padding: theme.spacing(2),
    },
    paperColumn: { 
      padding: theme.spacing(2), 
    },
    paperMenu: { 
      padding: theme.spacing(2), 
      marginButtom: theme.spacing(2), 
    },
    memberColumn :{
      padding: theme.spacing(2),
      backgroundColor: "#81c784",
    },
    employeeColumn :{
      padding: theme.spacing(2),
      backgroundColor: "#81d4fa",
    },
    managerColumn :{
      padding: theme.spacing(2),
      backgroundColor: "#ffab91",
    },
    subsystemIcon: {
      paddingTop: ".5rem",
      width: "48px", 
      height: "48px"
    },
    memberButton: {
      backgroundColor: "#4caf50",
      color: "white",
      marginBottom: ".25rem",
      '&:hover': { backgroundColor: "#388e3c", },
    },
    employeeButton: {
      backgroundColor: "#1976d2",
      color: "white",
      marginBottom: ".25rem",
      '&:hover': { backgroundColor: "#0d47a1", },
    },
    managerButton: {
      backgroundColor: "#e64a19",
      color: "white",
      marginBottom: ".25rem",
      '&:hover': { backgroundColor: "#bf360c", },
    },
  })
);

export default function Home() {
  const classes = useStyles();
  
  const user: UsersInterface = JSON.parse(localStorage.getItem("user") || "");
  const [role, setRole] = useState<string>("");

  const checkRole = (checker: string) => {
    if (role === "Member") {
      return role === checker ? true : false;
    }
    else if (role === "Employee") {
      const position = user.Position.PositionName;
      if (position === "Employee") {
        return position === checker ? true : false;
      } 
      else if (position === "Manager") {
        return position === checker ? true : false;
      }
    }
    return false;
  }

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setRole(localStorage.getItem("role") || "");
    } 
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="lg">
        <Paper className={classes.paper} elevation={5}>
          <Grid container>
            {/* Header */}
            {/* Member menu */}
            <Grid item xs={4} style={{ padding:".25rem"}}>
              <Paper className={classes.memberColumn}>
                <Typography component="h4" variant="h6" gutterBottom>
                  <b>สมาชิก</b>
                </Typography>

                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: "1rem"}}>
                    <Paper className={classes.paperColumn} elevation={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        <u>ระบบย่อย ระบบสมาชิกพรีเมียม</u>
                      </Typography>
                      <Grid container>
                        <Grid item xs={4} style={{ paddingRight: ".5rem"}}>
                          <Box textAlign="center" style={{ width: "100%", height: "100%" }}  >
                            <PersonPinIcon className={classes.subsystemIcon} />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Button 
                            disabled={!checkRole("Member")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.memberButton}
                            component={RouterLink}
                            to="/member/membership"
                          >
                            สมัครสมาชิกพรีเมียม
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} style={{ marginBottom: "1rem"}}>
                    <Paper className={classes.paperColumn} elevation={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        <u>ระบบย่อย ระบบชำระสินค้า</u>
                      </Typography>
                      <Grid container>
                        <Grid item xs={4} style={{ paddingRight: ".5rem"}}>
                          <Box textAlign="center" style={{ width: "100%", height: "100%" }}  >
                            <ShoppingCartIcon className={classes.subsystemIcon} />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Button 
                            disabled={!checkRole("Member")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.memberButton}
                            component={RouterLink}
                            to="/member/order"
                          >
                            ชำระสินค้า
                          </Button>
                          <Button 
                            disabled={!checkRole("Member")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.memberButton}
                            component={RouterLink}
                            to="/member/order-history"
                          >
                            ประวัติการชำระสินค้า
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>

              </Paper>
            </Grid>

            {/* Employee menu */}
            <Grid item xs={4} style={{ padding:".25rem"}}>
              <Paper className={classes.employeeColumn}>
                <Typography component="h4" variant="h6" gutterBottom>
                  <b>พนักงาน</b>
                </Typography>

                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: "1rem"}}>
                    <Paper className={classes.paperColumn} elevation={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        <u>ระบบย่อย ระบบจัดการโปรโมชั่น</u>
                      </Typography>
                      <Grid container>
                        <Grid item xs={4} style={{ paddingRight: ".5rem"}}>
                          <Box textAlign="center" style={{ width: "100%", height: "100%" }}  >
                            <StorefrontIcon  className={classes.subsystemIcon} />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Button 
                            disabled={!checkRole("Employee")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.employeeButton}
                            component={RouterLink}
                            to="/employee/manage-promotion"
                          >
                            จัดการโปรโมชั่น
                          </Button>
                          <Button 
                            disabled={!checkRole("Employee")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.employeeButton}
                            component={RouterLink}
                            to="/employee/history-promotion"
                          >
                            ประวัติโปรโมชั่น
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} style={{ marginBottom: "1rem"}}>
                    <Paper className={classes.paperColumn} elevation={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        <u>ระบบย่อย ระบบบันทึกสินค้าเข้าคลังฟาร์มมาร์ท</u>
                      </Typography>
                      <Grid container>
                        <Grid item xs={4} style={{ paddingRight: ".5rem"}}>
                          <Box textAlign="center" style={{ width: "100%", height: "100%" }}  >
                            <StoreIcon  className={classes.subsystemIcon} />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Button 
                            disabled={!checkRole("Employee")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.employeeButton}
                            component={RouterLink}
                            to="/employee/CreateProduct"
                          >
                            จัดการสินค้า
                          </Button>
                          <Button 
                            disabled={!checkRole("Employee")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.employeeButton}
                            component={RouterLink}
                            to="/employee/CreateProductstock"
                          >
                            จัดการสต็อกสินค้า
                          </Button>
                          <Button 
                            disabled={!checkRole("Employee")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.employeeButton}
                            component={RouterLink}
                            to="/employee/Productstock"
                          >
                            ดูรายการสต็อกสินค้า
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Manager menu */}
            <Grid item xs={4} style={{ padding:".25rem"}}>
              <Paper className={classes.managerColumn} >
                <Typography component="h4" variant="h6" gutterBottom>
                  <b>ผู้จัดการ</b>
                </Typography>
                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: "1rem"}}>
                    <Paper className={classes.paperColumn} elevation={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        <u>ระบบย่อย ระบบจัดการเวลาพนักงาน</u>
                      </Typography>
                      <Grid container>
                        <Grid item xs={4} style={{ paddingRight: ".5rem"}}>
                          <Box textAlign="center" style={{ width: "100%", height: "100%" }}  >
                            <AssignmentIcon  className={classes.subsystemIcon} />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Button 
                            disabled={!checkRole("Manager")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.managerButton}
                            component={RouterLink}
                            to="/manager/manage-schedule/create"
                          >
                            จัดตารางงาน
                          </Button>
                          <Button 
                            disabled={!checkRole("Manager")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.managerButton}
                            component={RouterLink}
                            to="/manager/manage-schedule/table"
                          >
                            ข้อมูลการจัดตารางงาน
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} style={{ marginBottom: "1rem"}}>
                    <Paper className={classes.paperColumn} elevation={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        <u>ระบบย่อย ระบบจัดการเงินเดือนพนักงาน</u>
                      </Typography>
                      <Grid container>
                        <Grid item xs={4} style={{ paddingRight: ".5rem"}}>
                          <Box textAlign="center" style={{ width: "100%", height: "100%" }}  >
                            <AttachMoneyIcon  className={classes.subsystemIcon} />
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Button 
                            disabled={!checkRole("Manager")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.managerButton}
                            component={RouterLink}
                            to="/manager/manage-salary/create"
                          >
                            จัดการเงินเดือนพนักงาน
                          </Button>
                          <Button 
                            disabled={!checkRole("Manager")} 
                            fullWidth 
                            variant="contained" 
                            className={classes.managerButton}
                            component={RouterLink}
                            to="/manager/manage-salary/detail"
                          >
                            รายละเอียดเงินเดือนพนักงาน
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}