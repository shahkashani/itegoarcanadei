import { random, range, shuffle } from 'lodash';
import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const Audio = styled.audio`
  position: absolute;
  opacity: 0;
  z-index: 0;
  left: -99999px;
`;

const createPositions = (width, num) => {
  const piece = Math.floor(width / num);
  const padding = 50;

  return range(0, num).map(
    (i) =>
      (Math.max(padding, i * piece) +
        Math.min(width - padding, (i + 1) * piece)) /
      2
  );
};

const createHeights = (height, num) =>
  range(0, num).map(() => Math.floor(height * random(0.4, 0.8)));

const createPositionIndex = (num) => {
  return shuffle(range(0, num));
};

export const Buckets = ({
  isWindy,
  num,
  duration = 10000,
  generateRandomWind = false,
}) => {
  const canvasRef = useRef();
  const audioRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
  const [engine, setEngine] = useState(null);
  const [world, setWorld] = useState(null);
  const [render, setRender] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [positions, setPositions] = useState(
    createPositions(window.innerWidth, num)
  );
  const [positionIndex] = useState(createPositionIndex(num));
  const [heights, setHeights] = useState(
    createHeights(window.innerHeight, num)
  );
  const [bucketIndex, setBucketIndex] = useState(-1);
  const [windTimerId, setWindTimerId] = useState(null);
  const [bucketFactor, setBucketFactor] = useState(1);
  const [bucketGap, setBucketGap] = useState(10);

  const {
    Bodies,
    Body,
    Composite,
    Composites,
    Constraint,
    Mouse,
    MouseConstraint,
    World,
  } = Matter;

  const createItem = ({
    x: stringX,
    y: stringY,
    totalLength,
    texture = '',
  }) => {
    const rows = Math.floor(totalLength / 30);
    const group = Body.nextGroup(true);

    const string = Composites.stack(stringX, stringY, 1, rows, 0, 0, (x, y) => {
      return Bodies.rectangle(x, y, 30, 4, {
        collisionFilter: { group },
        render: {
          fillStyle: '#333',
          sprite: {
            texture: '/rope.jpg',
            xScale: 0.2,
            yScale: 0.5,
          },
        },
      });
    });

    const firstBody = string.bodies[0];
    const lastBody = string.bodies[string.bodies.length - 1];
    const item = Bodies.trapezoid(
      lastBody.position.x,
      lastBody.position.y + bucketGap,
      80 * bucketFactor,
      145 * bucketFactor,
      -0.2,
      {
        collisionFilter: { group },
        frictionAir: 0.03,
        render: {
          sprite: {
            texture,
            xScale: 0.5 * bucketFactor,
            yScale: 0.5 * bucketFactor,
          },
        },
      }
    );

    const itemConstraint = Constraint.create({
      bodyA: item,
      bodyB: lastBody,
      pointA: { x: 0, y: -50 },
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      render: { visible: false },
    });

    Composites.chain(string, 0.2, 0, -0.2, 0, {
      stiffness: 1,
      render: { visible: false },
    });

    Composite.add(
      string,
      Constraint.create({
        bodyB: firstBody,
        render: {
          visible: false,
        },
        pointA: { x: firstBody.position.x, y: firstBody.position.y },
        pointB: { x: 0, y: 0 },
        stiffness: 1,
      })
    );

    World.add(world, [string, item, itemConstraint]);
  };

  const playAudio = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();
  };

  const generateWind = () => {
    playAudio();
    const force =
      Matter.Common.random(0.01, 0.1) * (Math.random() > 0.5 ? 1 : -1);
    world.bodies.forEach((body) => {
      Matter.Body.applyForce(
        body,
        { x: body.position.x, y: body.position.y },
        {
          x: force + random(0, 0.01),
          y: 0,
        }
      );
    });
  };

  const scheduleWinds = () => {
    generateWind();
    const timerId = setTimeout(() => {
      scheduleWinds();
    }, random(15000, 30000));
    setWindTimerId(timerId);
  };

  useEffect(() => {
    const isSmall = width < 900;
    setBucketFactor(isSmall ? 0.7 : 1);
    setBucketGap(isSmall ? 30 : 10);
  }, []);

  useEffect(() => {
    if (!generateRandomWind) {
      if (windTimerId) {
        clearTimeout(windTimerId);
        setWindTimerId(null);
      }
      return;
    }
    scheduleWinds();
  }, [generateRandomWind]);

  useEffect(() => {
    if (isWindy) {
      generateWind();
    }
  }, [isWindy]);

  useEffect(() => {
    if (bucketIndex < 0 || bucketIndex + 1 > num) {
      return;
    }
    createItem({
      x: positions[positionIndex[bucketIndex]],
      y: -100,
      totalLength: heights[bucketIndex],
      texture: `/bucket-${bucketIndex + 1}.png`,
    });
    setTimeout(() => {
      setBucketIndex((b) => b + 1);
    }, duration / num);
  }, [bucketIndex]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const mouseContraint = MouseConstraint.create(engine, {
      mouse: Mouse.create(render.canvas),
      constraint: {
        stiffness: 0.6,
        render: { visible: false },
      },
    });
    World.add(world, mouseContraint);
  }, [isInitialized]);

  useEffect(() => {
    const { Engine, Render, Runner } = Matter;

    const runner = Runner.create();
    const engine = Engine.create();
    const world = engine.world;
    const render = Render.create({
      element: canvasRef.current,
      engine,
      options: {
        background: 'transparent',
        width: width,
        height: height,
        wireframes: false,
      },
    });

    setEngine(engine);
    setWorld(world);
    setRender(render);
    setIsInitialized(true);

    const resizeHandler = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', resizeHandler);

    Runner.run(runner, engine);
    Render.run(render);

    setTimeout(() => {
      setBucketIndex(0);
    }, duration / num);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    render.bounds.max.x = width;
    render.options.width = width;
    render.canvas.width = width;
    setPositions(createPositions(width, num));
  }, [width]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    render.bounds.max.y = height;
    render.options.height = height;
    render.canvas.height = height;
    setHeights(createHeights(height, num));
  }, [height]);

  return (
    <>
      <Container ref={canvasRef} />{' '}
      <Audio preload="auto" ref={audioRef}>
        <source src="/wind.mp3" type="audio/mpeg" />
      </Audio>
    </>
  );
};
