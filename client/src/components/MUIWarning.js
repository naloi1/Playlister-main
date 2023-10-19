import { useContext } from 'react'
import AuthContext from '../auth';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';

export default function MUIWarning() {
    const { auth } = useContext(AuthContext);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400
    };

    function handleButtonPress(event) {
        auth.hideModals();
    }

    return (
        <Modal
            open={auth.isWarningModalOpen()}
        >
            <Alert severity="warning" sx={style} onClose={() => {handleButtonPress()}}>
            {auth.modalText}
            </Alert>

        </Modal>
    );
}