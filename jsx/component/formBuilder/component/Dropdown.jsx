import { MenuItem, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Loading } from 'Components';
import { dropdownState } from 'Context/ServiceStates';
import React, { useMemo } from 'react';
import { useRecoilValueLoadable } from 'recoil';

const ITEM_CODE_STYLE = { fontFamily: 'Monospace', lineHeight: 'normal', mr: 1 };
const ITEM_NAME_STYLE = { lineHeight: 'normal' };

/**
 * 抓取系統設定的下拉選單
 */
export default React.memo(styled(React.forwardRef((props, ref) => {
    const { configCode, disabledItems, showItemCode = false, label, className, ...others } = props;
    const configLoadable = useRecoilValueLoadable(dropdownState(configCode));

    const menu = useMemo(() => {
        // console.log({ configLoadable })

        switch (configLoadable.state) {
            case 'loading':
                return <Loading />;
            case 'hasValue':
                return configLoadable.contents?.value.map(({ code, name }) =>
                    <MenuItem key={code || name} value={code || name} dense
                        disabled={disabledItems && disabledItems.indexOf(code || name) > -1}>
                        {
                            name.indexOf('data:') === 0 ?
                                <div className={className}>
                                    <Typography className="code">{code}</Typography>
                                    <img className="icon" src={name} />
                                </div> :
                                <>
                                    {showItemCode && <Typography color="textSecondary" component="span" sx={ITEM_CODE_STYLE}>{code || '_'}</Typography>}
                                    <Typography component="span" sx={ITEM_NAME_STYLE}>{name}</Typography>
                                </>
                        }
                    </MenuItem>);
            case 'hasError':
                throw `載入失敗: ${configLoadable.contents}`
        }
    }, [configLoadable]);

    return (
        // !menuItems ? null :
        <TextField {...others} label={label ?? config?.description} select ref={ref}>
            <MenuItem value='' sx={{ color: 'secondary.main' }} dense>--- 清空此欄 ---</MenuItem>
            {menu}
        </TextField >
    );
}))`

    width: 100%;
    display: inline-flex;
    gap: 8px;

    >.code {
        flex-grow: 1;
    }
    
    >img {
        height: 28px;
    }
`);