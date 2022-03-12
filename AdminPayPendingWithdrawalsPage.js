


import React, { useEffect, useState } from 'react'

import {db } from './firebase'
//import UsersPendingWithdrawalsCard from './UsersPendingWithdrawalsCard';

import { ethers } from "ethers";

import { Link } from 'react-router-dom';

import { useHistory } from 'react-router-dom'


 

export default function AdminPayPendingWithdrawalsPage() {




const history = useHistory()



const [pendingWithdrawals, setPendingWithdrawals] = useState([]);

//dummy functions used just to call useeffect from AdminPendingWithdrawalsCard child///////////////
const [fetchTransactionsBoolean, setFetchTransactionsBoolean] = useState();

const setFetchTransactionsFunc = () => {
  setFetchTransactionsBoolean(true)
}
////////////////////////////////////////////////


useEffect(() => {

console.log("use effect called")
    const fetchTransactions = async () => {
      try {
      
        const ref = db.collection("pendingWithdrawals").orderBy("timestamp", 'desc');


        const docs = await ref.get();

        let allPendingWithdrawals = [];
        docs.forEach((doc) => {
            allPendingWithdrawals.push({...doc.data(), id: doc.id})
            
        });
        setPendingWithdrawals(allPendingWithdrawals);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchTransactions();
}, [fetchTransactionsBoolean]);





const goToAdminPaidWithDrawalsPage = () => {
  history.push('/AdminPaidWithDrawalsPage')
}



  
//{"usersWalletAddress": walletAddress, "withdrawalAmount":tokenAmount, usersEmail ,timestamp, status: "pending"})



   const withdrawalsMarkup = (

    pendingWithdrawals.map((withdrawals) => { 

return (
<AdminPendingWithdrawalsCard
usersWalletAddress={withdrawals.usersWalletAddress ?? "Error  134g2g"}
withdrawalAmount={withdrawals.withdrawalAmount ?? "Error 177g2g"}  
usersEmail={withdrawals.usersEmail ?? "Error 177g22"} 
timestamp={withdrawals.timestamp ?? "Error 34r35g3g"} 

status={withdrawals.status ?? "Error 3zxg3g"}  
 txnHash={withdrawals.txnHash ?? "Pending"}
 id={withdrawals.id ?? "error f3f34"}
 //dummy func just to call use effect from child
 setFetchTransactionsFunc = {setFetchTransactionsFunc}
/>
)
   }) 
  


  ) 



  return (
  <div
  style={{padding:"30px",marginTop:"200px", backgroundColor:"purple"}}
  >

<center>
<h1
style={{fontSize: "20px",color:"black"}}
> 
Admin Pay Pending Withdrawals Page
</h1>
</center>


<br/>
<br/>

  
<center>

<br/>

<button onClick={goToAdminPaidWithDrawalsPage}> View All Paid Withdrawal History</button>
</center>



<br/>
<br/>


<div
style={{backgroundColor:"yellow", margin:"auto 0"}}
>  


<div
style={{backgroundColor:"blue",margin: "auto",
width: "95%"}}
>



<div
style={{display:"flex", 
}}>

<p style={{ borderStyle:"solid", width:"150px", height:"40px",padding:"5px",backgroundColor:"lightblue",fontWeight: 'bold',fontSize: "10px" }} > UsersEmail</p>
<p style={{ borderStyle:"solid", width:"80px", height:"40px",padding:"5px",backgroundColor:"lightblue",fontWeight: 'bold',fontSize: "10px" }} > Withdrawal Amount</p>
<p style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"lightblue",fontWeight: 'bold',fontSize: "10px"  }}  > Date  & Time Requested</p>
<p style={{ borderStyle:"solid", width:"300px", height:"40px",padding:"5px",backgroundColor:"lightblue",fontWeight: 'bold',fontSize: "10px"  }}  > Wallet Address</p>
<p style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"lightblue",fontWeight: 'bold',fontSize: "10px"  }}  > Status</p>

<p style={{ borderStyle:"solid", width:"300px", height:"40px",padding:"5px",backgroundColor:"lightblue",fontWeight: 'bold',fontSize: "10px"  }}  > txn hash / Transaction Id</p>

<button style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}> View Users Transactions </button>
<button style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}> Pay </button>



</div>

{withdrawalsMarkup}

</div>



</div>



