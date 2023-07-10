import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
    TimelineConnector, TimelineContent, TimelineDot, TimelineItem,
    TimelineOppositeContent, TimelineSeparator
} from '@mui/lab';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { LOG_ACTION } from '../lib/formConsts';
import { jsonToObject } from '../lib/form';

const LogDetails = React.memo(styled(({ action, value, className }) => {

    const [notice, comments] = useMemo(() => {
        let details = [undefined, value];

        try {
            let obj = jsonToObject(value);
            details = action == 'ADD_REVIEWERS' ? [obj, undefined] : [undefined, obj];
        } catch (e) {
            console.error("JSON 解析失敗:", e);
        }

        return details;
    }, []);

    return (
        <div className={className}>
            { /* 執行人員意見 */
                notice ? undefined :
                    typeof (comments ?? '') == 'string' ? <Typography variant="body2" color="text.secondary" className="comments">{comments || '無意見。'}</Typography> :
                        Array.isArray(comments) ? <div>ARRAY</div> :
                            typeof comments == 'object' ?
                                <ol className="messageList">
                                    {
                                        Object.entries(comments).map(([key, value], i) =>
                                            <li key={i}>
                                                <Typography variant='body2'>{key}：</Typography>
                                                <Typography variant='body2' color='textSecondary'>{value}</Typography>
                                            </li>
                                        )
                                    }
                                </ol> : undefined
            }

            { /* 發起會簽 */
                notice &&
                <>
                    <div className="reviewers">
                        <GroupAddIcon fontSize='small' />
                        <Typography variant="body2" color="text.secondary">{notice.reviewers.map(r => r.name).join('、')}：</Typography>
                    </div>

                    <Typography variant="body2" color="text.secondary" className="comments">{notice.notice}</Typography>
                </>
            }
        </div>
    );

})`
    .comments {
        white-space: break-spaces;        
    }

    .messageList {
        padding-inline-start: 24px;

        >li {
            padding-left: 4px;

            :nth-of-type(n+2) {
                margin-top: 4px;
            }
        }
    }

    .reviewers {
        display: flex;
        align-items: center;
        gap: 6px;

        &>.MuiSvgIcon-root {
            color: #90b5cf;
        }

        &>.MuiTypography-root {
            color: #6d95cc;
        }
    }
`);

/**
 * MPB 單一動作歷程記錄
 */
export default React.memo(styled(React.forwardRef((props, ref) => {
    const { id, actor, actorName, details, action, logTime, className } = props;

    const logAction = LOG_ACTION[action];
    const { text: actionName, icon: ActionIcon, style: { color: actionColor },
        isStartOfProcess = false, isEndOfProcess = false } = logAction;
    const [notice, comments] = action == 'ADD_REVIEWERS' ? [JSON.parse(details), undefined] : [undefined, details];
    // let comments = !details ? '無意見。' : details.charAt(0) != '{' ? details : JSON.parse(details)?.notice;

    const [dotClass, iconClass] = isStartOfProcess || isEndOfProcess ? ['endDot', 'endIcon'] : ['interDot', undefined];

    return (
        <TimelineItem ref={ref} className={className}>
            <TimelineOppositeContent className="actionContent">
                {/* 歷程動作 */}
                <Typography variant="subtitle1" component="span" color={actionColor} sx={{ fontWeight: 'bold' }}>
                    {actionName}
                </Typography>

                {/* 歷程時間 */}
                <Typography variant="subtitle2" color="text.secondary" noWrap>{logTime}</Typography>
            </TimelineOppositeContent>

            {/* 區隔元件 */}
            <TimelineSeparator>
                {/* 圖示 */}
                <TimelineDot sx={{ bgcolor: actionColor, borderColor: actionColor }} className={dotClass}>
                    <ActionIcon className={iconClass} />
                </TimelineDot>

                {/* 連接線 */}
                <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent className="tlContent">
                {/* 執行人員姓名 */}
                <Typography variant="subtitle1">{actorName}</Typography>

                {/* log 資訊 */}
                <LogDetails action={action} value={details} />
            </TimelineContent>
        </TimelineItem>
    )
}))`
    transition: background .65s;

    :hover {
        background-color: rgb(96 120 152 / 15%);
    }

    &.MuiTimelineItem-root {
        margin: 0;
        min-height: 80px;
    }

    .tlContent {
        min-width: 120px;
    }

    .endDot {
        background-clip: content-box;
    }

    .interDot {
        // background-clip: content-box;
        // border-color: transparent;
    }

    .endIcon {
        margin: 4px;
    }

    .actionContent {
        flex-grow: .3;
    }
    
`);