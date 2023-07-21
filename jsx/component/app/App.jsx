import { styled } from '@mui/material/styles';
import Loading from 'Component/Loading.jsx';
import React, { Suspense, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Authorizable from './Authorizable.jsx';
import CompsiteForm from './CompsiteForm.jsx';
import { userState } from './context/UserStates';
import Stateful from './Stateful.jsx';

export default React.memo(styled(React.forwardRef((props, ref) => {
    const { className, } = props;
    // const [data, setDtata] = useState({ id: '12345', mpbData:"{}" });
    const [data, setDtata] = useState({});

    const isNew = !Boolean(data?.id);

    return (
        <Suspense fallback={<Loading />}>
            <Authorizable data={data}>
                {
                    // form: 後端回傳的表單內容
                    ({ form, flowUserTask, readOnly }) => {
                        console.log('【App】', { form, flowUserTask, readOnly });

                        return (
                            <Stateful isNew={isNew} flowUserTask={flowUserTask} form={form}>
                                {
                                    // formData: 新增表單 => 初始化後的表單內容, 開啟表單 => 表單內容
                                    ({ formData }) => {
                                        console.log('【App】', { formData });

                                        return <CompsiteForm key={data?.id} isNew={isNew} readOnly={readOnly}
                                            data={formData} />;
                                    }
                                }
                            </Stateful>
                        );
                    }
                }
            </Authorizable>
        </Suspense >
    );
}))`

`);