import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';

export default React.memo(props => {
    const { flip, direction = 'left', children, ...others } = props;
    const transformFrom = direction == 'left' ? 'translateX(100%)' : direction == 'right' ? 'translateX(-100%)' : direction == 'up' ? 'translateY(100%)' : 'translateY(-100%)';
    const transformTo = direction == 'left' || direction == 'right' ? 'translateX(0%)' : 'translateY(0%)';

    console.log('SpringSlide.........')

    const aniProps = useSpring({
        config: config.wobbly,
        from: { opacity: 0, contentVisibility: 'hidden', transform: transformFrom },
        to: { opacity: 1, contentVisibility: 'visible', transform: transformTo },
        reverse: flip
    });

    return (
        <animated.div {...others} style={aniProps}>
            {children}
        </animated.div>
    );
});