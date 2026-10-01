import { LABYRINTH_CELL_TYPE } from '@/common/types';

const WALL_SIZE = 128;
const GRAVITY = { x: 0, y: 1 }; // Standard gravity
const FIRST_LEVEL_LABYRINTH: LABYRINTH_CELL_TYPE[][] = [
	['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
	['w', 'e', 'e', 'e', 'w', 'e', 'e', 'e', 'e', 'w'],
	['w', 'e', 'w', 'e', 'e', 'e', 'w', 'c', 'c', 'w'],
	['w', 'b', 'e', 'e', 'w', 'e', 'e', 'c', 'c', 'w'],
	['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
];

export const constants = {
	WALL_SIZE,
	GRAVITY,
	FIRST_LEVEL_LABYRINTH,
} as const;
