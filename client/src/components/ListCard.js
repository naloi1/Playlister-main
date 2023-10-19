import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import AuthContext from '../auth'

import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import React from 'react';
import WorkspaceScreen from './WorkspaceScreen';
import EditToolbar from './EditToolbar';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import List from '@mui/material/List';
import SongCard from './SongCard.js'
import { Button } from '@mui/material';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const { auth } = useContext(AuthContext);

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        event.stopPropagation();
        store.closeCurrentList();
        if(isExpanded){
            //store.setCurrentList(idNamePair._id);
            handleLoadList(event, idNamePair._id);
        }
        setExpanded(isExpanded ? panel : false);
    };

    
    const [expand, setExpand] = React.useState(false);
    const toggleAcordion = (event) => {
        store.closeCurrentList();
        if(!expand){
            //store.setCurrentList(idNamePair._id);
            handleLoadList(event, idNamePair._id);
        }
        setExpand((prev) => !prev);
    };

    if(store.currentList){
        if(store.currentList._id !== idNamePair._id && expand){
            setExpand(false);
        }
    }

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            idNamePair.listens += 1;
            store.incListens(idNamePair._id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleLike(){
        let inLikes = false;
        for(let i = 0; i < idNamePair.likes.length; i++){
            if(idNamePair.likes[i].username === auth.user.username){
                inLikes = true;
            }
        }
        if(!inLikes){
            idNamePair.likes.push(auth.user);
            store.addLike(idNamePair._id, idNamePair.likes);
        }
    }

    function handleDislike(){
        store.addDislike();
        let inDislikes = false;
        for(let i = 0; i < idNamePair.dislikes.length; i++){
            if(idNamePair.dislikes[i].username === auth.user.username){
                inDislikes = true;
            }
        }
        if(!inDislikes){
            idNamePair.dislikes.push(auth.user);
            store.addDislike(idNamePair._id, idNamePair.dislikes)
        }
    }
    
    function handleDuplicate(){
        store.duplicateCurrentList();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    /*console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    console.log(store.getPlaylistById(idNamePair._id));
    
    let playlistInfo;
    let owner;
    function getInfo () {
        playlistInfo = store.getPlaylistById(idNamePair._id);
        owner = playlistInfo.ownerUsername;
        console.log("ASDASDASDASD");
        console.log(playlistInfo);
    }
    getInfo();*/

    let info;
    if(idNamePair.published){
        info = "listens: " + idNamePair.listens + " likes: " + idNamePair.likes.length + " dislikes: " + idNamePair.dislikes.length + " date: " + idNamePair.datePublished;
    }

    let likeInfo;
    if(idNamePair.published) 
    likeInfo = 
    <div> 
        <Button disabled={auth.guest} onClick={handleLike} sx={{pointerEvents: "auto"}} style={{zIndex: '100'}}> 
            <ThumbUpIcon style={{color:'#1d1d1d'}}></ThumbUpIcon>
        </Button>
        <Button disabled={auth.guest} onClick={handleDislike} sx={{pointerEvents: "auto"}}> 
            <ThumbDownIcon style={{color:'#1d1d1d'}}></ThumbDownIcon>
        </Button>
    </div>

    let toolbar;
    if(store.currentList){
        if(auth.guest){
            toolbar = 
            <Box sx={{ p: 1 }}>
            </Box>
        } else if(store.currentList.datePublished){
            toolbar = 
            <Box sx={{ p: 1 }}>
            <IconButton onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'>
                <DeleteIcon style={{fontSize:'24pt'}} />
            </IconButton>
            <Button 
                disabled={!store.canClose() || !store.isNoModalOpen()}
                id='publish-button'
                onClick={handleDuplicate}
                variant="contained"
                style={{backgroundColor:'#1d1d1d'}}>
                    Duplicate
            </Button>
            </Box>
        } else {
            toolbar = 
            <div> 
                <EditToolbar/>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{fontSize:'24pt', position:'absolute'}} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }} aria-label='delete'
                        style={{position:'absolute', left:'10%', top:'83%'}}>
                        <DeleteIcon style={{fontSize:'24pt', position:'absolute', left:'20%', top:'60%'}} />
                    </IconButton>
                </Box>
                <Button 
                    disabled={!store.canClose() || !store.isNoModalOpen()}
                    id='publish-button'
                    onClick={handleDuplicate}
                    variant="contained"
                    style={{backgroundColor:'#1d1d1d', position:'absolute', left:'20%', top:'84%'}}>
                        Duplicate
                </Button>
            </div>
        }
    }
    console.log(idNamePair);

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '0px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '48pt', backgroundColor:'#c4c4c4'}}
            disableRipple={true}
            //onClick={(event) => {
            //    handleLoadList(event, idNamePair._id)
            //}}
        >

            <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expand} sx={{ p: 2 }} style={{ width: '100%', backgroundColor:'#fffff1'}}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon onClick={toggleAcordion}/>}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                //onClick={(event) => {
                //    handleLoadList(event, idNamePair._id)
                //}}
                >
                <Typography sx={{ width: '90%', flexShrink: 0 }} style={{fontSize:'20pt'}}>
                    {idNamePair.name} by {idNamePair.ownerUsername}
                    <br></br>
                    {info}
                    {likeInfo}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <WorkspaceScreen/>
                    {toolbar}
                </AccordionDetails>
            </Accordion>

        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;