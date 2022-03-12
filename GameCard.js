//GameCard.js
//GameCards.js
import React, { Component } from 'react'
//MUI 
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import  Typography  from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';


import { Tooltip} from '@material-ui/core';

import { deleteGameCard } from '../redux/actions/dataActions'

import { logoutUser } from '../redux/actions/userActions'





//icons


import MessagesIcon from '@material-ui/icons/Message';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutLine from '@material-ui/icons/DeleteOutline';
import MarkunreadMailboxIcon from '@material-ui/icons/MarkunreadMailbox';
import jwtDecode from 'jwt-decode';
import { connect } from 'react-redux';



const styles = {
   
    card:{
        display: 'flex',
        flexDirection: "column",
        margin: 10,
    },
    image:{
        // minWidth:200,
        objectFit: 'fit',
        height: "30vh",
        width:'100%',
   marginBottom:"2vh",

    },
    content:{

        objectFit: 'fill',
        alignItems: 'centre',
    },
    buttonContainer:{
        display: "flex"
    },
    

}







 class GameCard extends Component {








    render() {


    
        const { classes, 

        } = this.props

        const { credentials
        } = this.props.user

      

      
        const  recieverId =  this.props.receiverId
        const  senderId = this.props.senderId

        const dName = recieverId !== credentials.username? (
            recieverId 
       ) : ( 
          senderId
           )
  

           
        const displayName = recieverId === credentials.username? (

             <p> { senderId }</p>
        ) : ( 
           <p> {recieverId}</p>
            )

            const showImageDepeningOnScreenWidthMarkUp = window.innerWidth && window.innerWidth  > 500 ? (
  
              <CardMedia
                image={this.props.mainImage}
                title="Profile Image"
                className={classes.image}
                /> 
              
                 
               ) : (
                 null
              
               )


        return (

            <Card 
            className={classes.card}
            >

           
{showImageDepeningOnScreenWidthMarkUp}
                

              <CardContent className={classes.content}>

        
        <div style={{display: "flex"}}>

        <img
src={this.props.userImage}
alt = "Profile"
style={{height:"6vh", width:"6vh",
        borderRadius: '50%',
        margin:'10px',
}}
>
</img>
      
              <Typography variant="h6" component={Link}
               to={`/users/${dName}`} 
          
               >
            
              {displayName}
              </Typography>

              <Typography

        color="textSecondary"
        variant="h5"
        >
        
        {this.props.conversationsRead ? 
        null
        : 

<MarkunreadMailboxIcon color="green"> </MarkunreadMailboxIcon>

}
        </Typography>
</div>

              {/* eslint-disable */}
              <Typography variant="h6" component={Link}
               color="primary">
              {this.props.jobTitle}
              </Typography>


              <Typography variant="body2" color="textSecondary">
             
              {(this.props.createdAt).toString()}
              
              {/* {`- Posted By ${this.props.jobPostOwnersUsername}`} */}
              </Typography>

              <br/>
             

              

            
              <Typography
        
        color="textSecondary"
        variant="h5"
        >
        {`${this.props.replyText}`}
        </Typography>




              <br/>





<Link to={{ 
  pathname: `/ChatPage/${this.props.receiverId}`, 
  otherChatUser: this.state.ocu,
  jobPostId: this.props.jobPostId,
  mainImage:this.props.mainImage,
  jobTitle:this.props.jobTitle,
  jobPostOwnersUsername:this.props.jobPostOwnersUsername,
  jobId: this.props.jobId,
  state: this.props.state,
  category: this.props.category,
  jobPostOwnersEmail: this.props.jobPostOwnersEmail,
  
}}
> 

  <IconButton onClick={this.handleOpen} >
<MessagesIcon color="primary"> </MessagesIcon>
</IconButton>
 </Link>



 


  <Tooltip title="delete" placement="right">
<IconButton onClick={this.handleDeleteConversation}>
    <DeleteOutLine 
    
    color="secondary"> </DeleteOutLine>
</IconButton>
  </Tooltip>


             </CardContent>
   

            </Card>
        
        )
    }
}



const mapStateToProps = (state) => ({
    user: state.user,
    conversations: state.data

})

const mapActionsToProps = {
    deleteConversation,
    logoutUser,
}

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(GameCard));


