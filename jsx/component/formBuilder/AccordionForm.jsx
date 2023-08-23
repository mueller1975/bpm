import { css } from "@emotion/react";
import { useIntersection } from '@mantine/hooks';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Fab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { animated } from '@react-spring/web';
import { useConfirmDialog } from 'Context/ConfirmDialogContext.jsx';
import { useSlideSpring } from 'Hook/useAnimations.jsx';
import React, { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { blink, jiggle } from '../styled/Animations.jsx';
import Form from './Form.jsx';
import { newlyDeletedUUIDState } from "./context/BuilderStates";
import { allFormsState } from "./context/FormStates";
import { propsHierarchyState } from "./context/PropsHierarchyState";
import { getIconComponent } from './lib/formUI.jsx';
import TransformIcon from '@mui/icons-material/Transform';

const AnimatedAccordion = animated(Accordion);

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { form, selected, onChange, expanded, data, className, containerRef } = props;

    const [propsHierarchy, setPropsHierarchy] = useRecoilState(propsHierarchyState('FORM'));
    const [allForms, setAllForms] = useRecoilState(allFormsState);
    const setNewlyDeletedUUID = useSetRecoilState(newlyDeletedUUIDState); // 設定剛刪除的元件 UUID

    const { setDialog: setConfirmDialog, closeDialog: closeConfirmDialog } = useConfirmDialog();

    const { uuid, id, title, icon, components, } = form;
    const SummaryIcon = getIconComponent(icon);

    const formToggleHandler = useCallback((e, expanded) => onChange(uuid, expanded), [onChange]);

    const animProps = useSlideSpring();

    const { ref: iRef, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
        rootMargin: '-4px 0px 0px 0px',
    });

    // 編輯表單屬性
    const editForm = useCallback(e => {
        e.stopPropagation();
        setPropsHierarchy([uuid]);
    }, []);

    // 刪除表單
    const doDeleteForm = useCallback(() => {
        const newForms = allForms.filter(form => form.uuid !== uuid);
        setAllForms(newForms);
        setNewlyDeletedUUID(uuid);
        closeConfirmDialog();
    }, [allForms]);

    // 確認刪除表單
    const confirmDeleteForm = useCallback(e => {
        e.stopPropagation();

        setConfirmDialog({
            title: '刪除表單確認', content: '刪除後無法復原，您確定要刪除表單？', open: true, severity: 'fatal',
            onConfirm: doDeleteForm,
            onCancel: () => true
        });
    }, [doDeleteForm]);

    const importFields = () => {
        console.log('importing...')
    };

    return (
        <AnimatedAccordion key={id} ref={ref} style={animProps} onChange={formToggleHandler} expanded={expanded}
            className={`MT-AccordionForm ${className} ${selected ? 'selected' : ''} ${uuid === propsHierarchy[0] ? 'editing' : ''}`}>

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
                    <Fab size="small" color="error" onClick={confirmDeleteForm}><DeleteIcon /></Fab>
                    <Fab size="small" color="success" onClick={importFields}><TransformIcon /></Fab>
                    <Fab size="small" color="warning" onClick={editForm}><EditIcon /></Fab>
                </div>
            </AccordionSummary>

            <AccordionDetails>
                <Form uuid={uuid} id={id} editable components={components} data={data} />
            </AccordionDetails>
        </AnimatedAccordion >
    );
}))`

    &.MT-AccordionForm {
        position: relative;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#72777f 8px 8px 8px 0px' : '#121212 8px 8px 8px 0px'};
        background-color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(250 250 250)' : 'rgb(27 33 43)'};

        &.editing {
            border: 1px dashed #94f579;
            padding: 4px;
            border-radius: 4px;
        }

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
    }
`);