import { css } from "@emotion/react";
import { useIntersection } from '@mantine/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, Box, Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import { useSlideSpring } from 'Hook/useAnimations.jsx';
import React, { useCallback } from 'react';
import { blink } from '../styled/Animations.jsx';
import Form from './Form.jsx';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { formPropertiesState } from "./context/PropertiesState.js";
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { updateFormSelector } from './context/FormStates.jsx';

const AnimatedAccordion = animated(Accordion);

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { form, selected, onChange, expanded, data, className, containerRef } = props;
    const { id, title, icon: SummaryIcon, components, } = form;
    const updateForm = useSetRecoilState(updateFormSelector);

    const formToggleHandler = useCallback((e, expanded) => onChange(id, expanded), [onChange]);

    const setFormProperties = useSetRecoilState(formPropertiesState);

    // console.log('form accordion:', id)

    const animProps = useSlideSpring();

    const { ref: iRef, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
        rootMargin: '-4px 0px 0px 0px',
    });

    // console.log(title, '=>', entry?.isIntersecting, entry?.intersectionRatio)

    const addForm = useCallback(() => {
        updateForm({ afterFormUUID: form.uuid, form: {} });
    });

    const editForm = useCallback(e => {
        e.stopPropagation();
        console.log({ form })
        setFormProperties({ ...form });
    }, [form]);

    const deleteForm = useCallback(() => {

    });

    return (

        // 不可 mountOnEnter=true, 因保存時, 如 form 未曾展開, 該 form 所有欄位值無法被取得
        // <Fade in={!hidden} timeout={DURATION}>
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
                <Box className="formActions">
                    <Fab size="small" color="error" onClick={deleteForm}><DeleteIcon /></Fab>
                    <Fab size="small" color="success" onClick={addForm}><AddIcon /></Fab>
                    <Fab size="small" color="warning" onClick={editForm}><EditIcon /></Fab>
                </Box>
            </AccordionSummary>

            <AccordionDetails>
                <Form id={id} editable components={components} data={data} />
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
            // background: rgb(63 91 124) !important;
            // background: rgb(171 7 7) !important;
            // background: #6d95cc !important;
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
                color: darkgray;

                &.MuiFab-warning {
                    background-color: rgb(255 167 38 / 50%);

                    :hover {
                        background-color: rgb(255 167 38 / 100%);
                    }
                }

                &.Mui-error {
                    background-color: rgb(244 67 54 / 50%);

                    :hover {
                        background-color: rgb(244 67 54 / 100%);
                    }
                }

                &.MuiFab-success {
                    background-color: rgb(102 187 106 / 50%);

                    :hover {
                        background-color: rgb(102 187 106 / 100%);
                    }
                }

                :hover {
                    color: lightgray;
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