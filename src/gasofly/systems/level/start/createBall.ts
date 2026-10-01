import { createLevelSystem } from '../levelSystem';

export default createLevelSystem((data, { Utils, Matter }) => {
	/*
    engine: Matter.Engine,
	labyrinth: LABYRINTH_CELL_TYPE[][],
	wallSize: number,
	radius: number
    */

	const { engine, wallSize, labyrinth, ball } = data;
	const { findFirstCellByType, cellToWorld } = Utils;

	// Find the cell with 'b' value in the labyrinth
	const ballCell = findFirstCellByType(labyrinth, 'b');
	const ballPosition = ballCell ? cellToWorld(ballCell.x, ballCell.y, wallSize) : { x: 0, y: 0 };

	// Create a dynamic circle body
	const ballBody = Matter.Bodies.circle(ballPosition.x, ballPosition.y, ball.radius, {
		restitution: 0.9, // Bouncy ball
		friction: 0.005, // Low friction
		frictionAir: 0.01, // Low air resistance
		frictionStatic: 0.5, // Static friction
		density: 0.001, // Affects mass and how it responds to gravity
		collisionFilter: {
			category: 0x0001, // Default category (walls and other objects)
			mask: 0xfff7, // Collide with everything except 0x0008 (rope segments)
		},
	});

	// Add ball to the world
	Matter.Composite.add(engine!.world, ballBody);

	data.ball.RigidBody = ballBody;
});
