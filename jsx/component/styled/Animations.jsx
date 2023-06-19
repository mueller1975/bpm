import { keyframes } from "@emotion/react";

export const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const blink = keyframes`
    0% {
      filter: brightness(1);
      filter: contrast(1);
    }
    25% {
        filter: brightness(.5);
        filter: contrast(.5);
    }
    50% {
        filter: brightness(1);
        filter: contrast(1);
    }
    75% {
        filter: brightness(1.5);
        filter: contrast(1.5);
    }
    100% {
        filter: brightness(1);
        filter: contrast(1);
    }
`;