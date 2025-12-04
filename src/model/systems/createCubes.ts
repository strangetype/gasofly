import Matter from 'matter-js';
import { shuffleArray } from '@/common/utils';

interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Recursively splits a rectangle into smaller rectangles
 */
function splitRectangle(rect: Rectangle, minSize: number, parts: Rectangle[]): void {
	// If rectangle is too small to split, add it to parts
	if (rect.width <= minSize && rect.height <= minSize) {
		parts.push(rect);
		return;
	}

	// Decide if we can split horizontally, vertically, or both
	const canSplitHorizontally = rect.width > minSize;
	const canSplitVertically = rect.height > minSize;

	if (!canSplitHorizontally && !canSplitVertically) {
		parts.push(rect);
		return;
	}

	// Randomly decide to split or keep as is (with some probability to stop splitting)
	if (Math.random() < 0.3) {
		parts.push(rect);
		return;
	}

	// Choose split direction
	let splitHorizontally: boolean;
	if (canSplitHorizontally && canSplitVertically) {
		splitHorizontally = Math.random() < 0.5;
	} else {
		splitHorizontally = canSplitHorizontally;
	}

	if (splitHorizontally) {
		// Split horizontally (left and right)
		// Choose split position (in units, must be at least minSize from each edge)
		const maxSplit = rect.width - minSize;
		const splitPos = minSize + Math.floor(Math.random() * (maxSplit - minSize + 1));

		const leftRect: Rectangle = {
			x: rect.x,
			y: rect.y,
			width: splitPos,
			height: rect.height,
		};

		const rightRect: Rectangle = {
			x: rect.x + splitPos,
			y: rect.y,
			width: rect.width - splitPos,
			height: rect.height,
		};

		splitRectangle(leftRect, minSize, parts);
		splitRectangle(rightRect, minSize, parts);
	} else {
		// Split vertically (top and bottom)
		const maxSplit = rect.height - minSize;
		const splitPos = minSize + Math.floor(Math.random() * (maxSplit - minSize + 1));

		const topRect: Rectangle = {
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: splitPos,
		};

		const bottomRect: Rectangle = {
			x: rect.x,
			y: rect.y + splitPos,
			width: rect.width,
			height: rect.height - splitPos,
		};

		splitRectangle(topRect, minSize, parts);
		splitRectangle(bottomRect, minSize, parts);
	}
}

/**
 * Creates a set of rectangular parts that can be assembled into a square and adds them to the world
 * @param world - The Matter.js world to add the cubes to
 * @param cubeSize - The minimum size of one side of a part (in pixels)
 * @param size - The size of the final square in units (final square will be size*cubeSize x size*cubeSize)
 * @returns Array of parts with their physical bodies (already added to world)
 */
export function createCubes(world: Matter.World, cubeSize: number, size: number): Matter.Body[] {
	// Generate rectangles by splitting the square
	const rectangles: Rectangle[] = [];
	const initialRect: Rectangle = {
		x: 0,
		y: 0,
		width: size,
		height: size,
	};

	splitRectangle(initialRect, 1, rectangles);

	// Shuffle rectangles for random order
	shuffleArray(rectangles);

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

	return parts;
}
