import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import AddComponentButton from './AddComponentButton.jsx';
import { formState } from './context/FormStates.jsx';
import { ComponentGroup, GridFieldsetContainer } from './lib/formComponents.jsx';

export default React.memo(styled(React.forwardRef(({ uuid, id, components, className }, ref) => {
    const updateForm = useSetRecoilState(formState(uuid));

    const addFormComponent = useCallback(afterUUID => {
        let fieldset = {
            uuid: uuidv4(),
            type: "fieldset",
            cols: {
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3
            },
            fields: []
        };

        let newComponents;

        if (afterUUID) {
            let idx = components.findIndex(f => f.uuid === afterUUID);
            newComponents = [...components.slice(0, idx + 1), fieldset, ...components.slice(idx + 1)];
        } else {
            newComponents = [fieldset, ...components];
        }

        updateForm({ form: { uuid, components: newComponents } });
    }, [components]);

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
                            <AddComponentButton className="formComponent" onClick={() => addFormComponent(component.uuid)} />
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
            <AddComponentButton className="formComponent" onClick={addFormComponent} />
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