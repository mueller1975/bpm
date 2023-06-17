import { Box, Popover, Switch, Tooltip, Typography, Zoom } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useMessages } from 'Hook/contextHooks.jsx'
import React from 'react'
import { styled } from '@mui/material/styles';

/**
 * 欄位過濾元件
 */
export default React.memo(styled(props => {
    const { on, disabled, onSwitch, children, className, ...otherProps } = props
    const getMessage = useMessages()

    return (
        <Popover {...otherProps} PaperProps={{ className }}>
            {/* 標題列 */}
            <Box display="flex" alignItems="center">
                <FilterListIcon />
                <Typography variant="h6" style={{ flex: 1, marginLeft: 4 }}>{getMessage('columnFilter.title')}</Typography>

                {/* 切換過濾條件 */}
                <Tooltip arrow title={getMessage('columnFilter.switch')} placement="bottom" TransitionComponent={Zoom}>
                    <Switch color="warning" checked={on} disabled={disabled} onChange={onSwitch} />
                </Tooltip>
            </Box>

            {/* 條件區塊 */}
            <Box display="flex" position="relative">
                {/* 過濾條件遮罩 */}
                {!on && <div className="mask" />}

                {/* 過濾條件選擇 */}
                {children}
            </Box>
        </Popover>
    )
})`
    padding: 12px 16px 16px;

    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        border-radius: 4px;
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(197 197 197 / 61%)' : 'rgb(10 12 29 / 61%)'};
    }
`);
