import { Avatar, AvatarGroup, Chip, Popover, Typography } from '@mui/material';
import { orange, pink, yellow } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { useNotification } from 'Hook/useTools.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import FlowTaskAssignees from './FlowTaskAssignees.jsx';
import { formState } from './context/FormContextStates';
import { APPROVAL_STATUS } from './lib/formConsts';
import { useQueryUserTasks } from './lib/useFetchAPI.js';

const ASSIGNEE_AVATAR_STYLES = [
    { bgcolor: yellow[700] },
    { bgcolor: orange[500] },
    { bgcolor: pink[500] }
];

const MAX_TASK_ASSIGNEE_COUNT = ASSIGNEE_AVATAR_STYLES.length;

const anchorOrigin = { vertical: 'bottom', horizontal: 'left', };
const transformOrigin = { vertical: 'top', horizontal: 'left', };

export default React.memo(styled(props => {
    const { className, formId } = props;
    const [userTasks, setUserTasks] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const mainForm = useRecoilValue(formState("main"));

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        console.log("LEAVE........")
    };

    const approvalStatus = mainForm?.approvalStatus;
    const open = Boolean(anchorEl);

    const { text: status, icon: StatusIcon, color: statusColor } = APPROVAL_STATUS[approvalStatus] ?? {};

    const { showError } = useNotification();

    const { execute: queryUserTasks, pending } = useQueryUserTasks(result => {
        setUserTasks(result);
    }, showError);

    useEffect(() => {
        approvalStatus == 'PENDING' && formId && queryUserTasks({ params: formId }); // 審批中的單才查詢審批人員
    }, [approvalStatus, formId]);

    const tasks = useMemo(() => userTasks.map(({ taskId, assignee, assigneeName, formPrivileges }, index) =>
        <Avatar key={taskId} className="assignee" sx={ASSIGNEE_AVATAR_STYLES[index]}>{assigneeName.substring(0, 1)}</Avatar>
    ).slice(0, MAX_TASK_ASSIGNEE_COUNT), [userTasks]);

    return (
        <>
            <div className={className}>
                <Chip className="status" color="primary" size='large'
                    label={
                        <span className="label">
                            {StatusIcon && <StatusIcon color={statusColor} />}

                            <Typography color="textSecondary" variant="subtitle1" component="span" className="statusTitle">{status}</Typography>

                            {userTasks.length > 0 &&
                                <AvatarGroup total={userTasks.length} className="assigneeGroup" onMouseOver={handlePopoverOpen}>
                                    {tasks}
                                    {/* <SpringTransition2 effect="slideDown" items={tasks} keys={({ key }) => key} bounce={2}>
                                {task => task}
                            </SpringTransition2> */}
                                </AvatarGroup>
                            }
                        </span>
                    }
                />
            </div>
            <Popover
                elevation={16}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                onClose={handlePopoverClose}
                disableRestoreFocus
                onMouseLeave={handlePopoverClose}
            >
                <FlowTaskAssignees value={userTasks} />
            </Popover>
        </>
    );
})`
    .label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status {
        height: 36px;
        // background-color: rgb(177 61 25 / 50%);
        background-color: rgb(120 50 29);
        border-radius: 32px;
        transition: all 3s;
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '6px 6px 6px 0px #72777f' : 'rgb(1 3 10) 6px 6px 6px 0px'};
    }

    .statusAvatar {
        background-color: rgb(189 106 81) !important;
        width: 28px !important;
        height: 28px !important;
        color: #ffd335 !important;
        font-size: 18px !important;
    }

    .assigneeGroup {
        :hover {
            cursor: pointer;
        }

        margin-left: 4px;

        .MuiAvatar-root {
            width: 32px;
            height: 32px;

            // 數字 avatar 字型要小點
            :not(.assignee) {
                font-size: 16px;
            }

            margin-left: -6px !important;
        }
    }

    .statusTitle {
        ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'color: #ffeb3b' : ''}
    }
`);