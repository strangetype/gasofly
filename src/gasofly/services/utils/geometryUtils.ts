export interface Position {
	x: number;
	y: number;
}

export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Calculates the minimum distance from a position to all placed positions
 */
export function getMinDistance(pos: Position, placedPositions: Position[]): number {
	if (placedPositions.length === 0) {
		return Infinity;
	}

	let minDistance = Infinity;
	for (const placed of placedPositions) {
		const distance = Math.sqrt(Math.pow(pos.x - placed.x, 2) + Math.pow(pos.y - placed.y, 2));
		minDistance = Math.min(minDistance, distance);
	}
	return minDistance;
}

/**
 * Calculates the Euclidean distance between two positions
 */
export function getDistance(pos1: Position, pos2: Position): number {
	return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

/**
 * Gets the width and height of a rectangular Matter.Body based on its vertices
 * Calculates actual physical dimensions by measuring distances between vertices
 */
export function getBodyDimensions(body: Matter.Body): { width: number; height: number } {
	const vertices = body.vertices;

	if (vertices.length < 2) {
		throw new Error('Body must have at least 2 vertices');
	}

	// Calculate distance between first two vertices (first side)
	const side1 = Math.sqrt(
		Math.pow(vertices[1].x - vertices[0].x, 2) + Math.pow(vertices[1].y - vertices[0].y, 2)
	);

	// For rectangular bodies, calculate distance between second and third vertices (second side)
	const side2 =
		vertices.length >= 3
			? Math.sqrt(
					Math.pow(vertices[2].x - vertices[1].x, 2) +
						Math.pow(vertices[2].y - vertices[1].y, 2)
				)
			: side1;

	return { width: side1, height: side2 };
}

/**
 * Проверяет, кратен ли угол вращения тела 90° с допуском ±15°
 */
export function isAngleAlignedTo90Degrees(angle: number): boolean {
	// Нормализуем угол в диапазон [0, 2π)
	const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

	// Преобразуем в градусы для удобства
	const degrees = (normalizedAngle * 180) / Math.PI;

	// Проверяем кратность 90° с допуском ±15°
	const remainder = degrees % 90;
	const tolerance = 15;

	return remainder <= tolerance || remainder >= 90 - tolerance;
}

/**
 * Recursively splits a rectangle into smaller rectangles
 */
export function splitRectangle(rect: Rectangle, minSize: number, parts: Rectangle[]): void {
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
