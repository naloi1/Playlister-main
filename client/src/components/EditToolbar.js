import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handlePublish() {
        store.publishCurrentList();
    }
    return (
        <div id="edit-toolbar" onKeyDown={store.handleKeyPress}>
            <Button
                disabled={!store.canAddNewSong() || !store.isNoModalOpen()}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained"
                style={{backgroundColor:'#c4c4c4'}}>
                <AddIcon />
            </Button>
            <Button 
                disabled={!store.canUndo() || !store.isNoModalOpen()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained"
                style={{backgroundColor:'#c4c4c4'}}>
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!store.canRedo() || !store.isNoModalOpen()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained"
                style={{backgroundColor:'#c4c4c4'}}>
                    <RedoIcon />
            </Button>
            <Button 
                disabled={!store.canClose() || !store.isNoModalOpen()}
                id='publish-button'
                onClick={handlePublish}
                variant="contained"
                style={{backgroundColor:'#c4c4c4'}}>
                    Publish
            </Button>
        </div>
    )
}

export default EditToolbar;