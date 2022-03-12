










// import { auth, db } from './firebase'



import React, { useState } from "react";
import { Link } from 'react-router-dom';


//MUI 
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// npm

import firebase from 'firebase';

      
import elephant from './Images/elephantChess.png'



export default function ForgotPassword() {




  const [email, setEmail] = useState("");


  const [Error, setError] = useState("");

          
     
              







const handleSubmit = (event) => {
    event.preventDefault();
    
    



    firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    alert("Reset Password Email Sent To " +  email + " Please Check Junk Mail Also llllll")



  })
  .catch((error) => {
      alert("error " + error)
    var errorCode = error.code;
    var errorMessage = error.message;
    setError(error.message)
    console.log(Error,errorCode,errorMessage)
  });

}


    return (
            
                    <div>
                        <div >
                            <div  style={{  margin:"0 auto", width:"200px",justifyContent: "center"}}>

                            <center>
<img 
style={{width:"150px", 
padding:"20px",
marginTop:"100px",
}}
src={elephant} alt="elephant" 
/>
 </center>              
</div>
        
                            <Typography 
                             style={{display: "flex",justifyContent: "center"}}
                            variant="h3" 
                            //className={classes.pageTitle}
                            > 
                          Reset Password
                            </Typography>
        
                          
        
                            <form 
                            style={{ margin:"0 auto", width:"500px",marginTop:"30px"}}
                            noValidate onSubmit={handleSubmit}>
                             <TextField 
                             id='email' 
                             name="email" 
                             type="email" 
                             label="Email" 
                            //  className={classes.textField}
                            //  helperText={errors.email}
                            //  error={errors.email ? true : false }
                             value={email}
                             onChange={e => setEmail(e.target.value)}
                             fullWidth
                           
                                                  />
        
                             

                            

        
        
                             <Button type="submit" 
                             variant="contained"  
                             style={{ 
  margin: "0 auto",
  display: "block",
  backgroundColor: "lightblue",
  padding: "10px",
  marginTop:"30px",
  }}
                            
                               >Reset Password</Button>
        
        
        
        
        
        
        
        
                           
         <br></br>
         <br></br>    
        <small>  <Link to="/login"
         style={{display: "flex",justifyContent: "center", color:"black"}}
        >Go To Login Page</Link>  </small>
        <br/>
        <small>  <Link to="/signup"
         style={{display: "flex",justifyContent: "center", color:"black"}}
        >Go To Sign Up Page</Link>  </small>
        <br></br>
         <br></br>
        
        
                 </form>
                        </div>
                       
                    </div>
                )
}






















