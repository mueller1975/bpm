import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import AddComponentButton from './AddComponentButton.jsx';
import { fieldsetState } from './context/FormStates';
import { ComponentGroup, GridFieldsetContainer } from './lib/formComponents.jsx';

export default React.memo(styled(React.forwardRef(({ uuid, id, components, className }, ref) => {
    const createFieldset = useSetRecoilState(fieldsetState([uuid,])); // [1] 元素空值, 代表新增 fieldset

    const addFieldset = useCallback((e, afterUUID) => {
        e.stopPropagation();
        createFieldset({ afterUUID });
    }, []);

    const formComponents = useMemo(() => {
        if (!components) {
            return undefined;
        }

        // console.log(`[${id}] COMPONENTS CHANGED.............`, { data })

        let formComponents = components.map((component, idx) => {
            switch (component.type) {
                case 'fieldset':
                    return (
                        <React.Fragment key={component.uuid}>
                            <GridFieldsetContainer className="formComponent" formId={id} formUUID={uuid} {...component} />
                            <AddComponentButton className="formComponent" onClick={e => addFieldset(e, component.uuid)} />
                        </React.Fragment>
                    );
                case 'divider':
                    return <Divider key={component.uuid} className={`formComponent ${component.invisible ? 'invisible' : ''}`} />
                case 'componentGroup':
                    return <ComponentGroup key={component.uuid} className="formComponent" formId={id} {...component} />
                default:
                    throw new Error(`不支援的 component type [${component.type}]`);
            }
        });

        return formComponents;
    }, [components]);

    return (
        <form id={id} ref={ref} autoComplete="off" className={className}>
            <AddComponentButton className="formComponent" onClick={addFieldset} />
            {formComponents}
        </form>
    );
}))`
    &>.formComponent:not(.hidden):nth-of-type(n+2) {
        margin-top: 16px;
    }

    .invisible {
        border: 0;
    }
`);