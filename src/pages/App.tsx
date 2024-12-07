import 'assets/styles/globals.scss'
import 'assets/styles/fonts.scss'

import { AuthenticationProvider } from '../contexts/AuthenticationContext'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Index from './public/Index'
import ConfirmAccount from './public/ConfirmAccount'
import ForgotPassword from './public/ForgotPassword'
import Register from './public/Register'
import SetPassword from './public/SetPassword'
import SignIn from './public/SignIn'
import ThankYou from './public/ThankYou'

import AdministratorAdministrators from './administrator/Administrators'
import AdministratorDashboard from './administrator/Dashboard'
import AdministratorClaims from './administrator/Claims'
import AdministratorClaim from './administrator/Claim'
import AdministratorInvestigators from './administrator/Investigators'
import AdministratorCustomers from './administrator/Customers'
import AdministratorSignIns from './administrator/Signins'
import AdministratorJobs from './administrator/Jobs'

import CustomerDashboard from './customer/Dashboard'
import CustomerClaims from './customer/Claims'
import CustomerClaim from './customer/Claim'
import CustomerInvestigators from './customer/Investigators'

import InvestigatorDashboard from './investigator/Dashboard'
import InvestigatorClaims from './investigator/Claims'
import InvestigatorClaim from './investigator/Claim'
import InvestigatorCustomers from './investigator/Customers'

import Privacy from './public/Privacy'
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout'

const App = () => {
  return (
    <AuthenticationProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="confirmaccount" element={<ConfirmAccount />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="register" element={<Register />} />
        <Route path="setpassword" element={<SetPassword />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="thankyou" element={<ThankYou />} />

        <Route path="administrator" element={<AuthenticatedLayout />}>
          <Route index path="dashboard" element={<AdministratorDashboard />}></Route>
          <Route path="claims" element={<AdministratorClaims />}></Route>
          <Route path="claims/:uniqueID" element={<AdministratorClaim />}></Route>
          <Route path="investigators" element={<AdministratorInvestigators />}></Route>
          <Route path="customers" element={<AdministratorCustomers />}></Route>
          <Route path="administrators" element={<AdministratorAdministrators />}></Route>
          <Route path="signins" element={<AdministratorSignIns />}></Route>
          <Route path="jobs" element={<AdministratorJobs />}></Route>
        </Route>

        <Route path="customer" element={<AuthenticatedLayout />}>
          <Route index path="dashboard" element={<CustomerDashboard />}></Route>
          <Route path="claims" element={<CustomerClaims />}></Route>
          <Route path="claims/:uniqueID" element={<CustomerClaim />}></Route>
          <Route path="investigators" element={<CustomerInvestigators />}></Route>
        </Route>

        <Route path="investigator" element={<AuthenticatedLayout />}>
          <Route index path="dashboard" element={<InvestigatorDashboard />}></Route>
          <Route path="claims" element={<InvestigatorClaims />}></Route>
          <Route path="claims/:uniqueID" element={<InvestigatorClaim />}></Route>
          <Route path="customers" element={<InvestigatorCustomers />}></Route>
        </Route>
      </Routes>
    </AuthenticationProvider>
  )
}

export default App
