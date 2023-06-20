import React from 'react';
import { useSpring, animated, config } from 'react-spring';

export default React.memo(props => {
    const { children, ...others } = props;

    const aniProps = useSpring({
        config: config.stiff,
        from: { color: '#bdbdbd', transform: 'scale(1, 1)' },
        to: [
            { color: '#daa520', transform: 'scale(1.2, 1.2)' },
            { color: '#bdbdbd', transform: 'scale(1, 1)' }
        ],
    });

    return (
        <animated.div {...others} style={aniProps}>
            {children}
        </animated.div>
    );
});