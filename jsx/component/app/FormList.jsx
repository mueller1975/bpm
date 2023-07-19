import {
    AppBar, List
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { animated, config, useSpring } from '@react-spring/web';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { formListCollapsedSelector } from './context/BuilderStates';
import FormListActions from './formList/FormListActions.jsx';
import FormListItem from './formList/FormListItem.jsx';
import FormListToolbar from './formList/FormListToolbar.jsx';

const AnimatedList = animated(List);
const springConfig = { friction: 8, tension: 120 };

export default React.memo(styled(({ forms, onLoadData, className }) => {
    const [collapsed, setCollapsed] = useRecoilState(formListCollapsedSelector);
    const [firstExpanded, setFirstExpanded] = useState(false);

    const theme = useTheme();
    const underMD = useMediaQuery(theme.breakpoints.down('md'));
    const underSM = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setTimeout(() => {
            setFirstExpanded(true);
            setCollapsed(false);
        }, 1000);
    }, []);

    const collapseProps = useSpring({
        // delay: !firstExpanded ? 3000 : 0,
        immediate: !firstExpanded,
        from: { width: 108, zIndex: 0 },
        to: { width: 180, zIndex: 1, },
        reverse: collapsed,
        config: springConfig
        // onStart: () => !firstExpanded && setFirstExpanded(true)
    });

    const hideProps = useSpring({
        // delay: !firstExpanded ? 1000 : 0,
        immediate: !firstExpanded,
        from: { opacity: 0 },
        to: { opacity: 1 },
        reverse: collapsed,
        config: config.wobbly
    });

    const showProps = useSpring({
        // delay: !firstExpanded ? 1000 : 0,
        immediate: !firstExpanded,
        from: { opacity: 1, },
        to: { opacity: 0 },
        reverse: collapsed,
        config: config.wobbly
    });

    return (
        <div className={`MT-FormList ${className}`}>
            <AnimatedList dense={underMD} style={collapseProps} className="list">
                {/* 表單清單 toolbar */}
                <AppBar position="relative">
                    <FormListToolbar showProps={showProps} hideProps={hideProps} disabled={underSM} />
                </AppBar>

                {/* 各 form 區塊 */
                    forms.map(form =>
                        <FormListItem key={form.uuid} form={form} tooltipDisabled={!collapsed && !underSM}
                            showProps={showProps} hideProps={hideProps} />
                    )
                }
            </AnimatedList>

            {/* 表單清單動作按鈕 */}
            <FormListActions hidden={collapsed} className="actions" />
        </div>
    );
})`
    &.MT-FormList {
        height: 100%;
        padding: 0;
        position: relative;

        border-radius: 4px;
        background: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(255 255 255 / 60%)' : 'rgb(11 20 37 / 63%)'};
        box-shadow: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '8px 8px 8px 0px #72777f' : '#121212 8px 8px 8px 0px'};

        >.actions {
            position: absolute;
            right: 16px;
            bottom: 16px;
        }

        >.list {
            padding: 0;
            height: 100%;
            overflow: hidden auto;
        }
    }
`);