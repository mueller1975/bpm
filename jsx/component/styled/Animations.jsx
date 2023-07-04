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

export const spin = keyframes`
  from { 
    transform:rotate(0deg);
  }	
  to {
    transform: rotate(360deg);
  }
`;

export const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

export const bounce = keyframes`
  10%, 90% {
    transform: translate3d(0, -1px, 0);
  }
  
  20%, 80% {
    transform: translate3d(0, 2px, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(0, -4px, 0);
  }

  40%, 60% {
    transform: translate3d(0, 4px, 0);
  }
`;

export const jiggle = keyframes`
  0% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(15deg);
  }
`;