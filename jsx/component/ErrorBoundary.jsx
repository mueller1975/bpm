import { Typography } from '@mui/material'
import React from 'react'

const errorStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    border: '2px dashed #f44336',
    boxSizing: 'border-box',
    padding: 8,
    overflow: 'hidden',
}

const ErrorDisplay = ({ error }) => {

    return (
        <div style={errorStyle}>
            <div style={{ overflow: 'auto', padding: 8 }}>
                <Typography color="error" align="center" variant="h3" paragraph>Oops...</Typography>
                <Typography color="error" align="center">{error?.message ?? error}</Typography>
            </div>
        </div>
    )
}

/**
 * 錯誤處理 class
 */
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        console.error('Error caught by ErrorBoundary:', error)
        return { hasError: true, error }
    }

    render() {
        return this.state.hasError ? <ErrorDisplay error={this.state.error} /> : this.props.children
    }
}
