import { Fab, FormControl, FormHelperText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Scrollable from 'Component/Scrollable.jsx';
import React, { useCallback, useState } from 'react';
import { jiggle } from '../../styled/Animations.jsx';

export default React.memo(styled(props => {
    const { title, noBorder = false, icon, hidden = false, helper, error, className,
        onScrollLeft, onScrollRight, actions, ...others } = props;
    const [leftScrollerHidden, setLeftScrollerHidden] = useState(true);
    const [rightScrollerHidden, setRightScrollerHidden] = useState(true);

    const scrollHandler = useCallback(e => {
        // console.log(e)

        let clientWidth = e?.clientWidth;
        let scrollWidth = e?.scrollWidth;
        let scrollLeft = e?.scrollLeft;

        if (scrollLeft == 0) {
            // setLeftScrollerHidden(true);
        } else {
            // setLeftScrollerHidden(false);
            // debugger
        }

        if ((clientWidth + scrollLeft) == scrollWidth) {
            // setRightScrollerHidden(true);
        } else if ((clientWidth + scrollLeft) < scrollWidth) {
            // setRightScrollerHidden(false);
        }

        // console.log({ clientWidth, scrollLeft, scrollWidth })
    }, []);

    return (
        <FormControl className={`MT-Fieldset ${className} ${hidden ? 'hidden' : ''}`} error={Boolean(error)}>
            {/* 不可使用 tag name 來調 fieldset & legend 的 style, 否則會影響到 children 的 fieldset & legend style  */}
            <fieldset {...others} className={`fieldset ${error ? 'error' : ''}`}>
                <div className={`scroller left ${leftScrollerHidden ? 'hidden' : ''}`} onClick={onScrollLeft} />
                <div className={`scroller right ${rightScrollerHidden ? 'hidden' : ''}`} onClick={onScrollRight} />

                <legend className="legend">
                    <Typography>{title}</Typography>
                    {icon}
                </legend>

                {actions &&
                    <div className="fieldsetActions">
                        {
                            actions.map(({ action, icon }, i) => <Fab key={i} size="small" onClick={action}>{icon}</Fab>)
                        }
                    </div>
                }

                {/* <Scrollable className="scrollable" onScroll={scrollHandler}> */}
                    {props.children}
                {/* </Scrollable> */}
            </fieldset>

            <FormHelperText>{!error ? helper : error}</FormHelperText>
        </FormControl>
    );
})`
    &.MT-Fieldset {
        display: block;    

        &.hidden {
            content-visibility: hidden;
        }

        .hidden {
            display: none;
        }
        
        >.fieldset {
            padding-top: 12px;
            padding-bottom: 12px;
            min-width: 100px;
            max-width: 100%;
            
            border: ${props => props.noBorder ? 0 : '1px solid rgb(177 126 52 / 80%)'};
            border-radius: 4px;
            transition: all .7s;

            &.error {
                border: 2px dashed #f44336;

                .legend {
                    color: #f44336;
                }
            }

            :not(.error):hover {
                border-color:  ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f0910a' : 'rgb(253 198 43)'};

                >.legend {
                    color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? '#f0910a' : '#ffa726'};
                }
            }
        
            .legend {
                display: flex;
                gap: 4px;
                padding: 0 8px;
                font-size: larger;
                color: ${({ theme: { palette: { mode } } }) => mode == 'light' ? 'rgb(211 173 119)' : '#bd8330'};
                align-items: center;
                transition: all .7s;
            }        

            .fieldsetActions {            
                opacity: 0;
                position: absolute;
                top: -7px;
                right: 0;
                display: inline-flex;
                gap: 8px;
                justify-content: center;
                width: 100%;
                transition: all .8s;

                :hover {                
                    opacity: 1;

                    >button {
                        transform: scale(1);
                    }
                }

                >button {
                    // background-color: #2b2b2b;
                    transition: all .5s;
                    transform: scale(0);

                    :hover {
                        animation: ${jiggle} .15s 3;
                    }
                }
            }

            .scroller {
                position: absolute;
                height: calc(100% - 15px);
                width: 20px;
                top: 14px;
                z-index: 3;
                transition: all .3s;
                
                &:hover {
                    background: rgb(160 88 40 / 24%);
                }

                &:active {
                    background: rgb(160 88 40 / 50%);
                }
                
                &.left {
                    left: 3px;
                    border-radius: 4px 0 0 4px;
                }

                &.right {
                    right: 3px;
                    border-radius: 0 4px 4px 0;
                }
            }
        }
    }
`);