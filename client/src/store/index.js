import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    CHANGE_PLAYER_INDEX: "CHANGE_PLAYER_INDEX",
    CHANGE_FILTER_TYPE: "CHANGE_FILTER_TYPE",
    CHANGE_SEARCH_TERM: "CHANGE_SEARCH_TERM",
    CHANGE_SORT_TYPE: "CHANGE_SORT_TYPE",
    CHANGE_TAB: "CHANGE_TAB"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

const FilterType = {
    OWN_LISTS : "OWN_LISTS",
    BY_LIST_NAME : "BY_LIST_NAME",
    BY_USERNAME : "BY_USERNAME"
}

const SortType = {
    NAMES: "NAMES",
    DATES: "DATES",
    LISTENS: "LISTENS",
    LIKES: "LIKES",
    DISLIKES: "DISLIKES"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        player: null,
        playerIndex: 0,
        filterType: FilterType.OWN_LISTS,
        searchTerm: "",
        sortType: SortType.NAMES,
        tab: 1
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: 0,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: 0,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            case GlobalStoreActionType.CHANGE_PLAYER_INDEX: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: payload,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            case GlobalStoreActionType.CHANGE_FILTER_TYPE: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: payload.lists,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: payload.filter,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType
                });
            }
            case GlobalStoreActionType.CHANGE_SEARCH_TERM: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: payload.list,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: payload.term,
                    sortType: store.sortType,
                    tab: store.tab
                });
            }
            case GlobalStoreActionType.CHANGE_SORT_TYPE: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: payload.lists,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: payload.sortType,
                    tab: store.tab
                });
            }
            case GlobalStoreActionType.CHANGE_TAB: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    player: store.player,
                    playerIndex: store.playerIndex,
                    filterType: store.filterType,
                    searchTerm: store.searchTerm,
                    sortType: store.sortType,
                    tab: payload
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray = store.sortPairs(pairsArray);
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    store.publishCurrentList = function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        let list = store.currentList;
        list.datePublished = today;
        list.published = true;
        console.log(store.currentList.datePublished);

        store.updateCurrentList();
        tps.clearAllTransactions();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.username, 0, [], [], [], false);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            store.loadIdNamePairs();
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            if(store.filterType === FilterType.OWN_LISTS){
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (user's lists)");
                }
            } else if (store.filterType === FilterType.BY_LIST_NAME){
                const response = await api.getPlaylistPairsByListName(store.searchTerm);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (filter by list name)");
                }
            } else if (store.filterType === FilterType.BY_USERNAME){
                const response = await api.getPlaylistPairsByUsername(store.searchTerm);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (filter by username)");
                }
            }

        }
        asyncLoadIdNamePairs();
    }

    store.loadIdNamePairs = function (term) {
        async function asyncLoadIdNamePairs() {
            if(store.filterType === FilterType.OWN_LISTS){
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs
                    pairsArray = store.sortPairs(pairsArray);;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (user's lists)");
                }
            } else if (store.filterType === FilterType.BY_LIST_NAME){
                const response = await api.getPlaylistPairsByListName(term);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (filter by list name)");
                }
            } else if (store.filterType === FilterType.BY_USERNAME){
                const response = await api.getPlaylistPairsByUsername(term);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (filter by username)");
                }
            }

        }
        asyncLoadIdNamePairs();
    }


    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    store.unmarkListForDeletion = function(){
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    store.isNoModalOpen = () => {
        return store.currentModal === CurrentModal.NONE;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                store.incListens();
                /*response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    //history.push("/playlist/" + playlist._id);
                }*/
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.handleKeyPress = function (event) {
        //console.log("hello");
        if(event.ctrlKey){
            console.log("ctrl");
            if(event.key === 'Z' || event.key === 'z'){
                //console.log("undo - z or Z   -   " + this.tps.hasTransactionToUndo());
                if(store.canUndo){
                    store.undo();
                }
            }else if(event.key === 'Y' || event.key === 'y'){
                //console.log("redo - y or Y   -   " + this.tps.hasTransactionToRedo());
                if(store.canRedo){
                    store.redo();
                }
            }
        }
    }

    store.setPlayer = function (player) {
        store.player = player;
    }

    store.incPlayerIndex = function () {
        let i = store.playerIndex + 1;
        if(i > store.currentList.songs.length - 1){
            i = 0;
        }
        storeReducer({
            type: GlobalStoreActionType.CHANGE_PLAYER_INDEX,
            payload: i
        });
    }

    store.decPlayerIndex = function () {
        let i = store.playerIndex - 1;
        if(i < 0){
            i = store.currentList.songs.length - 1;
        }
        storeReducer({
            type: GlobalStoreActionType.CHANGE_PLAYER_INDEX,
            payload: i
        });
    }

    store.filterOwnLists = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = store.sortPairs(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_FILTER_TYPE,
                    payload: { filter: FilterType.OWN_LISTS, lists: pairsArray }
                });
                console.log(store.filterType);
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS (user's lists)");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.filterByListName = function () {
        async function asyncLoadIdNamePairs() {
            let response;
            if(store.searchTerm){
                response = await api.getPlaylistPairsByListName(store.searchTerm);
            } else {
                response = await api.getPublishedLists();
            }            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = store.sortPairs(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_FILTER_TYPE,
                    payload: { filter: FilterType.BY_LIST_NAME, lists: pairsArray }
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS (filter by list name)");
            }
        }
        
        asyncLoadIdNamePairs();
    }

    store.filterByUsername = function () {
        async function asyncLoadIdNamePairs() {
            let response;
            if(store.searchTerm){
                response = await api.getPlaylistPairsByUsername(store.searchTerm);
            } else {
                response = await api.getPublishedLists();
            }
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                pairsArray = store.sortPairs(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_FILTER_TYPE,
                    payload: { filter: FilterType.BY_USERNAME, lists: pairsArray }
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS (filter by username)");
            }
        }
        asyncLoadIdNamePairs();
    }


    store.getFilterType = function () {
        if(store.filterType === FilterType.OWN_LISTS){
            return 1;
        } else if(store.filterType === FilterType.BY_LIST_NAME){
            return 2;
        } else if(store.filterType === FilterType.BY_USERNAME){
            return 3;
        } else {
            return 0;
        }
    }

    store.changeSortType = function (type){
        async function asyncLoadIdNamePairs() {
            let response;
            if(store.filterType === FilterType.OWN_LISTS){
                response = await api.getPlaylistPairs(); //change this based on current filter type
            } else if(store.searchTerm){
                if(store.filterType === FilterType.BY_LIST_NAME) {
                    response = await api.getPlaylistPairsByListName(store.searchTerm); //change this based on current filter type
                } else if(store.filterType === FilterType.BY_USERNAME){
                    response = await api.getPlaylistPairsByUsername(store.searchTerm); //change this based on current filter type
                }
            } else {
                response = await api.getPublishedLists();
            }
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                if(type === 1){
                    // add store.sortByNames, store.sortByWhatever for each if/else that takes pairsArray as input and outputs a sorted pairsArray
                    pairsArray = store.sortByNames(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { sortType: SortType.NAMES, lists: pairsArray }
                    });
                } else if(type === 2){
                    pairsArray = store.sortByDates(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { sortType: SortType.DATES, lists: pairsArray }
                    });
                } else if(type === 3){
                    pairsArray = store.sortByListens(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { sortType: SortType.LISTENS, lists: pairsArray }
                    });
                } else if(type === 4){
                    pairsArray = store.sortByLikes(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { sortType: SortType.LIKES, lists: pairsArray }
                    });
                } else if(type === 5){
                    pairsArray = store.sortByDislikes(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SORT_TYPE,
                        payload: { sortType: SortType.DISLIKES, lists: pairsArray }
                    });
                }
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS (filter by username)");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.sortPairs = function (pairs) {
        if(pairs.length > 0){
            if(store.sortType === SortType.NAMES){
                return store.sortByNames(pairs);
            } else if (store.sortType === SortType.DATES){
                return store.sortByDates(pairs);
            } else if (store.sortType === SortType.LISTENS){
                return store.sortByListens(pairs);
            } else if (store.sortType === SortType.LIKES){
                return store.sortByLikes(pairs);
            } else if (store.sortType === SortType.DISLIKES){
                return store.sortByDislikes(pairs);
            }
        } else {
            return pairs;
        }
    }

    store.sortByNames = function (pairs) {
        pairs.sort((a, b) => a.name.localeCompare(b.name))
        return pairs;
    }

    store.sortByDates = function (pairs) {
        let publishedPairs = [];
        let unpublishedPairs = [];
        for(let i = 0; i < pairs.length; i++){
            if(pairs[i].published){
                publishedPairs.push(pairs[i])
            } else {
                unpublishedPairs.push(pairs[i])
            }
        }
        publishedPairs.sort((a, b) => a.datePublished.substring(4,4).localeCompare(b.datePublished.substring(4,4)));
        publishedPairs.push(unpublishedPairs);
        return publishedPairs;
    }

    store.sortByListens = function (pairs) {
        pairs.sort((a,b)=>b.listens-a.listens);
        return pairs;
    }

    store.sortByLikes = function (pairs) {
        pairs.sort((a,b)=>b.likes.length-a.likes.length);
        return pairs;
    }

    store.sortByDislikes = function (pairs) {
        pairs.sort((a,b)=>b.dislikes.length-a.dislikes.length);
        return pairs;
    }

    store.incListens = function (id) {
        async function asyncUpdateCurrentList() {
            await api.incrementListensById(id);
        }
        asyncUpdateCurrentList();
    }

    store.addLike = function (id, likes){
        async function getList () {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                }
                response.data.playlist.likes = likes;
                updateList(response.data.playlist);
                if(store.currentList){
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: response.data.playlist
                    });
                } else {
                    storeReducer({
                        type: GlobalStoreActionType.CLOSE_CURRENT_LIST
                    });
                }
            }
        }
        getList();
    }

    store.addDislike = function (id, dislikes){
        async function getList () {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                }
                response.data.playlist.dislikes = dislikes;
                updateList(response.data.playlist);
                if(store.currentList){
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: response.data.playlist
                    });
                } else {
                    storeReducer({
                        type: GlobalStoreActionType.CLOSE_CURRENT_LIST
                    });
                }
            }
        }
        getList();
    }

    store.addComment = function (commentText){
        let list = store.currentList;
        let comment = {
            username: auth.user.username,
            message: commentText
        }
        list.comments.push(comment);
        store.updateCurrentList();
    }

    store.changeSearchTerm = function (term) { //make search work w/ nothing in search box and not case sensitive
        async function asyncLoadIdNamePairs(term) {
            if(store.filterType === FilterType.OWN_LISTS){
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SEARCH_TERM,
                        payload:{ term: term, list: pairsArray}
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (user's lists)");
                }
            } else if (store.filterType === FilterType.BY_LIST_NAME){
                const response = await api.getPlaylistPairsByListName(term);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SEARCH_TERM,
                        payload:{ term: term, list: pairsArray}
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (filter by list name)");
                }
            } else if (store.filterType === FilterType.BY_USERNAME){
                const response = await api.getPlaylistPairsByUsername(term);
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    pairsArray = store.sortPairs(pairsArray);
                    storeReducer({
                        type: GlobalStoreActionType.CHANGE_SEARCH_TERM,
                        payload:{ term: term, list: pairsArray}
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS (filter by username)");
                }
            }
        }
        asyncLoadIdNamePairs(term);
    }

    store.getPlaylistById = async function (id) {
        let response = await api.getPlaylistById(id);
        if (response.data.success) {
            /*console.log("AaaaaaaaaaaaaaaaaaaaaaaSJUDHALSJIKHD");
            console.log(response);
            console.log(response.data);*/
            console.log(response.data.playlist);
            
            return response.data.playlist;
        } else {
            return "AAAAA";
        }
    }

    store.changeToPlayer = function (){
        storeReducer({
            type: GlobalStoreActionType.CHANGE_TAB,
            payload: 1 
        });
    }

    store.changeToComments = function (){
        storeReducer({
            type: GlobalStoreActionType.CHANGE_TAB,
            payload: 2 
        });
    }

    store.duplicateCurrentList = async function () {
        const response = await api.createPlaylist(store.currentList.name, store.currentList.songs, auth.user.email, auth.user.username, 0, [], [], [], false);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            store.loadIdNamePairs();
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };