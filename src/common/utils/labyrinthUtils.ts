import { LABIRYNTH_CELL_TYPE } from '@/common/types';
import { Position } from './geometryUtils';

/**
 * Converts cell coordinates to world coordinates
 */
export function cellToWorld(cellX: number, cellY: number, wallSize: number): Position {
	return {
		x: cellX * wallSize + wallSize / 2,
		y: cellY * wallSize + wallSize / 2,
	};
}

/**
 * Finds all cells of a specific type in the labyrinth
 */
export function findCellsByType(
	labyrinth: LABIRYNTH_CELL_TYPE[][],
	cellType: LABIRYNTH_CELL_TYPE
): Position[] {
	const positions: Position[] = [];
	for (let y = 0; y < labyrinth.length; y++) {
		for (let x = 0; x < labyrinth[y].length; x++) {
			if (labyrinth[y][x] === cellType) {
				positions.push({ x, y });
			}
		}
	}
	return positions;
}

/**
 * Finds the first cell of a specific type in the labyrinth
 */
export function findFirstCellByType(
	labyrinth: LABIRYNTH_CELL_TYPE[][],
	cellType: LABIRYNTH_CELL_TYPE
): Position | null {
	for (let y = 0; y < labyrinth.length; y++) {
		for (let x = 0; x < labyrinth[y].length; x++) {
			if (labyrinth[y][x] === cellType) {
				return { x, y };
			}
		}
	}
	return null;
}
