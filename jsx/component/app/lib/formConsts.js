import ApprovalIcon from '@mui/icons-material/Approval';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ReplayIcon from '@mui/icons-material/Replay';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// 單一上傳檔案大小及所有檔案大小總合限制
export const MAX_FILE_MB = 20, MAX_UPLOAD_FILE_MB = 50;

// 請求動作
export const REQUEST_ACTION = Object.freeze({
    SAVE: 'SAVE', // 儲存
    APPLY: 'APPLY', // 提交
    REAUDIT: 'REAUDIT', // 發起重審
    AGREE: 'AGREE', // 同意
    DISAGREE: 'DISAGREE', //不同意
    APPROVE: 'APPROVE', // 審批通過
    REJECT: 'REJECT', // 審批不通過
    ADD_REVIEWERS: 'ADD_REVIEWERS', // 加會簽
    REVIEW: 'REVIEW', // 會簽
    TRIGGER_CLARIFICATION: 'TRIGGER_CLARIFICATION', // 觸發訂單澄清
    TRIGGER_QA_REVIEW: 'TRIGGER_QA_REVIEW', // 觸發品保審單
    IMPORT: 'IMPORT', // 手動匯入
});

// 請求動作圖示/CSS
export const LOG_ACTION = Object.freeze({
    SAVE: { text: '保存', icon: SaveAltIcon, style: { color: 'primary.light' } },
    APPLY: { text: '提交', icon: SendIcon, style: { color: 'warning.light' }, isStartOfProcess: true },
    REAUDIT: { text: '發起重審', icon: ReplayIcon, style: { color: 'warning.light' }, isStartOfProcess: true },

    AGREE: { text: '同意', icon: ThumbUpAltIcon, style: { color: '#66bb6a' } },
    DISAGREE: { text: '不同意', icon: ThumbDownIcon, style: { color: '#f44336' } },

    ADD_REVIEWERS: { text: '發起會簽', icon: GroupAddIcon, style: { color: '#ff7c00' } },
    REVIEW: { text: '會簽', icon: CommentIcon, style: { color: '#e39a14' } },

    APPROVE: { text: '審批通過', icon: SentimentSatisfiedAltIcon, style: { color: '#2a97ff' }, isEndOfProcess: true },
    REJECT: { text: '審批不通過', icon: SentimentVeryDissatisfiedIcon, style: { color: '#ff1d0c' }, isEndOfProcess: true },

    TRIGGER_CLARIFICATION: { text: '觸發訂單澄清', icon: PendingActionsIcon, style: { color: '#ba68c8' }, isStartOfProcess: true },
    TRIGGER_QA_REVIEW: { text: '觸發品保審單Y', icon: PersonSearchIcon, style: { color: '#a2aa35' } },
    START_CLARIFICATION: { text: '需澄清', icon: SaveAltIcon, style: { color: 'secondary.light' } },
    // CLARIFY: { text: '訂單已澄清', icon: SaveAltIcon, style: { color: '#66bb6a' } },
    CONFIRM: { text: '訂單成立', icon: CheckIcon, style: { color: '#1ebccf' } },
    IMPORT: { text: '手動匯入', icon: UploadFileIcon, style: { color: '#0cc1b0' } },
});

// MPB 審批狀態
export const APPROVAL_STATUS = Object.freeze({
    "UNSAVED": { text: "新文件（未保存）", icon: FiberNewIcon },
    "SAVED": { text: "新文件", icon: FiberNewIcon, style: { color: 'text.secondary' } },
    "PENDING": { text: "審批中", icon: PersonSearchOutlinedIcon, color: 'warning', style: { color: '#ba68c8' } },
    // "REVIEWING": { text: "會簽中", icon: GroupsIcon, color: 'info', style: { color: 'info.light' } },
    "APPROVED": { text: "審批通過", icon: EmojiEmotionsIcon, color: 'warning', style: { color: '#426aff' } },
    "REJECTED": { text: "審批不通過", icon: MoodBadIcon, color: 'error', style: { color: '#f44336' } },
    "FORKED": { text: "舊單複製", icon: FileCopyIcon, color: 'primary', style: { color: 'text.secondary' } },
    "QA_REVIEW": { text: "品保審單Y", icon: FileCopyIcon, color: 'warning', style: { color: '#c0ca33' } },
    "IMPORTED": { text: "匯入", icon: CloudUploadIcon, color: 'warning', style: { color: '#c0ca33' } },
});

// MPB 澄清狀態
export const MPB_STATUS = Object.freeze({
    "UNCLARIFIED": { text: "未澄清", style: { color: 'text.secondary' } },
    "PENDING": { text: "澄清中", style: { color: '#ff9800' } },
    "CLARIFIED": { text: "已澄清", style: { color: '#66bb6a' } },
    "CONFIRMED": { text: "成立", style: { color: '#2b8bff' } },
    "AWAITING": { text: "需澄清", style: { color: '#ba68c8' } },
});

// 產品大類
export const PRODUCT_CATEGORY = Object.freeze({
    "胚": { code: 'A', style: { color: 'primary.light' } },
    "條 (盤元)": { code: 'B', style: { color: 'secondary.light' } },
    "棒": { code: 'C', style: { color: 'warning.light' } },
    "板": { code: 'G', style: { color: 'success.light' } },
    "管": { code: 'D', style: { color: 'info.light' } }
});

// 同意/不同意, 通過/不通過
export const AGREED = 'AGREED', DISAGREED = 'DISAGREED', REJECTED = 'REJECTED', APPROVED = 'APPROVED';

// 表單權限
export const FORM_PRIVILEGES = Object.freeze({
    "EDIT": { text: "編輯", icon: EditIcon, style: { color: 'text.secondary' } },
    "APPROVE": { text: "審批", icon: ApprovalIcon, style: { color: 'text.secondary' } },
    "ADD_REVIEWERS": { text: "加會簽", icon: GroupAddIcon, style: { color: 'text.secondary' } },
    "REVIEW": { text: "會簽", icon: RateReviewIcon, style: { color: 'text.secondary' } },
    // "REEDIT": { text: "重新編輯", icon: FiberNewIcon, style: { color: 'text.secondary' } },
    // "REAUDIT": { text: "重審", icon: FiberNewIcon, style: { color: 'text.secondary' } },
});
