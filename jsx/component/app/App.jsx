import { styled } from '@mui/material/styles';
import Loading from 'Component/Loading.jsx';
import React, { Suspense, useState } from 'react';
import MPBForm from './MPBForm.jsx';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from './context/UserStates';
import CompsiteForm from './CompsiteForm.jsx';
import testMPB from './lib/testFormData.json';
import Authorizable from './Authorizable.jsx';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, } = props;
    const user = useRecoilValue(userState);
    const [readOnly, setReadOnly] = useState(false);
    const [data, setDtata] = useState({});
    const [id, setId] = useState();

    return (
        <Suspense fallback={<Loading />}>
            <Authorizable>
                {
                    (id, formData, readOnly) => <CompsiteForm key={id} isNew readOnly={readOnly} data={formData} />
                }
            </Authorizable>
        </Suspense >
    );
}))`

`);