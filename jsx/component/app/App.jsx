import React, { Suspense } from 'react';
import Loading from 'Components';

export default React.memo(props => {

    return (
        <Suspense fallback={<Loading />}>
            <div>Stay tuned...</div>
        </Suspense>
    );
});