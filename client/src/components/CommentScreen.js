import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import CommentCard from './CommentCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function CommentScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    
    let listComponent = <List> </List>

    if(store.currentList){
        listComponent = <List 
        id="comment-cards" 
        sx={{ width: '100%', bgcolor: 'background.paper' }}
    >
        {
            store.currentList.comments.map((comment, index) => (
                <CommentCard
                    id={'comment-' + (index)}
                    key={'comment-' + (index)}
                    index={index}
                    comment={comment}
                />
            ))      
        }
        </List>
    }
    return (
        <Box>
            {listComponent}
         </Box>
    )
}

export default CommentScreen;