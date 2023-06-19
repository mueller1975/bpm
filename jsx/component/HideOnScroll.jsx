import React from 'react'
import { Slide, useScrollTrigger } from '@mui/material'

/**
 * scroll bar 滑動後隱藏元件
 */
export default React.memo(props => {
    const { target, direction = "down", threshold } = props // target: 目標 DOM node
    const trigger = useScrollTrigger({ threshold, target: target || undefined })

    // console.log({ name: props.name, trigger })
    return (
        <Slide appear={false} direction={direction} in={!trigger}>
            {props.children}
        </Slide>
    )
});