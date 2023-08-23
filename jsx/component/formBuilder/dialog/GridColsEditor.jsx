import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Checkbox, Slider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SimpleDialog from 'Component/SimpleDialog.jsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_COLS = {
    xs: 12, sm: 6, md: 4, lg: 3, xl: 2
};

const COL_BREAKPOINTS = Object.keys(DEFAULT_COLS);

export default React.memo(styled(props => {
    const { value, onConfirm, onClose, className, ...others } = props;
    const [cols, setCols] = useState();

    useEffect(() => {

    }, [value])

    const transitionProps = {
        onEnter: () => setCols(value),
    };

    const cancel = useCallback(() => {
        onClose();
    }, []);

    const confirm = useCallback(() => {
        if (cols) {
            Object.keys(cols).forEach(key => { if (!cols[key]) { delete cols[key] } }); // 移除未設定的 breakpoint
            onConfirm(Object.keys(cols).length > 0 ? cols : undefined); // 皆未設定則回傳 undefined
        } else {
            onConfirm(undefined);
        }

        onClose();
    }, [cols]);

    const clear = useCallback(() => setCols());

    const colChangeHandler = ({ breakpoint, value }) => {
        let newCols = { ...cols, [breakpoint]: value };
        setCols(newCols);
    };

    const actions = useMemo(() => [
        { key: 'confirm', icon: <CheckIcon />, tooltipTitle: <Typography variant='subtitle1'>確認</Typography>, onClick: confirm },
        { key: 'clear', icon: <ClearIcon />, tooltipTitle: <Typography variant='subtitle1'>清空</Typography>, onClick: clear },
        { key: 'cancel', icon: <LogoutIcon />, tooltipTitle: <Typography variant='subtitle1'>取消</Typography>, onClick: cancel },
    ], [cancel, confirm]);

    return (
        <SimpleDialog title="欄位映射設定" icon={PlaylistAddIcon} actions={actions} {...others}
            onClose={onClose} className={`MT-GridColsEditor ${className}`} TransitionProps={transitionProps}>

            <div className="wrapper">
                {
                    COL_BREAKPOINTS.map(breakpoint => {
                        return <ColSlider breakpoint={breakpoint} value={cols?.[breakpoint]}
                            onChange={colChangeHandler} />;
                    })
                }
            </div>
        </SimpleDialog>
    );
})`
    &.MT-GridColsEditor {
        .wrapper {
            padding: 20px 60px 0 0;
        }
    }
`);

const ColSlider = React.memo(styled(props => {
    const { breakpoint, value, onChange, className } = props;

    // 勾選欄位值變動
    const checkboxChangeHandler = e => {
        const { name, checked } = e.target;
        console.log({ breakpoint, checked });

        onChange({ breakpoint, value: checked ? 1 : 0 });
    };

    const valueChangeHandler = (e, value) => {
        onChange({ breakpoint, value });
    };

    return (
        <div className={`MT-ColSlider ${className}`}>
            <Checkbox checked={Boolean(value)} onChange={checkboxChangeHandler} />
            <Typography className="breakpoint">{breakpoint}</Typography>
            <Slider valueLabelDisplay="on" size="small" min={0} max={12} step={1}
                value={value ?? 0} onChange={valueChangeHandler} />
        </div>
    );
})`
    &.MT-ColSlider {
        display: flex;
        align-items: center;
        height: 72px;
        
        >.breakpoint {
            width: 48px;
        }
    }
`);