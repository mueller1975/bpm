import { Divider } from '@mui/material';
import React, { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { ComponentGroup, GridFieldsetContainer } from './lib/formComponents.jsx';

export default React.memo(styled(React.forwardRef(({ id, editable, data, components, className }, ref) => {

    const formComponents = useMemo(() => {
        if (!components) {
            return undefined;
        }

        // console.log(`[${id}] COMPONENTS CHANGED.............`, { data })

        let formComponents = components.map((component, idx) => {
            switch (component.type) {
                case 'fieldset':
                    return <GridFieldsetContainer key={component.uuid} className="formComponent" formId={id} formData={data} editable={editable} {...component} />
                case 'divider':
                    return <Divider key={component.uuid} className={`formComponent ${component.invisible ? 'invisible' : ''}`} />
                case 'componentGroup':
                    return <ComponentGroup key={component.uuid} className="formComponent" formId={id} formData={data} editable={editable} {...component} />
                default:
                    throw new Error(`不支援的 component type [${component.type}]`);
            }
        });

        return formComponents;
    }, [components, editable]);

    return (
        <form id={id} ref={ref} autoComplete="off" className={className}>
            {formComponents}
        </form>
    );
}))`
    &>.formComponent:not(.hidden):nth-of-type(n+2) {
        margin-top: 8px;
    }

    .invisible {
        border: 0;
    }
`);