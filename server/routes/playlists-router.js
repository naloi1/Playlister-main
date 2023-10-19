/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlistpairslistname/:term', auth.verify, PlaylistController.getPlaylistPairsByListName)
router.get('/playlistpairsusername/:term', auth.verify, PlaylistController.getPlaylistPairsByUsername)
router.get('/playlistspublished/', auth.verify, PlaylistController.getPublishedLists)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/playlistlisten/:id', auth.verify, PlaylistController.incListens)

module.exports = router