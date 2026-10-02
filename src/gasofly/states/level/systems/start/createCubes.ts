import { createLevelSystem } from '../../levelState';

import { Rectangle } from '@/gasofly/services/utils';

export default createLevelSystem((data, { Matter, Utils }) => {
	const world = data.engine!.world;
	const cubeSize = data.cubeSize;
	const size = 2; // The size of the final square in units

	// Generate rectangles by splitting the square
	const rectangles: Rectangle[] = [];
	const initialRect: Rectangle = {
		x: 0,
		y: 0,
		width: size,
		height: size,
	};

	Utils.splitRectangle(initialRect, 1, rectangles);

	// Shuffle rectangles for random order
	Utils.shuffleArray(rectangles);

	// Create physical bodies for each rectangle
	const parts: Matter.Body[] = [];

	for (const rect of rectangles) {
		const partWidth = rect.width * cubeSize;
		const partHeight = rect.height * cubeSize;

		// Create body at origin (0, 0) - positioning will be done elsewhere
		const body = Matter.Bodies.rectangle(0, 0, partWidth, partHeight, {
			restitution: 0.5, // Some bounciness
			friction: 0.3, // Medium friction
			frictionAir: 0.01, // Some air resistance
			density: 0.00025,
			// Default collision settings - will collide with everything
		});

		parts.push(body);
	}

	// Add all parts to the world
	Matter.Composite.add(world, parts);

	data.cubes = parts;
});
