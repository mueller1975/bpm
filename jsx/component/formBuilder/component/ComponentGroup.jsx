import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Transition } from 'react-transition-group';
import GridFieldsetContainer from './GridFieldsetContainer.jsx';

/**
 * 元件群 (可下 availableWhen 條件)
 */
export default React.memo(styled(props => {
    const { formId, editable, formData, components, className } = props;

    return (

        <Transition in={available} timeout={500} mountOnEnter>
            {
                state => {
                    // console.log({state})

                    return (
                        <div className={`${className} ${state}`}>
                            {/* <div>HELLO</div> */}
                            {
                                components.map((component, idx) => {
                                    switch (component.type) {
                                        case 'fieldset':
                                            return <GridFieldsetContainer key={idx} className="groupComponent"
                                                formId={formId} formData={formData} editable={editable} available={available} {...component} />;
                                        case 'divider':
                                            return <Divider key={idx} className={`groupComponent ${component.invisible ? 'invisible' : ''}`} />
                                        default:
                                            return <div>不支援的 component type: [{component.type}]</div>;
                                    }
                                })
                            }
                        </div>
                    )
                }
            }
        </Transition>
    );
})`
    transition: opacity 2s ease-in-out;

    &.entering {
        opacity: 1;
    }

    &.entered {
        opacity: 1;
    }

    &.exiting {
        opacity: 0;
    }

    &.exited {
        // content-visibility: hidden;
        display: none;
        opacity: 0;
    }

    .groupComponent:not(.hidden) {
        margin-top: 8px;
    }
    
    .groupComponent.MuiGrid-container {
        margin-top: 0;
    }
    
    .invisible {
        border: 0;
    }
`);