</div>


  )
  



}







 function AdminPendingWithdrawalsCard(props) {



const [Error, setError] = useState([]);





// need to continue here to push to adminViewUsersTransactionHistory page with the users email then call databasee to get their transaction history 



const history = useHistory()

    const makePayment = async () => {

console.log(` users email ${props.usersEmail}`)
console.log(` users withdrawalAmount ${props.withdrawalAmount}`)
console.log(` users usersWalletAddress ${props.usersWalletAddress}`)
console.log(` document ID  ${props.id}`)


var playersTokens;

//check user still has enough tokens
await db.collection("users").doc(props.usersEmail).get() 
.then(doc => {

 playersTokens = doc.data().tokens

})

var withdrawalAmountPlusFee = Number(props.withdrawalAmount) + 50



const timestamp =  Date.now()

if(playersTokens < withdrawalAmountPlusFee){
  alert(`insufficient funds users needs ${withdrawalAmountPlusFee} but only has ${playersTokens}`)
//update users pending withdrawals as insufficient funds
db.collection("users").doc(props.usersEmail).collection("pendingWithdrawalsAndAllWithdrawalHistory").doc(props.id).update({
  status: "denied insufficient Funds", txnHash: "denied insufficient Funds",timeProcessedTimeStamp: timestamp
})

db.collection("users").doc(props.usersEmail).update({pendingWithdrawal: false})

db.collection("pendingWithdrawals").doc(props.id).delete()

props.setFetchTransactionsFunc()

return

}

//make payment with metamask


setError(null)


try {

  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install it.");

  await window.ethereum.request({ method: 'eth_requestAccounts' });


  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

//below line of code validates the address and throws an error if the address is incorrect 
  ethers.utils.getAddress(props.usersWalletAddress);


  var withDrawalAmountInEth = props.withdrawalAmount / 10000

  

  var StringWithDrawalAmountInEth = String(withDrawalAmountInEth)

  const tx = await signer.sendTransaction({
    to: props.usersWalletAddress,
    value: ethers.utils.parseEther(StringWithDrawalAmountInEth)
  });
  
 


//just did this check below so when we make the payment it actually does log into the databas correctly

if (!props.usersEmail){
  alert("error no props.email")
}

db.collection("users").doc(props.usersEmail).collection("pendingWithdrawalsAndAllWithdrawalHistory").doc(props.id).update({
  status: "Paid", txnHash: tx.hash,timeProcessedTimeStamp: timestamp
}).catch((error) => {
  alert("error "+ error)
});




var newTokenCount = playersTokens - withdrawalAmountPlusFee

console.log(`newTokenCount of ${newTokenCount} - should be ${playersTokens} minus ${withdrawalAmountPlusFee}`)

db.collection("users").doc(props.usersEmail).update({pendingWithdrawal: false, tokens:newTokenCount}).catch((error) => {
  alert("error "+ error)
});



//need to update players transactiuons to say withdrawal proccessed difference in tokens 
db.collection("users").doc(props.usersEmail).collection("transactions").add({amount:`-${withdrawalAmountPlusFee}`,
balance:newTokenCount, creditOrDebit: "debit",opponentsUsername: "NA", opponentEmail: "NA",opponentsUID: "NA", timestamp, type: "WithDrawal + Fee",
 winOrLoss: "NA", ResultBy: "NA", ratingChange:`NA`,rating: "NA", txnHash: tx.hash }).catch((error) => {
  alert("error "+ error)
});;



db.collection("paidWithdrawals").add({amountPlusFee:`-${withdrawalAmountPlusFee}`, amountPaid: props.withdrawalAmount,
usersNewBalance:newTokenCount, timestamp, usersWalletAddress: props.usersWalletAddress,
 txnHash: tx.hash, EmailOfUserWithdrawalWasPaidTo: props.usersEmail}).catch((error) => {
  alert("error "+ error)
});;


 db.collection("pendingWithdrawals").doc(props.id).delete().catch((error) => {
  alert("error "+ error)
});

 props.setFetchTransactionsFunc()


 history.push('/AdminPaidWithDrawalsPage')


} catch (err) {
    console.log("error: " + err.message)
  setError(err.message);

props.setFetchTransactionsFunc()
}




    }
    

let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(props.timestamp)





      return (
    
    
    
    
    <div
    style={{display:"flex", 
    }}>
    
    
    
    <p style={{ borderStyle:"solid", width:"150px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px" }} > {props.usersEmail}</p>
     <p style={{ borderStyle:"solid", width:"80px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px" }} > {props.withdrawalAmount}</p>
     <p style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}  > {date}  </p>
     <p style={{ borderStyle:"solid", width:"300px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}  > {props.usersWalletAddress}</p>
     <p style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}  > {props.status}</p>
    <p style={{ borderStyle:"solid", width:"300px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}  > {props.txnHash}</p>
    


 <Link 
 style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}
to={{ 
    pathname: '/adminViewUsersTransactionHistory', 
    usersEmail: props.usersEmail,
  }}
  >
  View Users Transaction History
</Link>



    

    <button onClick={makePayment} style={{ borderStyle:"solid", width:"200px", height:"40px",padding:"5px",backgroundColor:"white",fontWeight: 'bold',fontSize: "8px"  }}> Pay </button>
    
    </div>
    
    
      )
    
    }
    