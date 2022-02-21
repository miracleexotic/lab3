import React, { MouseEvent, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton  from "@material-ui/core/IconButton";
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import PersonPinIcon from "@material-ui/icons/PersonPin";
import ShoppingCartIcon from  "@material-ui/icons/ShoppingCart";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StorefrontIcon from "@material-ui/icons/Storefront";
import HistoryIcon from "@material-ui/icons/History";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import EditIcon from "@material-ui/icons/Edit";
import { UsersInterface } from "../models/ISignIn";

const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    root: { 
      display: "flex",
      flexGrow: 1,
    },
    title: { flexGrow: 1 },
    menuButton: { marginRight: theme.spacing(2) },
    drawer: { width: "600" },
    list: { paddingLeft: theme.spacing(2) },
    menuBox: { 
      padding: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
));

export default function NavBar() {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [user, setUser] = useState<UsersInterface>();
  const [role, setRole] = useState("");

  const toggleDrawer = (state: boolean) => (event: any) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpenDrawer(state);
  }

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const customerMenu = [
    { name: "สมัครสมาชิกพรีเมียม", icon: <PersonPinIcon  />, path: "/member/membership" },
    { name: "ชำระสินค้า", icon: <ShoppingCartIcon  />, path: "/member/order" },
    { name: "ประวัติการชำระสินค้า", icon: <HistoryIcon  />, path: "/member/order-history" },
  ]
  const employeeMenu = [
    { name: "จัดการสต็อกสินค้า", icon: <EditIcon />, path: "/employee/CreateProductstock" },
    { name: "จัดการสินค้า", icon: <EditIcon />, path: "/employee/CreateProduct" },
    { name: "ดูรายการสต็อกสินค้า", icon: <AssignmentIcon  />, path: "/employee/Productstock" },
    { name: "จัดการโปรโมชั่น", icon: <StorefrontIcon  />, path: "/employee/manage-promotion" },
    { name: "ประวัติโปรโมชั่น", icon: <HistoryIcon />, path: "/employee/history-promotion" },
  ]
  const managerMenu = [
    { name: "จัดการตารางงานพนักงาน", icon: <AssignmentIcon  />, path: "/manager/manage-schedule/create" },
    { name: "ข้อมูลตารางงานพนักงาน", icon: <AssignmentIcon  />, path: "/manager/manage-schedule/table" },
    { name: "จัดการเงินเดือนพนักงาน", icon: <AttachMoneyIcon  />, path: "/manager/manage-salary/create" },
    { name: "รายละเอียดเงินเดือนพนักงาน", icon: <AttachMoneyIcon  />, path: "/manager/manage-salary/detail" },
  ]
  
  var menu: any[];
  switch (role) {
    case "Member" :
      menu = customerMenu;
      break;
    case "Employee" :
      switch (user?.Position.PositionName) {
        case "Employee" :
          menu = employeeMenu;
          break;
        case "Manager" :
          menu = managerMenu;
          break;
        default :
          menu = [];
          break;
      }
      break;
    default :
      menu = [];
      break;
  }

  const getRole = () => {
    if (role === "Member")
      return "ลูกค้า";
    else if (role === "Employee") 
      return user?.Position.PositionName === "Employee" ? "พนักงาน" : (user?.Position.PositionName === "Manager" ? "ผู้จัดการ" : "");
    else  
      return "";
  }

  const SignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setUser(JSON.parse(localStorage.getItem("user") || ""));
      setRole(localStorage.getItem("role") || "");
    } 
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            onClick={toggleDrawer(true)} 
            edge="start" 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>          
          <Drawer open={openDrawer} onClose={toggleDrawer(false)} className={classes.drawer} >
            <List   
              onClick={toggleDrawer(false)} 
              onKeyDown={toggleDrawer(false)}
            >
              <ListItem button component={RouterLink} to="/">
                <ListItemText>
                  <Typography component="h1" variant="h5" >
                    <b>ระบบ Farm Mart</b>
                  </Typography>
                  <Typography variant="subtitle2" >
                    Team 06
                  </Typography>
                </ListItemText>
              </ListItem>
              {menu.map((item, index) => (
                <ListItem key={index} button component={RouterLink} to={item.path}>
                  <Button startIcon={item.icon} disableRipple style={{ backgroundColor: 'transparent' }}>
                    <Box>{item.name}</Box>
                  </Button>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Box className={classes.title}>
            <Button
              component={RouterLink}
              to="/" 
              style={{ 
                textTransform: "none", 
                backgroundColor: "transparent", 
                borderRadius: 0
              }}
            >
              <Typography variant="h6" style={{ color: "white" }}>
                ระบบ Farm Mart
              </Typography>
            </Button>
          </Box>
          <IconButton 
            onClick={handleMenu}
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",              
            }}
            getContentAnchorEl={null}
            open={openMenu}
            onClose={handleClose}
          >
            <Box className={classes.menuBox}>
              <Typography variant="subtitle1" noWrap>
                <b>{user?.UserDetail.Prefix.PrefixName}{user?.UserDetail.FirstName} {user?.UserDetail.LastName}</b>
              </Typography>
              <Typography variant="body2" color="inherit" noWrap>
                {getRole()}
              </Typography>
            </Box>
            <MenuItem onClick={SignOut}><ExitToAppIcon style={{ marginRight: ".5rem" }}/>Log out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}