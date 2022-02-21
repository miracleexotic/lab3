import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/Navbar";

// Product stock
import CreateProductstock from "./components/ProductStock/CreateProductstock";
import Productstock from "./components/ProductStock/ProductStock";
import CreateProduct from "./components/ProductStock/CreateProduct";

// Manage promotion
import ManagePromotion from "./components/ManagePromotion/ManagePromotion";
import Historypromotion from "./components/ManagePromotion/ShowPromotion";

// Purchase order
import PurchaseOrder from "./components/PurchaseOrder/PurchaseOrder";
import OrderHistory from "./components/PurchaseOrder/OrderHistory";

// Manage work time
import ScheduleCreate from "./components/ManageWorktime/ScheduleCreate";
import ScheduleTable from "./components/ManageWorktime/ScheduleTable";

// Manage Salary
import SalaryCreate from "./components/ManageSalary/ManageSalary";
import SalaryDetail from "./components/ManageSalary/ManageSalaryDetail";

// Premium member
import PremiumMember from "./components/PremiumMember/PremiumMember"

import Home from "./components/Home";
import SignIn from "./components/SignIn";

import { UsersInterface } from "./models/ISignIn";

export default function App() {
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<UsersInterface>();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setUser(JSON.parse(localStorage.getItem("user") || ""));
      setToken(getToken);
      setRole(localStorage.getItem("role") || "");
    } 
  }, []);

  if (!token) {
    return <SignIn />
  }
 
  return (
    <Router>
      {
        token && (
          <Fragment>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              {
                role === "Member" && (
                  <>
                    <Route path="/member/membership" element={<PremiumMember />} /> 
                    <Route path="/member/order" element={<PurchaseOrder />} />
                    <Route path="/member/order-history" element={<OrderHistory />} />
                  </>
                )
              }
              {
                (role === "Employee" && user?.Position.PositionName === "Employee") && (
                  <>
                    <Route path ="/employee/manage-promotion" element={<ManagePromotion />} />
                    <Route path ="/employee/history-promotion" element={<Historypromotion />} />
                    <Route path="/employee/Productstock" element={<Productstock />} />
                    <Route path="/employee/CreateProductstock" element={<CreateProductstock/>} />
                    <Route path="/employee/CreateProduct" element={<CreateProduct/>} />
                  </>
                )
              }
              {
                (role === "Employee" && user?.Position.PositionName === "Manager") && (
                  <>
                    <Route path="/manager/manage-salary/create" element={<SalaryCreate />} />
                    <Route path="/manager/manage-salary/detail" element={<SalaryDetail />} />
                    <Route path="/manager/manage-schedule/create" element={<ScheduleCreate />} />
                    <Route path="/manager/manage-schedule/table" element={<ScheduleTable />} />
                  </>
                )
              }
            </Routes>
          </Fragment>
        )
      }
      
    </Router>
  );
}