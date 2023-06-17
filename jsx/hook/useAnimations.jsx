import { config as springConfig, useSpring } from '@react-spring/web';

const DEFAULT_CONFIG = springConfig.wobbly;

const FADE_CONFIG = {
    from: { opacity: 0 },
    to: { opacity: 1 },
};

const SCALE_CONFIG = {
    from: { transform: 'scale(0)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
};

const SLIDE_CONFIG = {
    from: { transform: 'translate3d(-100px,0px,0)', opacity: 0 },
    to: { transform: 'translate3d(0px,0,0)', opacity: 1 },
    // to: [
    //     { transform: 'translate3d(0px,100px,0)', opacity: 1 },
    //     { transform: 'translate3d(0px,0px,0)', opacity: 1 },
    // ]
};

const SLIDE_DOWN_CONFIG = {
    from: { transform: 'translate3d(0,-100px,0)', opacity: 0 },
    to: { transform: 'translate3d(0,0px,0)', opacity: 1 },
    config: { friction: 8, tension: 150 }
};

const useEffectSpring = ({ config = DEFAULT_CONFIG, ...others }) => {
    const props = useSpring({
        config,
        ...others
    });

    return props;
};

export const useFadeSpring = settings => {
    return useEffectSpring({ ...FADE_CONFIG, ...settings });
};

export const useScaleSpring = settings => {
    return useEffectSpring({ ...SCALE_CONFIG, ...settings });
};

export const useSlideSpring = settings => {
    return useEffectSpring({ ...SLIDE_CONFIG, ...settings });
};

export const useSlideDownSpring = settings => {
    return useEffectSpring({ ...SLIDE_DOWN_CONFIG, ...settings });
}

export const useSlideDownSpringApi = settings => {
    const [props, api] = useSpring(() => ({ ...SLIDE_DOWN_CONFIG, ...settings }));
    const start = () => api.start(SLIDE_DOWN_CONFIG);
    return [props, start];
}