import Matter from 'matter-js';
import { LABIRYNTH_CELL_TYPE } from '@/common/types';

export function createLabyrinth(
	engine: Matter.Engine,
	labyrinth: LABIRYNTH_CELL_TYPE[][],
	wallSize: number
) {
	// Calculate world dimensions
	const height = wallSize * labyrinth.length;
	const width = wallSize * (labyrinth[0]?.length || 0);

	const world = engine.world;

	// Create static walls from labyrinth array
	const walls: Matter.Body[] = [];
	for (let y = 0; y < labyrinth.length; y++) {
		for (let x = 0; x < labyrinth[y].length; x++) {
			if (labyrinth[y][x] === 'w') {
				// If cell is 1, create a wall
				const wall = Matter.Bodies.rectangle(
					x * wallSize + wallSize / 2,
					y * wallSize + wallSize / 2,
					wallSize,
					wallSize,
					{
						isStatic: true,
						collisionFilter: {
							group: -1, // Negative group means bodies in this group don't collide with each other
						},
					}
				);
				walls.push(wall);
			}
		}
	}

	// Add walls to the world
	Matter.Composite.add(world, walls);

	// Create impassable world boundaries
	const boundaries = [
		// Top
		Matter.Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
		// Bottom
		Matter.Bodies.rectangle(width / 2, height + 25, width, 50, {
			isStatic: true,
		}),
		// Left
		Matter.Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
		// Right
		Matter.Bodies.rectangle(width + 25, height / 2, 50, height, {
			isStatic: true,
		}),
	];

	Matter.Composite.add(world, boundaries);

	return { engine, world, width, height };
}
