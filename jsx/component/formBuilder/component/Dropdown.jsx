import { MenuItem, TextField, Typography } from '@mui/material';
import { ServiceContext } from 'Context/ServiceContext.jsx';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const ITEM_CODE_STYLE = { fontFamily: 'Monospace', lineHeight: 'normal', mr: 1 };
const ITEM_NAME_STYLE = { lineHeight: 'normal' };

/**
 * 抓取系統設定的下拉選單
 */
export default React.memo(styled(React.forwardRef((props, ref) => {
    const { configCode, disabledItems, showItemCode = false, label, className, ...others } = props;
    const [config, setConfig] = useState();
    const [menuItems, setMenuItems] = useState();
    const { dropdowns } = useContext(ServiceContext);

    useEffect(() => {
        if (dropdowns.value) {
            let config = dropdowns.value.find(({ code }) => code == configCode);
            let items = [];

            if (!config) {
                console.warn(`找不到 config code [${configCode}] 的設定!`);
            } else {
                items = config.value.map(({ code, name }) =>
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
            }

            setConfig(config);
            setMenuItems(items);
        }
    }, [dropdowns]);

    return (
        // !menuItems ? null :
            <TextField {...others} label={label ?? config?.description} select ref={ref}>
                <MenuItem value='' sx={{ color: 'secondary.main' }} dense>--- 清空此欄 ---</MenuItem>
                {menuItems}
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