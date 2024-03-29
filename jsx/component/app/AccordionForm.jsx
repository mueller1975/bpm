import { css } from "@emotion/react";
import { useIntersection } from '@mantine/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import { useSlideSpring } from 'Hook/useAnimations.jsx';
import React, { useCallback } from 'react';
import { blink } from '../styled/Animations.jsx';
import Form from './Form.jsx';
import { Conditional } from './lib/formComponents.jsx';
import { getIconComponent } from './lib/formUI.jsx';

const AnimatedAccordion = animated(Accordion);

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { form, data, readOnly = false, containerRef, selected, hidden = false,
        onChange, expanded, className } = props;

    const { uuid, id, title, icon, components, editableWhen } = form;

    const formToggleHandler = useCallback((e, expanded) => onChange(uuid, expanded), [onChange]);

    console.log('【AccordionForm】', id, '=>', data)

    const animProps = useSlideSpring({
        reverse: hidden
    });

    const { ref: iRef, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
        rootMargin: '-4px 0px 0px 0px',
    });

    // console.log(title, '=>', entry?.isIntersecting, entry?.intersectionRatio)

    const SummaryIcon = getIconComponent(icon);

    return (
        <Conditional formId={id} editableWhen={editableWhen}>
            {
                ({ available, required, disabled, editable }) => {
                    // console.log(id, '=> editable?', editable);
                    const readMode = readOnly || !editable;

                    return (
                        // 不可 mountOnEnter=true, 因保存時, 如 form 未曾展開, 該 form 所有欄位值無法被取得
                        // <Fade in={!hidden} timeout={DURATION}>
                        <AnimatedAccordion key={id} ref={ref} style={animProps} onChange={formToggleHandler} expanded={expanded}
                            className={`${className} ${readMode ? 'readOnly' : ''} ${selected ? 'selected' : ''} ${hidden ? 'hidden' : ''}`}>

                            <AccordionSummary ref={iRef} expandIcon={<ExpandMoreIcon />}
                                // accordion 標題 highlighted 條件
                                className={
                                    expanded // 展開時
                                        && entry?.intersectionRatio < 1 // 重疉區域開始變小時
                                        && entry?.boundingClientRect.y < 70 // 重疉區域是在 container 上方                                  
                                        ? 'intersected' : ''}>
                                <SummaryIcon className={`summaryIcon ${readMode ? 'disabled' : ''}`} />
                                <Typography variant="subtitle1" color={readMode ? 'textSecondary' : 'success.light'}>{title}</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Form id={id} editable={!readMode} components={components} data={data} />
                            </AccordionDetails>
                        </AnimatedAccordion>
                        // </Fade>
                    );
                }
            }
        </Conditional>
    );
}))`
    position: relative;
    box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#72777f 8px 8px 8px 0px' : '#121212 8px 8px 8px 0px'};
    background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(250 250 250)' : 'rgb(27 33 43)'};

    &.hidden {
        margin: 0;
        content-visibility: hidden;
    }

    &.selected {
        animation: ${css`${blink} 300ms 3 linear forwards`};
    }

    &.readOnly {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(242 242 242)' : 'rgb(35 42 54)'};        
    }
    
    &:hover {
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 255 255)' : 'rgb(24 30 39)'};
    }

    &.Mui-expanded:not(.hidden):first-of-type {
        // margin-top: 0 !important;
    }

    &.Mui-expanded {
        margin: 20px 0;
    }

    .MuiAccordionSummary-root {
        position: sticky;
        top: 0;
        z-index: 3;

        &.intersected {
            // background: rgb(63 91 124) !important;
            // background: rgb(171 7 7) !important;
            // background: #6d95cc !important;
            background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#ffb69a' : '#4a74ad'} !important;        
        }
    }

    .MuiAccordionSummary-root.Mui-expanded {
        min-height: auto !important;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#efffb47d' : '#111522a1'};
        transition: background .5s;
    }
    
    .MuiAccordionSummary-content {
        align-items: center;

        &.Mui-expanded {
            margin: 12px 0; 
        }
    }

    .MuiAccordionDetails-root {
        padding: 16px;
    }

    .summaryIcon {
        margin-right: 8px;
        color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#12b118' : '#9edba1'};

        &.disabled {
            color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)'};
        }
    }

`);