import React, { useEffect } from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';




const options = [
  //bpxx to allow for 2 token games we need to set up the win and lose amounts in abort game , whtie clock timer , black clock timer , check mate etc
  
  //2,
  5,
];



export default function BetAmountSelectionMenu(props) {

  


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);


  

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

useEffect(() => {

  props.onSelectBetAmount(options[selectedIndex]);            


}, [selectedIndex])



useEffect(() => {
  setSelectedIndex([0]);
  }, [])
  
  




  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div 
    
    >

  
      <List
className="button is-primary"
       style={{
        height: "41px",
        // width:"40vw",
        width:"120px",
        border: "1px solid #dfe1e5",
        borderRadius: "4px",
        boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
        hoverBackgroundColor: "#eee",
        fontSize: "1vw",
        fontFamily: "Arial",
        iconColor: "grey",
        lineColor: "rgb(232, 234, 237)",
        placeholderColor: "grey",
        padding:"0px",
        left:"0",
        textAlign:"center",
         color:"black",
         marginLeft: "5px",
backgroundColor:"lightBlue",
                  


        
       }}
      component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          onClick={handleClickListItem}
        >
          <ListItemText 
          primary={` ${options[selectedIndex]} Tokens`} 
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          // backgroundColor: "black",
          marginTop:"99",
        
        }}
      >
        {options.map((option, index) => (
          <MenuItem
style={{
          width:"100vw",
          fontSize:"3vh"
        }}
            key={option}
            // disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
          


             {`${option}`} 
          
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

 