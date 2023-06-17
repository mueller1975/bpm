/**
 * Transition Components
 */
import React, { Suspense } from 'react'
import Slide from '@mui/material/Slide'
import Loading from 'Component/Loading.jsx'
import SpringTransition2, { DRAMATIC } from "Animation/SpringTransition2.jsx";

export const SlideUpTransition = React.forwardRef((props, ref) => <Slide ref={ref} direction="up" {...props} />)
export const SlideDownTransition = React.forwardRef((props, ref) => <Slide ref={ref} direction="down" {...props} />)
// export const SpringTransition = React.forwardRef((props, ref) => <Slide ref={ref} direction="down" {...props} />)

// const LazySpringTransition = SpeechRecognitionAlternative.lazy(() => import("Animation/SpringTransition.jsx"))

// export const SpringTransition = React.forwardRef((props, ref) => (
//     <Suspense fallback={<Loading />}>
//         <LazySpringTransition ref={ref} {...props} />
//     </Suspense>
// ));

export { SpringTransition2, DRAMATIC };