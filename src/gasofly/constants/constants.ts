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

const ROPE_EXTEND_SPEED = 3; // Быстрое увеличение длины (пикселей за итерацию)
const ROPE_RETRACT_SPEED = 0.2; // Медленное уменьшение длины (пикселей за итерацию)

const LABYRINTH_WALL_CHANCE = 0.3; // Вероятность появления стены во внутренней области карты
const LABYRINTH_MIN_SIZE = 3; // Минимальный размер карты (место для закрытых краёв)
const LABYRINTH_BASE_AREA = 50; // Базовая площадь: N = round(sqrt(BASE_AREA + level))

export const constants = {
	WALL_SIZE,
	GRAVITY,
	FIRST_LEVEL_LABYRINTH,
	ROPE_EXTEND_SPEED,
	ROPE_RETRACT_SPEED,
	LABYRINTH_WALL_CHANCE,
	LABYRINTH_MIN_SIZE,
	LABYRINTH_BASE_AREA,
} as const;
