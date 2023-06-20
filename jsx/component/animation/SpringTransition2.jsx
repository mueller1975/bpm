import { animated, useTransition } from '@react-spring/web';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { config as springConfig } from '@react-spring/web';
import { merge } from 'lodash';

const EFFECTS = {
    "fade": {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { friction: 7, tension: 150 }
    },
    "slide": {
        from: { transform: 'translate3d(-100px,0,0)', opacity: 0 },
        enter: { transform: 'translate3d(0px,0,0)', opacity: 1 },
        leave: { transform: 'translate3d(100px,0,0)', opacity: 0 },
        // config: config.wobbly,
        config: { friction: 9, tension: 150 }
    },
    "slideDown": {
        from: { transform: 'translate3d(0,-100px,0)', opacity: 0 },
        enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
        leave: { transform: 'translate3d(0,100px,0)', opacity: 0 },
        // config: config.wobbly
        config: { friction: 10, tension: 150 }
        // config: { friction: 10, tension: 150, bounce: 1 }
    },
    "scale": {
        from: { transform: 'scale(0,0)', opacity: 0 },
        enter: { transform: 'scale(1,1)', opacity: 1 },
        leave: { transform: 'scale(0,0)', opacity: 0 },
        // config: config.wobbly,
        config: { friction: 7, tension: 150 }
    }
}

const TIMEOUT = 500;
const EFFECT = "slide";

export const DRAMATIC = { friction: 5, tension: 120 };

const SpringTransition = React.memo(React.forwardRef((props, ref) => {
    const { effect = EFFECT, bounce, friction, mass, tension, items, keys, timeout = TIMEOUT, trail, delay, children } = props;
    const config = merge({}, EFFECTS[effect].config, { bounce, mass, friction, tension });

    const transitions = useTransition(items, {
        ref,
        ...EFFECTS[effect],
        config,
        keys,
        trail: items.length == 0 ? undefined : trail ?? Math.floor(timeout / items.length),
        delay,
        // onRest: () => console.log("ANIMATION STOPPED.......")
    })

    // const [transitions, api] = useTransition(items,
    //     () => ({
    //         ...EFFECTS[effect],
    //         keys,
    //         trail: items.length == 0 ? undefined : trail ?? Math.floor(timeout / items.length),
    //         delay
    //     })
    // );

    // useEffect(() => {
    //     api.start();
    // }, [items]);

    return transitions((style, item) => <animated.div style={style} key={keys ? keys(item) : undefined}>{children(item)}</animated.div>)
}));

SpringTransition.propTypes = {
    // effect: PropTypes.oneOf(Object.keys(EFFECTS)).isRequired
}

export default SpringTransition