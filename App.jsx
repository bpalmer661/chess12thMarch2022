



import React from 'react';
import './App.css'

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import createTheme from '@material-ui/core/styles/createTheme'
import themeFile from './util/theme';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home'
import GameApp from './GameApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import MinuteSelectionMenu from './MinutesSelectionMenu'
import AuthRoute from './util/AuthRoute'

import store from './redux/store';
import { Provider } from "react-redux";
import Login from './login'
import  Signup  from './signup';
import DepositFunds from './DepositFunds';
import WithdrawFunds from './WithdrawFunds';
import AdminPayPendingWithdrawalsPage from "./AdminPayPendingWithdrawalsPage"
import UsersWithdrawalHistory from "./UsersWithdrawalHistory"
import AdminViewUsersTransactionHistory from "./admin/AdminViewUsersTransactionHistory"
import AdminViewUsersWithdrawalHistory from "./admin/AdminViewUsersWithdrawalHistory"


import AdminPaidWithDrawalsPage from "./admin/AdminPaidWithDrawalsPage"






     
//we don't put brackets on navbar like {navbar } because it doesn't connect it to the right component/ if we put { navbar } the navbar component is not connected to
//the redux store, so it does not have access to redux store data.
import  Navbar from './Navbar';
import Transactions from './Transactions';
import ForgotPassword from './forgotPassword'

const theme = createTheme(themeFile);


export default function App() {





    const [user, loading, error] = useAuthState(auth)

    if (loading) {
        console.log("this is user and error to avoid warning" , user,error)
        return 'loading ...'
        
    }
  

    return (

<MuiThemeProvider theme={theme}>

<Provider store={store}>
        <Router>


        <Navbar/>
        <Switch>
               
       <Route exact path="/" component={Home}/>

       <Route exact path="/deposit" component={DepositFunds}/>
    
       <Route exact path="/withdraw" component={WithdrawFunds}/>
    
       <Route exact path="/adminPayPendingWithdrawalsPage" component={AdminPayPendingWithdrawalsPage}/>
    
       <Route exact path="/usersWithdrawalHistory" component={UsersWithdrawalHistory}/>
    
       <Route exact path="/adminViewUsersTransactionHistory" component={AdminViewUsersTransactionHistory}/>
       
       <Route exact path="/adminViewUsersWithdrawalHistory" component={AdminViewUsersWithdrawalHistory}/>
    

       <Route exact path="/AdminPaidWithDrawalsPage" component={AdminPaidWithDrawalsPage}/>
    
       <Route exact path="/forgotPassword" component={ForgotPassword}/>
    
      
      

       <Route exact path="/transactions" component={Transactions}/>
    

       
    
                <AuthRoute exact path="/login"  >
         <Login />

</AuthRoute>

<Route exact path="/signup" >
         <Signup/>
</Route>

                <Route path="/MinuteSelectionMenu">
                    <MinuteSelectionMenu />
                    </Route>



                <Route path="/game/:id">
                    <GameApp />
                    </Route>

                    </Switch>

        </Router>
</Provider>
</MuiThemeProvider>
    )
}