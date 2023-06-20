/**
 * 確認對話框
 */
import BlockIcon from '@mui/icons-material/Block';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SlideUpTransition } from 'Animations';
import { DraggableDialog, ProgressButton } from 'Components';
import PropTypes from 'prop-types';
import React from 'react';

const TITLE_ICONS = {
    'info': HelpOutlineIcon,
    'warn': ErrorOutlineIcon,
    'fatal': CancelOutlinedIcon
}

const CANCEL_TEXT = "取消";
const CONFIRM_TEXT = "確定";

const ConfirmDialog = React.memo(styled(props => {
    const { title, titleIcon, content, onCancel, onConfirm, cancelText, confirmText,
        isProgressing = false, errMsg, severity = "info", actionButtons, open = false, className, ...others } = props

    const TitleIcon = titleIcon || TITLE_ICONS[severity];

    return (
        <DraggableDialog {...others} open={open} TransitionComponent={SlideUpTransition} className={className}
            classes={{ paper: severity }}>
            <DialogTitle>
                <Box display="flex" alignItems="center"><TitleIcon style={{ marginRight: 4 }} />{title}</Box>
            </DialogTitle>

            <DialogContent>
                {
                    !content ? undefined :
                        React.isValidElement(content) ? content :
                            Array.isArray(content) ? content.map((line, i) => <DialogContentText key={i}>{line}</DialogContentText>) :
                                typeof content == 'string' ? <DialogContentText>{content}</DialogContentText> :
                                    <ol className="messageList">
                                        {
                                            Object.entries(content).map(([key, value], i) =>
                                                <li key={i}>
                                                    <Typography>{key}：</Typography>
                                                    <Typography color='textSecondary'>{value}</Typography>
                                                </li>
                                            )
                                        }
                                    </ol>
                }

                {props.children}

                {errMsg &&
                    <>
                        <Divider />
                        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 8 }}>
                            <BlockIcon color="error" fontSize="small" />
                            <Typography color="error" variant="body2">{errMsg}</Typography>
                        </div>
                    </>
                }
            </DialogContent>

            <DialogActions className="actions">
                {
                    actionButtons ? actionButtons :
                        <>
                            {
                                onCancel &&
                                <ProgressButton variant="contained" color="warning" text={cancelText || CANCEL_TEXT}
                                    onClick={onCancel} disabled={isProgressing} icon={CancelOutlinedIcon} />
                            }

                            <ProgressButton autoFocus variant="contained" color="secondary" text={confirmText || CONFIRM_TEXT}
                                isProgressing={isProgressing} onClick={onConfirm} icon={CheckOutlinedIcon} />
                        </>
                }
            </DialogActions>
        </DraggableDialog>
    )
})`
    .MuiPaper-root {
        min-width: 300px;
    }    

    .MuiDialogTitle-root {
        color: #fff;
    }

    .MuiDialogContentText-root {
        color: rgba(255, 255, 255, 0.7);

        :nth-of-type(n+2) {
            margin-top: 8px;
        }
    }
    
    .messageList {
        >li {
            padding-left: 8px;

            :nth-of-type(n+2) {
                margin-top: 8px;
            }

            ::marker {
                color: rgba(255, 255, 255, 0.8);
                font-weight: bold;
                font-size: 18px;
            }

            >p:first-of-type {
                color: rgba(255, 255, 255);
            }

            >p:nth-of-type(2) {
                color: rgba(255, 255, 255, 0.7);
            }
        }        
    }

    .actions {
        padding: 4px 24px 20px;
    }

    .info {
        background: linear-gradient(45deg,rgb(2 24 47 / 80%),rgb(4 38 84 / 88%),rgb(1 55 88 / 66%));
    }

    .warn {
        background: linear-gradient(45deg,rgb(136 55 16 / 90%),rgb(208 90 7 / 90%),rgb(136 55 16 / 90%));
    }

    .fatal {
        background: linear-gradient(45deg,rgba(0, 0, 0, 0.86),rgba(58, 0, 0, 0.85),rgba(181, 0, 0, 0.8));
    }
`);

ConfirmDialog.propTypes = {
    severity: PropTypes.oneOf(['info', 'warn', 'fatal'])
};

export default ConfirmDialog;