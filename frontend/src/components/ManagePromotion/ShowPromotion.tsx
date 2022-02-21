import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import moment from "moment";

import { ManagePromotionsInterface } from "../../models/IManagePromotion";
import { EmployeesInterface } from "../../models/IUser";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { marginTop: theme.spacing(2) },

    table: { minWidth: 650 },

    tableSpace: { marginTop: 20 },
  })
);

export default function Historypromotion() {
  const classes = useStyles();

  const [managepromotion, setmanagepromotion] = React.useState<ManagePromotionsInterface[]>([]);

  //เเก้เป็น getmanagepromotion
  //รับข้อมูลมาจาก DB
  const users: EmployeesInterface = JSON.parse(
    localStorage.getItem("user") || ""
  );
  const getmanagepromotion = async () => {
    const apiUrl = `http://localhost:8080/listpromotion`;

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
          setmanagepromotion(res.data);
        } else {
          console.log("else");
        }
      });
  };



  //เพื่อให้มีการดึงข้อมูลใส่ combobox ตอนเริ่มต้นเเค่ครั้งเดียว
  //
  useEffect(() => {
    getmanagepromotion();
  }, []);
  return (
    <div>
      <Container className={classes.container} maxWidth="lg">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              รายการโปรโมชั่น
            </Typography>
          </Box>
   
          <Box>
            <Button
              component={RouterLink}
              to="/employee/manage-promotion"
              variant="contained"
              color="primary"
            >
              จัดการโปรโมชั่น
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell align="left" width="8%">
                  รหัสโปรโมชั่น
                </TableCell> 

                <TableCell align="left" width="8%">
                  ชื่อโปรโมชั่น
                </TableCell>

                <TableCell align="center" width="12%">
                  เวลาเริ่มโปรโมชั่น
                </TableCell>

                <TableCell align="center" width="12%">
                  เวลาสิ้นสุดโปรโมชั่น
                </TableCell>

                <TableCell align="center" width="10%">
                  ชนิดโปรโมชั่น
                </TableCell>

                <TableCell align="center" width="7%">
                  ราคาขั้นต่ำ
                </TableCell>

                <TableCell align="center" width="7%">
                  ราคาที่ลด
                </TableCell>
               

                <TableCell align="center" width="12%">
                  เวลาที่บันทึกโปรโมชั่น
                </TableCell>

                
              </TableRow>
            </TableHead>

            <TableBody>
              {managepromotion.map((managepromotion: ManagePromotionsInterface) => (
                <TableRow key={managepromotion.ID}>
                  <TableCell align="left">{managepromotion.PromotionCode}</TableCell>

                  <TableCell align="left">{managepromotion.NamePromotion.Name}</TableCell>

                  <TableCell align="left">{moment(managepromotion.PromotionPeriod.StartDate).format("DD/MM/YYYY hh:mm A")}</TableCell>

                  <TableCell align="left">{moment(managepromotion.PromotionPeriod.EndDate).format("DD/MM/YYYY hh:mm A")}</TableCell>

                  <TableCell align="center">{managepromotion.PromotionType.Type}</TableCell>

                  <TableCell align="center">{managepromotion.MinPrice}</TableCell> 

                  <TableCell align="center">{managepromotion.Discount}</TableCell>

                  <TableCell align="center">{moment(managepromotion.Createdatetime).format("DD/MM/YYYY hh:mm A")}</TableCell> 
                              
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}


