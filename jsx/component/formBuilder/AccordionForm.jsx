import { css } from "@emotion/react";
import { useIntersection } from '@mantine/hooks';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Fab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import { useSlideSpring } from 'Hook/useAnimations.jsx';
import React, { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { blink, jiggle } from '../styled/Animations.jsx';
import Form from './Form.jsx';
import { propertiesState } from "./context/PropertiesState.js";
import { getIconComponent } from './lib/formUI.jsx';

const AnimatedAccordion = animated(Accordion);

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { form, selected, onChange, onCreate, expanded, data, className, containerRef } = props;
    const setFormProperties = useSetRecoilState(propertiesState('FORM'));

    const { uuid, id, title, icon, components, } = form;
    const SummaryIcon = getIconComponent(icon);

    const formToggleHandler = useCallback((e, expanded) => onChange(uuid, expanded), [onChange]);

    useEffect(() => {
        if (!id) {
            setFormProperties({ uuid });
            onCreate(uuid);
        }
    }, []);

    const animProps = useSlideSpring();

    const { ref: iRef, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
        rootMargin: '-4px 0px 0px 0px',
    });

    const editForm = useCallback(e => {
        e.stopPropagation();
        console.log({ form })
        setFormProperties({ uuid, inputFocused: true });
    }, [form]);

    const deleteForm = useCallback(e => {
        e.stopPropagation();

    }, [form]);

    // console.log(title, '=>', entry?.isIntersecting, entry?.intersectionRatio)

    return (
        <AnimatedAccordion key={id} ref={ref} style={animProps} onChange={formToggleHandler} expanded={expanded}
            className={`${className} ${selected ? 'selected' : ''}`}>

            <AccordionSummary ref={iRef} expandIcon={<ExpandMoreIcon />}
                // accordion 標題 highlighted 條件
                className={
                    expanded // 展開時
                        && entry?.intersectionRatio < 1 // 重疉區域開始變小時
                        && entry?.boundingClientRect.y < 70 // 重疉區域是在 container 上方                                  
                        ? 'intersected' : ''}>

                {/* Form 圖示 */}
                <SummaryIcon className="summaryIcon" />

                {/* Form 名稱 */}
                <Typography variant="subtitle1" color="success.light">{title}</Typography>

                {/* Form 動作列按鈕 */}
                <div className="formActions">
                    <Fab size="small" color="error" onClick={deleteForm}><DeleteIcon /></Fab>
                    <Fab size="small" color="warning" onClick={editForm}><EditIcon /></Fab>
                </div>
            </AccordionSummary>

            <AccordionDetails>
                <Form uuid={uuid} id={id} editable components={components} data={data} />
            </AccordionDetails>
        </AnimatedAccordion>
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
            z-index: 9999;
            background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#ffb69a' : '#4a74ad'} !important;        
        }

        :hover {
            .formActions {
                opacity: 1;
            }
        }

        .formActions {
            opacity: 0;
            position: absolute;
            right: 60px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: opacity .8s;

            >button {
                transition: all .8s;
                color: lightgray;

                :hover {
                    color: white;
                    animation: ${jiggle} .15s 3;
                }
            }
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