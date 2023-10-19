import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../auth'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    function handleGuest () {
        auth.guestLogin();
    }
    
    return (
        <div id="splash-screen">
            <Button 
                style={{position:'absolute', left:'70%', top:'35%', width:'20%', height:'10%'}}
                id='create-acc-button'
                component={Link} to="/register/"
                variant="contained">
                    Create Account
            </Button>
            <Button 
                style={{position:'absolute', left:'70%', top:'50%', width:'20%', height:'10%'}}
                id='login-button'
                component={Link} to="/login/"
                variant="contained">
                    Login
            </Button>
            <Button 
                style={{position:'absolute', left:'70%', top:'65%', width:'20%', height:'10%'}}
                id='login-button'
                onClick={handleGuest}
                variant="contained">
                    Continue as Guest
            </Button>
        </div>
    )
}