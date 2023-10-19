import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import { Typography } from '@mui/material'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="";
    function handleCreateNewList() {
        store.createNewList();
    }

    let d;
    if(store.getFilterType()===1){
        d=
        <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                style={{position:'absolute', left:'95%',top:'93%', backgroundColor:'#1d1d1d'}}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2" 
                style={{position:'absolute', left:'60%',top:'90%', color:'#1d1d1d'}}>Your Lists</Typography>
        </div>
    } else if(store.getFilterType()===2){
        d= <Typography variant="h2" 
        style={{position:'absolute',color:'#1d1d1d'}}>{store.searchTerm} Playlists</Typography>
    } else {
        d= <Typography variant="h2" 
        style={{position:'absolute',color:'#1d1d1d'}}>{store.searchTerm} Lists</Typography>
    }
    if(auth.loggedIn || auth.guest){
        return (
            <div id="playlister-statusbar">
                {d}
            </div>
        );
    } else {
        return(<div id="">
        </div>);
    }
}

export default Statusbar;