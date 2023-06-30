import { Divider } from '@mui/material';
import React, { useMemo, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ComponentGroup, GridFieldsetContainer } from './lib/formComponents.jsx';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { updateFormSelector } from './context/FormStates.jsx';

const AddComponent = styled(({ className, onAdd }) => {

    return (
        <div className={className}>
            <IconButton onClick={onAdd}><AddIcon /></IconButton>
        </div>
    );
})`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed gray;
    border-radius: 4px;

    :hover {
        border-color: white;
    }
`;

export default React.memo(styled(React.forwardRef(({ uuid, id, editable, data, components, className }, ref) => {

    const updateForm = useSetRecoilState(updateFormSelector);

    const addFormComponent = useCallback(() => {
        let fieldset = {
            "type": "fieldset",
            "cols": {
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3
            },
            "fields": []
        };

        updateForm({ form: { uuid, components: [fieldset, ...components] } });
    }, [components]);

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
            {
                formComponents.length == 0 ? <AddComponent onAdd={addFormComponent} /> : formComponents
            }
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