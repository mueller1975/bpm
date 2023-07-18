import { Fab, FormControl, FormHelperText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { jiggle } from '../../styled/Animations.jsx';

export default React.memo(styled(props => {
    const { title, noBorder = false, icon, hidden = false, helper, error, className,
        onScrollLeft, onScrollRight, actions, ...others } = props;

    return (
        <FormControl className={`MT-Fieldset ${className} ${hidden ? 'hidden' : ''}`} error={Boolean(error)}>
            {/* 不可使用 tag name 來調 fieldset & legend 的 style, 否則會影響到 children 的 fieldset & legend style  */}
            <fieldset {...others} className={`fieldset ${error ? 'error' : ''}`}>

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

                <div className="content">
                    {props.children}
                </div>
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

            >.content {
                overflow: auto hidden;
                padding-top: 6px;
            }
        }
    }
`);