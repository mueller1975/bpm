import React, { Suspense } from 'react'
import { ErrorBoundary, Loading } from 'Components'

function lazyViewWithErrorBoundary(V) {
    // const V = React.lazy(() => import(path)) // 在此 import, path 會抓不到

    return React.memo(React.forwardRef((props, ref) => (
        <ErrorBoundary>
            <Suspense fallback={<Loading />}>
                <V ref={ref} {...props} />
            </Suspense>
        </ErrorBoundary>
    )));
}

export const ApplicationView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/auth/ApplicationView.jsx")))
export const AppRoleView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/auth/AppRoleView.jsx")))

export const TestView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/test/TestView.jsx")))

export const ConfigView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/config/ConfigView.jsx")))
export const MPBView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/mpb/MPBView.jsx")))
export const MPBViewDelegator = lazyViewWithErrorBoundary(React.lazy(() => import("../view/mpb/MPBViewDelegator.jsx")))
export const MPBImportView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/mpbImport/MPBImportView.jsx")))

export const MPBNoticeView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/notice/MPBNoticeView.jsx")))
export const MPBReviewerView = lazyViewWithErrorBoundary(React.lazy(() => import("../view/notice/MPBReviewerView.jsx")))
