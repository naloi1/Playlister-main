import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import YoutubePlayerTab from './YoutubePlayerTab.js'

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CommentScreen from './CommentScreen'
import AuthContext from '../auth'
import HouseIcon from '@mui/icons-material/House';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleNameSort() {
        store.changeSortType(1);
        handleClose();
    }
    function handleDateSort() {
        store.changeSortType(2);
        handleClose();
    }
    function handleListenSort() {
        store.changeSortType(3);
        handleClose();
    }
    function handleLikesSort() {
        store.changeSortType(4);
        handleClose();
    }
    function handleDislikesSort() {
        store.changeSortType(5);
        handleClose();
    }

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleFilterUserLists() {
        console.log("user lists");
        store.filterOwnLists();
    }

    function handleFilterListsByName() {
        console.log("filter list name");
        store.filterByListName();
    }

    function handleFilterListsByUsername() {
        console.log("filter username");
        store.filterByUsername();
    }

    function handleKeyPress (event){
        if (event.code === "Enter") {
            console.log(event.target.value);
            //send this value to store w/ currently logged in user to make comment
            store.changeSearchTerm(event.target.value);
            if(!event.target.value){
                store.changeSearchTerm(null);
            }
        }
    }
    
    function handleKeyPress2 (event){
        if (event.code === "Enter") {
            console.log(event.target.value);
            //send this value to store w/ currently logged in user to make comment
            store.addComment(event.target.value);
            event.target.value = "";
            store.changeToComments();
        }
    }

    function handleTabPlayer (){
        store.changeToPlayer();
    }

    function handleTabComments () {
        store.changeToComments();
    }

    let tabShown = <YoutubePlayerTab></YoutubePlayerTab>;
    if(store.tab === 1){
        tabShown = <YoutubePlayerTab></YoutubePlayerTab>
    } else if(store.tab === 2){
        tabShown = <CommentScreen></CommentScreen>
    } else {
        tabShown = <YoutubePlayerTab></YoutubePlayerTab>;
    }

    let listCard = "";
    if (store && store.idNamePairs) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector" className="grid-container">
            <Button
                onClick={handleFilterUserLists}
                variant='contained'
                style={{zIndex:100, class:"grid-item", backgroundColor:'#1d1d1d'}}
                disabled={store.getFilterType() === 1 || auth.guest}
                >
                <HouseIcon></HouseIcon>
            </Button>
            <Button
                onClick={handleFilterListsByName}
                variant='contained'
                style={{zIndex:100, backgroundColor:'#1d1d1d'}}
                disabled={store.getFilterType() === 2}
                >
                <GroupsIcon></GroupsIcon>
            </Button>
            <Button
                onClick={handleFilterListsByUsername}
                variant='contained'
                style={{zIndex:100, backgroundColor:'#1d1d1d'}}
                disabled={store.getFilterType() === 3}
                >
                <PersonIcon></PersonIcon>
            </Button>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{position:'absolute', left:'87%', top:'-32', scale:"2", color:'#1d1d1d'}}
            >
                Sort By <MenuIcon style={{color:'#1d1d1d'}}></MenuIcon>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleNameSort}>Name (A-Z)</MenuItem>
                <MenuItem onClick={handleDateSort}>Publish Date (Newest)</MenuItem>
                <MenuItem onClick={handleListenSort}>Listens (High-Low)</MenuItem>
                <MenuItem onClick={handleLikesSort}>Likes (High-Low)</MenuItem>
                <MenuItem onClick={handleDislikesSort}>Dislikes (High-Low)</MenuItem>
            </Menu>

            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>

            <Button
                onClick={handleTabPlayer}
                variant='contained'
                style={{zIndex:100, position:'absolute', left:'56%', top:'10%', backgroundColor:'#1d1d1d'}}
                >
                Player
            </Button>
            <Button
                onClick={handleTabComments}
                variant='contained'
                style={{zIndex:100, position:'absolute', left:'63%', top:'10%', backgroundColor:'#1d1d1d'}}
                >
                Comments
            </Button>

            <TextField 
                id='searchBox' 
                onKeyPress={handleKeyPress}
                style={{position:'absolute', left:'35%', top:'-35', width:'30%'}}
                variant="filled"
                label="Search" type="search"
                > 
            </TextField>

            <Box id='TabBox' style={{position:'absolute', left:'55%', top:'15%', width:'45%', height:'75%', overflowY:'auto'}}>
                {tabShown}
            </Box>
            
            <TextField 
                id='commentBox' 
                onKeyPress={handleKeyPress2}
                disabled={auth.guest || !store.currentList}
                style={{position:'absolute', left:'55%', top:'90%', width:'40%', height:'90%'}} 
                variant="filled"
                label="Add Comment" type="search"> 
            </TextField>
            
        </div>
        )
}

export default HomeScreen;