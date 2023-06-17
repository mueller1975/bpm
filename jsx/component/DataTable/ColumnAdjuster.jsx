/**
 * 調整欄位順序 & 顯示/隱藏 Component
 */
import CloseIcon from '@mui/icons-material/Close'
import ReplySharpIcon from '@mui/icons-material/ReplySharp'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Box, Fab, IconButton, Popover, Tooltip, Typography, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import { moveArrayElement } from 'Tools'
import { useMessages } from 'Hook/contextHooks.jsx'
import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

export default React.memo(styled(props => {
    /* Component props: { 表格 columns, 調整 columns handler, 回復預設 columns handler, 儲存調整後的 columns, Popover props... } */
    const { columns, onChangeColumns, onRestoreDefault, onSave, className, ...otherProps } = props

    /* Componen states */
    const [oldColumns, setOldColumns] = useState([]) // 原先的欄位設定
    const [dirty, setDirty] = useState(false) // 是否已變更欄位設定

    const getMessage = useMessages() // 多語系轉換 function

    // console.log("THIS IS ColumnAdjuster@@@@@@@@@@@")

    /* Popover 開啟前動作 */
    const initColumns = () => {
        let cols = cloneDeep(columns) // 複製預設欄位 (使 cloneDeep, 因 object property 內容可能有 function)
        setOldColumns(cols) // 儲存變更前欄位設定
        setDirty(false)
    }

    /* Popover 關閉後動作 */
    const exitHandler = () => {
        if (dirty) {
            setDirty(false)
            onSave(columns) // 儲存欄位設定
        }
    }

    /* 切換顯示/隱藏欄位 */
    const toggleVisible = index => {
        let hidden = !columns[index].hidden
        columns[index].hidden = hidden

        setDirty(true)
        onChangeColumns([...columns])
    }

    /* 取消變更 */
    const cancelAdjustment = e => {
        setDirty(false)
        onChangeColumns(oldColumns)
    }

    /* 回復預設欄位設定 */
    const restoreDefaultHandler = () => {
        setDirty(true)
        onRestoreDefault()
    }

    /* 拖放結束後動作 */
    const onDragEnd = result => {
        if (result.destination) {
            const { source: { index: from }, destination: { index: to } } = result

            if (from !== to) {
                // 調整欄位順序
                moveArrayElement(columns, from, to)
                onChangeColumns([...columns])
                setDirty(true)
            }
        }
    }

    return (
        <Popover {...otherProps} TransitionProps={{ onEnter: initColumns, onExited: exitHandler }} PaperProps={{ className }}>
            {/* 標題列 */}
            <Box display="flex" alignItems="center" marginBottom={1}>
                {/* 圖示 */}
                <ViewColumnIcon />

                {/* 標題 */}
                <Typography variant="h6" style={{ flex: 1, marginLeft: 4, marginRight: 8 }}>{getMessage('columnAdjuster.title')}</Typography>

                {/* 回復預設欄位 */}
                <Fab size="small" color="primary" onClick={restoreDefaultHandler}>
                    <Tooltip title={getMessage('columnAdjuster.restoreDefault')} placement="bottom" TransitionComponent={Zoom}>
                        <ReplySharpIcon color="inherit" />
                    </Tooltip>
                </Fab>

                {/* 取消並關閉按鈕 */}
                <Fab size="small" color="secondary" style={{ marginLeft: 6 }} onClick={cancelAdjustment} disabled={!dirty}>
                    <Tooltip title={getMessage('columnAdjuster.cancel')} placement="bottom" TransitionComponent={Zoom}>
                        <CloseIcon color="inherit" />
                    </Tooltip>
                </Fab>
            </Box>

            <Box minWidth={230} overflow="auto" padding={0.5} maxHeight="calc(100vh - 150px)">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%' }}>
                                {columns.map((col, index) => (
                                    <Draggable key={col.prop} draggableId={col.prop} index={index}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                className={`item ${col.hidden ? 'disabled' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}>

                                                {/* 圖示 */}
                                                <TextFieldsIcon color={col.hidden ? "disabled" : "primary"} size="small" />

                                                {/* 欄位名稱 */}
                                                <Typography variant="body2" color={col.hidden ? "textSecondary" : "textPrimary"} style={{ flex: 1, marginLeft: 4 }}>
                                                    {col.name}
                                                </Typography>

                                                {/* 顯示/隱藏欄位按鈕*/}
                                                <IconButton size="small" onClick={e => toggleVisible(index)}>
                                                    {col.hidden ? <VisibilityOffIcon color="disabled" size="small" /> : <VisibilityIcon color="secondary" size="small" />}
                                                </IconButton>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>
        </Popover>
    )
})`
    padding: 12px 16px 16px;

    .item {
        user-select: none;
        padding: 4px;
        margin: 0 0 8px 0;
        border-radius: 4px;
        display: flex;
        align-items: center;
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(35 122 211 / 42%)' : 'rgb(24 57 109 / 50%)'};

        &:hover {
            background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(116 170 225)' : 'rgb(40 83 140 / 74%)'};
            border-color: rgb(48 97 140 / 70%);
        }
        
        &:active {
            background-color: rgb(40 83 140 / 74%);
        }
    }

    .disabled {
        background-color: rgb(158 158 158 / 35%);
    }

    .dragging {
        border: 1px dashed rgb(132 189 249 / 70%);
    }
}))
`);