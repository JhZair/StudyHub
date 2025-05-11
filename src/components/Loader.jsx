import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Loader = ({ isLogin }) => {
  return (
    <StyledWrapper>
      <div className="container">
        {/* Cube elements */}
        {Array.from({ length: 8 * 8 * 8 }, (_, i) => (
          <div
            key={i}
            className="cube"
            style={{
              '--x': Math.floor(i / 64) % 2,
              '--y': Math.floor(i / 8) % 2,
              '--z': i % 2,
              '--fz': Math.floor(i / 4) % 2,
              '--rx': Math.floor(i / 2) % 2,
              '--fx': Math.floor(i / 1) % 2,
              '--ry': Math.floor(i / 32) % 2,
              '--fy': Math.floor(i / 16) % 2
            }}
          />
        ))}
      </div>

    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  @keyframes hue-rotate {
    to {
      filter: hue-rotate(360deg);
    }
  }

  .container {
    --w: 50px;
    --g: 5px;
    --t: calc(var(--w) + var(--g));
    width: var(--w);
    aspect-ratio: 1;
    perspective: 120px;
    transform-style: preserve-3d;
  }

  .cube {
    --fz: 0;
    --rx: 0;
    --fx: 0;
    --ry: 0;
    --fy: 0;
    position: absolute;
    background: #fffc;
    border: 2px solid black;
    width: var(--w);
    aspect-ratio: 1;
    bottom: calc(var(--w) * -0.5);
    right: calc(var(--w) * -0.5);
    animation:
      rotate 20s linear infinite,
      hue-rotate 20s linear infinite;
    transition: 5s;
    --a: translateZ(calc(0.5 * var(--w)))
      translateX(calc(var(--x) * var(--t) - 0.5 * var(--fy) * var(--w)))
      translateY(calc(var(--y) * var(--t) - 0.5 * var(--fx) * var(--w)))
      translateZ(
        calc(
          var(--z) * var(--t) - 0.5 * var(--ry) * var(--w) - 0.5 * var(--rx) *
            var(--w) - var(--fz) * var(--w)
        )
      )
      rotateX(calc(90deg * var(--rx))) rotateY(calc(90deg * var(--ry)));
    --p: translateX(calc(-0.5 * var(--w))) translateY(calc(-0.5 * var(--w)))
      translateZ(calc(-0.5 * var(--w)));
  }

  .cube:hover {
    background: #f00e;
    transition: 0s;
  }

  @keyframes rotate {
    0% {
      transform: var(--p) rotateZ(0deg) rotateY(0deg) rotateX(0deg) var(--a);
    }
    to {
      transform: var(--p) rotateZ(360deg) rotateY(720deg) rotateX(360deg) var(--a);
    }
  }
`;

export default Loader;
