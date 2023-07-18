import { styled } from '@mui/material/styles';
import Loading from 'Component/Loading.jsx';
import React, { Suspense } from 'react';
import MPBForm from './MPBForm.jsx';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from './context/UserStates';
import CompsiteForm from './CompsiteForm.jsx';
import testMPB from './lib/testFormData.json';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, } = props;
    const user = useRecoilValue(userState);

    const data = { mpbData: "{}" };

    return (
        <Suspense fallback={<Loading />}>
            <CompsiteForm isNew data={data} />
        </Suspense >
    );
}))`

`);