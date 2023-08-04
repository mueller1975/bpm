import Loading from 'Component/Loading.jsx';
import React, { Suspense, useState } from 'react';
import Authorizable from './Authorizable.jsx';
import CompsiteForm from './CompsiteForm.jsx';
import Stateful from './Stateful.jsx';

export default React.memo(React.forwardRef((props, ref) => {
    // const [queryForm, setQueryForm] = useState({ id: '12345', jsonData: '{}' });
    const [queryForm, setQueryForm] = useState({});

    const isNewForm = !Boolean(queryForm?.id); // 無 id 則為新增表單

    return (
        <Suspense fallback={<Loading />}>
            <Authorizable isNewForm={isNewForm} queryForm={queryForm}>
                {
                    // formsetData: 後端回傳最新表單內容
                    ({ formsetData, flowUserTask, readOnly }) => {
                        console.log('(App)', { formsetData, flowUserTask, readOnly });

                        return (
                            <Stateful data={formsetData} flowUserTask={flowUserTask}>
                                {
                                    ({ }) => {
                                        return <CompsiteForm key={queryForm?.id} isNew={isNewForm} readOnly={readOnly}
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
}));