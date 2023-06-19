import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef } from 'react';

export default React.memo(styled(({ className, children, onScroll }) => {
    const ref = useRef();
    const resizeHandler = useRef();

    console.log("SCROLLABLE")
    useEffect(() => {
        resizeHandler.current = window.addEventListener("resize", () => {
            onScroll(ref.current)
        });

        return () => window.removeEventListener("resize", resizeHandler.current);
    }, []);

    const scrollHandler = useCallback(e => onScroll(e.currentTarget), [onScroll])


    return <div ref={ref} className={className} onScroll={scrollHandler}>{children}</div>;
})`
    overflow: auto hidden;
`);