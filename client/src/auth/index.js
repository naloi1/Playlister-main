import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_ERROR: "LOGIN_ERROR",
    HIDE_MODALS: "HIDE_MODALS",
    LOGIN_GUEST: "LOGIN_GUEST"
}

const CurrentModal = {
    NONE : "NONE",
    WARNING: "WARNING"
}


function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        currentModal: CurrentModal.NONE,
        modalText: "",
        guest: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    currentModal : CurrentModal.NONE,
                    modalText: auth.modalText,
                    guest: auth.guest
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    currentModal : CurrentModal.NONE,
                    modalText:  auth.modalText,
                    guest: false
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    currentModal : CurrentModal.NONE,
                    modalText: auth.modalText,
                    guest: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    currentModal : CurrentModal.NONE,
                    modalText: auth.modalText,
                    guest: false
                })
            }
            case AuthActionType.LOGIN_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    currentModal : CurrentModal.WARNING,
                    modalText: payload,
                    guest: false
                })
            }
            case AuthActionType.HIDE_MODALS: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    currentModal : CurrentModal.NONE,
                    modalText: auth.modalText,
                    guest: false
                })
            }
            case AuthActionType.LOGIN_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    currentModal : CurrentModal.NONE,
                    modalText:  auth.modalText,
                    guest: true
                })
            }
            default:
                return auth;
        }
    }

    auth.isWarningModalOpen = () => {
        return auth.currentModal === CurrentModal.WARNING;
    }

    auth.hideModals = () => {
        authReducer({
            type: AuthActionType.HIDE_MODALS,
            payload: {}
        });    
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        } 
    }

    auth.registerUser = async function(username, email, firstName, lastName, password, passwordVerify) {
        const response = await api.registerUser(username, email, firstName, lastName, password, passwordVerify);      
        if (response.status === 200) {
            console.log("User Registered ****************************************");
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        } else{
            console.log("Failed to Register User ****************************************");
            authReducer({
                type: AuthActionType.LOGIN_ERROR,
                payload: response.data.errorMessage
            });
        }
    }

    auth.loginUser = async function(email, password) {
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            console.log("User Login Success ****************************************");
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        } else {
            console.log("User Login Fail ****************************************");
            authReducer({
                type: AuthActionType.LOGIN_ERROR,
                payload: response.data.errorMessage
            });
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        //console.log("user initials: " + initials);
        return initials;
    }

    auth.guestLogin = function(){
        authReducer({
            type: AuthActionType.LOGIN_GUEST
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };