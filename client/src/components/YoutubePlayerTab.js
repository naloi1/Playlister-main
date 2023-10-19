import React from 'react';
import YoutubePlayer from './YoutubePlayer.js'
import CommentScreen from './CommentScreen.js'
import Button from '@mui/material/Button';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function YouTubePlayerTab() {

    const { store } = useContext(GlobalStoreContext);

    function handlePlay () {
        store.player.playVideo();
    }
    
    function handlePause () {
        store.player.pauseVideo();
    }
    
    function handleNext () {
        store.incPlayerIndex();
    }
    
    function handlePrev () {
        store.decPlayerIndex();
    }

    let content;
    let title;
    let artist;
    if(store.currentList){
        if(store.currentList.songs.length>store.playerIndex){
            title = store.currentList.songs[store.playerIndex].title;
            artist = store.currentList.songs[store.playerIndex].artist;
        }
    }
    if(store.currentList){
        content = <div>
            <YoutubePlayer/>
            <Typography fontSize={24} style={{position:'absolute', left:'50%'}}> Now Playing</Typography>
            <Typography> Playlist: {store.currentList.name}</Typography>
            <Typography> Song #: {store.playerIndex + 1}</Typography>
            <Typography> Title: {title}</Typography>
            <Typography> Artist: {artist}</Typography>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-prev-button'
                onClick={handlePrev}
                style={{backgroundColor:'#1d1d1d'}}
                variant="contained">
                <KeyboardDoubleArrowLeftIcon />
            </Button>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-play-button'
                onClick={handlePlay}
                variant="contained"
                style={{backgroundColor:'#1d1d1d'}}>
                <PlayArrowIcon />
            </Button>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-pause-button'
                onClick={handlePause}
                style={{backgroundColor:'#1d1d1d'}}
                variant="contained">
                <StopIcon />
            </Button>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-next-button'
                onClick={handleNext}
                style={{backgroundColor:'#1d1d1d'}}
                variant="contained">
                <KeyboardDoubleArrowRightIcon />
            </Button>
        </div>
    } else {
        content = null;
        /*<Box style={{position:'absolute', left:'50%'}}>
            <Typography fontSize={24} style={{position:'absolute', left:'50%'}}> Now Playing</Typography>
            <Typography> Playlist: {}</Typography>
            <Typography> Song #: {}</Typography>
            <Typography> Title: {}</Typography>
            <Typography> Artist: {}</Typography>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-prev-button'
                variant="contained">
                <KeyboardDoubleArrowLeftIcon />
            </Button>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-play-button'
                variant="contained">
                <PlayArrowIcon />
            </Button>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-pause-button'
                variant="contained">
                <StopIcon />
            </Button>
            <Button
                disabled={!store.isNoModalOpen()}
                id='youtube-next-button'
                variant="contained">
                <KeyboardDoubleArrowRightIcon />
            </Button>
        </Box>*/
    }

    return (
    <div id="youtube-tab">
        {content}
    </div>
    )
}