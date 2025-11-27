import { LABIRYNTH_CELL_TYPE } from '@/common/types';

export const WALL_SIZE = 128;
export const GRAVITY = { x: 0, y: 1 }; // Standard Matter.js gravity
export const FIRST_LEVEL_LABYRINTH: LABIRYNTH_CELL_TYPE[][] = [
	['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
	['w', 'e', 'e', 'e', 'w', 'e', 'e', 'e', 'e', 'w'],
	['w', 'e', 'w', 'e', 'e', 'e', 'w', 'e', 'e', 'w'],
	['w', 'b', 'e', 'e', 'w', 'e', 'e', 'e', 'e', 'w'],
	['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
];
