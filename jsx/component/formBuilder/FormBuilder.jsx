import React, { useEffect, useCallback, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { FormContext } from './context/FormContext.jsx';
import Form from './Form.jsx';
import FormList from './FormList.jsx';

export default React.memo(styled(props => {
    const { state, dispatch } = useContext(FormContext);

    console.log({ state })
    return (
        <div>
            <Form />
        </div>
    );
})`


`);