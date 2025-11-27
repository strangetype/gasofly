import Matter from 'matter-js';
import { LABIRYNTH_CELL_TYPE } from '@/common/types';

export function createBall(
	engine: Matter.Engine,
	labyrinth: LABIRYNTH_CELL_TYPE[][],
	wallSize: number,
	radius: number
) {
	// Find the cell with 'b' value in the labyrinth
	let ballX = 0;
	let ballY = 0;

	for (let y = 0; y < labyrinth.length; y++) {
		for (let x = 0; x < labyrinth[y].length; x++) {
			if (labyrinth[y][x] === 'b') {
				// Calculate position at the center of the cell (same as wall positioning)
				ballX = x * wallSize + wallSize / 2;
				ballY = y * wallSize + wallSize / 2;
				break;
			}
		}
	}

	// Create a dynamic circle body
	const ballBody = Matter.Bodies.circle(ballX, ballY, radius, {
		restitution: 0.9, // Bouncy ball
		friction: 0.005, // Low friction
		frictionAir: 0.005, // Low air resistance
		frictionStatic: 0.5, // Static friction
		density: 0.001, // Affects mass and how it responds to gravity
		// No collisionFilter needed - default collision settings will work with walls
	});

	// Add ball to the world
	Matter.Composite.add(engine.world, ballBody);

	return ballBody;
}
