


import React, { useState, useEffect} from 'react'
import axios from 'axios'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import { db,auth } from './firebase';


import elephant from './Images/elephantChess.png'


import metamaskImage from './Images/metamaskImage.png'


import { useHistory } from 'react-router-dom'



import { setHasDeposited, setPlayersTokens } from './redux/actions/userActions';

const tokens = [
    50,
    100,
    200,
    300,
    500,
    1000,
    2000,
    5000,
  ];
  
  
  

export default function DepositFunds() {


const history = useHistory()


// const classes = useStyles();
const [anchorEl, setAnchorEl] = useState(null);
const [selectedIndex, setSelectedIndex] = useState(1);
const [amountInEth, setAmountInEth] = useState();
const [Error, setError] = useState();
// eslint-disable-next-line
const [ tx, setTxs] = useState();
const [depositSuccessfulMarkupBollean, setDepositSuccessfulMarkupBollean] = useState(false)

const [noMetaMaskBoolean, setNoMetaMaskBoolean] = useState(false)


const goToTransactionsPage = () => {

history.push('/transactions')
}



 




var noMetaMaskMarkup = noMetaMaskBoolean === true ? (

  <center>
      <div
        style={{
         backgroundColor:"white", 
         fontSize:"20px", 
         zIndex:3,
        backgroundcolor: "red",
        
        padding:"20px",
       width:"500px",
        position: "fixed",
        top: "30%",
        left: "35%",
        borderRadius:"10px",
        borderColor:"grey",
        border: "solid"
       }}>

      
<center>


<img 
style={{width:"100px", 
padding:"20px"

}}
src={elephant} alt="hammer" 
/>

 </center>
      


 
      <p  
      style={{textAlign:"center",
       verticalAlign: "middle", 
       marginTop: "10px",
       marginLeft: "10px",
       marginRight: "10px",
       color:"black",
       fontSize:"20px"
       }}
      >
     Metamask Needed In Order To Make A Deposit
      
      
      </p>
      
      <center>

<img 
style={{width:"300px", 
padding:"0px"

}}
src={metamaskImage} alt="hammer" 
/>

 </center>


 
  {/* eslint-disable-next-line */}
 <a target="_blank" href='http://metamask.io/download/'>
 <button
 onClick={() => setNoMetaMaskBoolean(false)}
 style={{width:"100%",
      height:"40px",
      color: "white",
      backgroundColor:"#008CBA",
      margin: "auto",
      fontSize: "20px",
      borderRadius: "5px",
      }}
>     
 Install Metamask
 </button>
 
 </a>

      
 <button
 onClick={() => setNoMetaMaskBoolean(false)}
 style={{width:"100%",
      height:"40px",
      color: "white",
      backgroundColor:"#008CBA",
      margin: "auto",
      fontSize: "20px",
      borderRadius: "5px",
      marginTop:"10px"
      }}
>     
 Ok
 </button>
 
      <div className=""
      
      >
               
                </div>
    
       </div>
       </center>
      ) : (
        null
      )







var depositSuccessfulMarkup = depositSuccessfulMarkupBollean === true ? (

  <center>
      <div
        style={{
         backgroundColor:"white", 
         fontSize:"20px", 
         zIndex:3,
        backgroundcolor: "red",
        
        padding:"20px",
       width:"500px",
        position: "fixed",
        top: "50%",
        left: "35%",
        borderRadius:"10px",
        borderColor:"grey",
        border: "solid"
       }}>

      
<center>

<img 
style={{width:"150px", 
padding:"20px"

}}
src={elephant} alt="hammer" 
/>

 </center>
      
      <p  
      style={{textAlign:"center",
       verticalAlign: "middle", 
       marginTop: "20px",
       marginLeft: "10px",
       marginRight: "10px",
       color:"black",
       fontSize:"20px"
       }}
      >
     Deposit Successful 
      
      
      </p>
      
      
      
      <div className=""
      
      >
               
                </div>
      
      <div
      style={{
       
       width: "200px",
       height: "40px",
       margin: "auto",
       marginTop: "30px",
      
      }}
      >
  
      <button 
      style={{width:"100%",
      height:"40px",
      color: "white",
      backgroundColor:"#008CBA",
      margin: "auto",
      fontSize: "20px",
      borderRadius: "5px",
      }}
      onClick={goToTransactionsPage}
     
      
      >  Ok</button>
      
       </div>
       </div>
       </center>
      ) : (
        null
      )

      
     

var playersTokens;


const makePurchase = async () => {


    setError(null)


    try {
      
      if (!window.ethereum){
        throw new Error("No crypto wallet found. Please install it.");
         // eslint-disable-next-line
  setNoMetaMaskBoolean(true)

      }


      await window.ethereum.request({ method: 'eth_requestAccounts' });

    
      const provider = new ethers.providers.Web3Provider(window.ethereum);


      const { chainId } = await provider.getNetwork()
      console.log("this is chainId" + chainId) // 42

      //bpxxxx ensure this is uncommented before build
      if (chainId !== 1){
        alert("please change to Metamask to the Mainnet to make payment" )
        return
      }




     console.log("provider : " + provider  )

      const signer = provider.getSigner();

var addr = "0x5E43C15D965a7a132401b9c1DCFd21a14037497D"


//below line of code validates the address and throws an error if the address is incorrect 
      ethers.utils.getAddress(addr);

     const network =  ethers.providers.getNetwork

     console.log("this is network : " + network  )

      //benpalmer eth address - 0x5E43C15D965a7a132401b9c1DCFd21a14037497D
      // same address again to be sure 0x5E43C15D965a7a132401b9c1DCFd21a14037497D

      var stringEther = String(amountInEth)
      var tokensPurchased = amountInEth * 10000

      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(stringEther)
      });
      
      console.log("tx: ", tx);
      setTxs([tx]);


// here we add the transaction to the database,

const fromAddress = tx.from

console.log("this is tx.from " + tx.from)


db.collection("users").doc(auth.currentUser.email).get() 
.then(doc => {
  
    playersTokens = doc.data().tokens

    console.log("this is tokens: " + playersTokens) 
  
}).then(() => {

    var newTotal = tokensPurchased + playersTokens

    console.log("this is new Total " + newTotal)

db.collection("users").doc(auth.currentUser.email).update({tokens:newTotal})

dispatch(setPlayersTokens(newTotal));

const timestamp =  Date.now()

db.collection("users").doc(auth.currentUser.email).collection("transactions").add({amount:`+${tokensPurchased}`,
balance:newTotal, creditOrDebit: "credit", opponentEmail: "NA",opponentsUID: "NA", timestamp, type: "deposit", winOrLoss: "NA" ,
hash: tx.hash, fromAddress, txnHash: tx.hash});

db.collection("users").doc(auth.currentUser.email).update({hasDeposited:true, })


dispatch(setHasDeposited(true));


setDepositSuccessfulMarkupBollean(true)


new Audio("/elephantSoundEffect.mp3").play()

})
.catch(err => 

    console.error("this is ERROR:" + err)
    
    );
    } catch (err) {
        console.log("error: " + err.message)
      setError(err.message);
    }
  };









