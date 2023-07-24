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
    const [queryForm, setQueryForm] = useState({ id: '12345', mpbData:'{}' });
    // const [queryForm, setQueryForm] = useState({});

    const isNew = !Boolean(queryForm?.id);

    return (
        <Suspense fallback={<Loading />}>
            <Authorizable queryForm={queryForm}>
                {
                    // formsetData: 後端回傳最新表單內容
                    ({ formsetData, flowUserTask, readOnly }) => {
                        console.log('(App)', { formsetData, flowUserTask, readOnly });

                        return (
                            <Stateful isNew={isNew} data={formsetData} flowUserTask={flowUserTask}>
                                {
                                    // formData: 新增表單 => 初始化後的表單內容, 開啟表單 => 表單內容
                                    ({ }) => {
                                        return <CompsiteForm key={queryForm?.id} isNew={isNew} readOnly={readOnly}
                                            data={formsetData} />;
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