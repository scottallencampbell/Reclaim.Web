import "styles/globals.scss"
import { AuthenticationProvider } from "../contexts/AuthenticationContext"
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./public/Index";
import ConfirmAccount from "./public/ConfirmAccount";
import ForgotPassword from "./public/ForgotPassword";
import Register from "./public/Register";
import SetPassword from "./public/SetPassword";
import SignIn from "./public/SignIn";
import ThankYou from "./public/ThankYou";

import AdministratorDashboard from "./administrator/Dashboard";
import AdministratorClaims from "./administrator/Claims";
import AdministratorInvestigators from "./administrator/Investigators";
import AdministratorCustomers from "./administrator/Customers";
import AdministratorSignIns from "./administrator/Signins";
import AdministratorJobs from "./administrator/Jobs";

import CustomerDashboard from "./customer/Dashboard";

import InvestigatorDashboard from "./investigator/Dashboard";

import Privacy from "./public/Privacy";
import { CustomerProvider } from "contexts/CustomerContext";
import { AccountManagementProvider } from "contexts/AccountManagementContext";
import { AdministratorProvider } from "contexts/AdministratorContext";
import { AuthenticatedLayout } from "../layouts/AuthenticatedLayout";
import { JobProvider } from "contexts/JobContext";
import { InvestigatorProvider } from "contexts/InvestigatorContext";

const App = () => {
  return (
    // todo this nesting looks bizarre
    <AuthenticationProvider>
      <CustomerProvider>
        <AccountManagementProvider>
          <InvestigatorProvider>
            <JobProvider>
              <AdministratorProvider>

                <Routes>
                  <Route path="/" element={ <Index /> } />           
                  <Route path="confirmaccount" element={<ConfirmAccount />} />
                  <Route path="forgotpassword" element={<ForgotPassword />} />
                  <Route path="privacy" element={<Privacy />} />      
                  <Route path="register" element={<Register />} />
                  <Route path="setpassword" element={<SetPassword />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="thankyou" element={<ThankYou />} />      

                  <Route path="customer" element={<AuthenticatedLayout />} >
                    <Route index path="dashboard" element={ <CustomerDashboard />} ></Route>
                  </Route>    

                  <Route path="investigator" element={<AuthenticatedLayout />} >
                    <Route index path="dashboard" element={ <InvestigatorDashboard />} ></Route>
                  </Route>  

                  <Route path="administrator" element={<AuthenticatedLayout />} >
                    <Route index path="dashboard" element={ <AdministratorDashboard />} ></Route>
                    <Route path="claims" element={ <AdministratorClaims />} ></Route>
                    <Route path="investigators" element={ <AdministratorInvestigators />} ></Route>
                    <Route path="customers" element={ <AdministratorCustomers />} ></Route>
                    <Route path="signins" element={ <AdministratorSignIns />} ></Route>
                    <Route path="jobs" element={ <AdministratorJobs />} ></Route>
                  </Route>  

                </Routes>    
              </AdministratorProvider>
            </JobProvider>
          </InvestigatorProvider>
        </AccountManagementProvider>
      </CustomerProvider>
    </AuthenticationProvider>
  );
}

export default App;