const dispatch = useDispatch();




const handleClickListItem = (event) => {
  setAnchorEl(event.currentTarget);
};

useEffect(() => {

    axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR`)
        .then(res => {
        
            let amountInEther = tokens[selectedIndex] /10000
           let etherPayment = 0.0001
           let oneGameCostUsd = res.data.USD * etherPayment
           let usd = oneGameCostUsd.toFixed(4);
           console.log(usd)
           setRoundUSD(usd)
           setAmountInEth(amountInEther)

        })
        .catch((e) => {
           console.log("this is e " + e)
        })

    

}, [selectedIndex,dispatch])




const handleMenuItemClick = (event, index) => {
  setSelectedIndex(index);
  setAnchorEl(null);
};


const handleClose = () => {
  setAnchorEl(null);
};



const [roundUSD, setRoundUSD] = useState();

// const [ErrorMessage, setErrorMessage] = useState();


    

  return (
  


  <div
  style={{ paddingTop:"300px",padding:"50px",
  // backgroundColor:"blue",
   position:"relative"}}
  >

<div
  style={{ paddingTop:"50px", 
  // backgroundColor:"coral",
   position:"relative",
   }}
  >

{depositSuccessfulMarkup}
{noMetaMaskMarkup}

<p
style={{fontSize:"60px",
  // backgroundColor:"green",
   textAlign:"center",color:"black",
   padding:"20px"
   
   }}
   
> Purchase Tokens

</p>

<center>

<img 
style={{width:"150px", 
padding:"30px"

}}
src={elephant} alt="hammer" 
/>

 </center>








{roundUSD &&



    <p
    style={{
      //backgroundColor:"red",
     textAlign:"center", color:"black"}}
    
    >

1 Token = 0.0001 Etheruem 
<br/>
0.0001 Eth = ${ roundUSD } USD

<br/>
<br/>
{/* 
100 Tokens = 0.0100 Etheruem 
<br/>
0.0100 Eth = ${ (roundUSD * 100).toFixed(2) }USD */}

</p>
}


<center>
<div 
style={{padding:"20px"}}
    >

  
      <List
       style={{
        height: "46px",
        width:"300px",
        border: "1px solid #dfe1e5",
        borderRadius: "0px",
        boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
        hoverBackgroundColor: "#eee",
        color: "#212121",
        fontSize: "1vw",
        fontFamily: "Arial",
        iconColor: "grey",
        lineColor: "rgb(232, 234, 237)",
        placeholderColor: "grey",
        padding:"0px",
        left:"0"

        
       }}
      component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          onClick={handleClickListItem}
          style={{width:"200px",height:"44px",
          //backgroundColor:"yellow"
          }}
          
        >
          <ListItemText 
         
          primary=
       
          {` Purchase ${tokens[selectedIndex]} Tokens`} 
          
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{width:"50vw",
        //backgroundColor:"blue"
        }}
      >
        {tokens.map((token, index) => (
            <center>
          <MenuItem
          style={{width:"450px", 
          // backgroundColor:"red",
          padding:"20px"
          }}

            key={token}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
          


             {`${token} Tokens`}
          
          </MenuItem>
          </center>
        ))}
      </Menu>
    </div>
</center>

</div>

<center>

      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
         
          <div className="">
            
            <div 
            >
            <h1
            style={{backgroundColor:"lightblue",
            width:"300px",
            borderRadius:"10px",
            borderColor: "black",
            padding:"10px"
            }}
            >
               { tokens[selectedIndex] } Tokens = Etheruem {amountInEth} =  ${((roundUSD * tokens[selectedIndex]).toFixed(2))}USD 
            </h1>
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            onClick={makePurchase}
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            style={{width:"150px",height:"40px",fontSize:"15px",
            backgroundColor:"lightblue",
            color:"black",
            borderRadius: "5px",
            }}
            
          >
            Purchase
          </button>
          {/* <ErrorMessage message={error} />
          <TxList txs={txs} /> */}
        </footer>
      </div>


   
</center>

{Error &&
<div
style={{
  //backgroundColor:"red",
padding:"20px"}}
>
ERROR: {Error}
</div>
}

  </div>
  )
}