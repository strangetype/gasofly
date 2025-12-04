export interface Position {
	x: number;
	y: number;
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
		Math.pow(vertices[1].x - vertices[0].x, 2) + 
		Math.pow(vertices[1].y - vertices[0].y, 2)
	);
	
	// For rectangular bodies, calculate distance between second and third vertices (second side)
	const side2 = vertices.length >= 3 
		? Math.sqrt(
			Math.pow(vertices[2].x - vertices[1].x, 2) + 
			Math.pow(vertices[2].y - vertices[1].y, 2)
		)
		: side1;
	
	return { width: side1, height: side2 };
}

