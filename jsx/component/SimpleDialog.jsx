/**
 * 簡易對話框範本
 */
import {
    DialogContent, DialogTitle, SpeedDial, SpeedDialAction, SpeedDialIcon,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { SlideUpTransition } from 'Animations';
import { DraggableDialog } from 'Components';
import React from 'react';

const FAB_PROPS = { size: 'medium', color: 'warning' };

export default React.memo(styled(props => {
    const { open, icon: TitleIcon, title, actions, className, children, ...others } = props;

    return (
        <DraggableDialog {...others} open={open} TransitionComponent={SlideUpTransition}
            className={`MT-MappingDialog ${className}`}>

            <DialogTitle className="title">
                <TitleIcon />
                <Typography>{title}</Typography>
            </DialogTitle>

            <DialogContent className="content">
                {children}

                <SpeedDial className="actions" icon={<SpeedDialIcon />} ariaLabel="表單動作" direction="left"
                    FabProps={FAB_PROPS}>

                    {actions.map(action => <SpeedDialAction {...action} />)}
                </SpeedDial>
            </DialogContent>

        </DraggableDialog>
    );
})`
    &.MT-MappingDialog {
        .title {
            display: flex;
            gap: 4px;
        }

        .content {
            min-height: 100px;

            >.actions {
                position: absolute;
                right: 16px;
                bottom: 16px;
            }

        }
    }
`);