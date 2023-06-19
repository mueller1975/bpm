/**
 * 全螢幕遮罩 Component
 */
import React from 'react'
import { Modal, CircularProgress } from '@mui/material'

export default props => {

    const style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    return (
        <Modal disableEnforceFocus disableAutoFocus style={style} {...props}>
            <CircularProgress color="secondary" size={80} thickness={4} />
        </Modal>
    )
}