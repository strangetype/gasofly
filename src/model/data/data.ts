import { LABIRYNTH_CELL_TYPE } from '@/common/types';

export interface Data {
	level: number;
	score: number;
	health: number;
	engine: Matter.Engine | null;
	runner: Matter.Runner | null;
	labyrinth: LABIRYNTH_CELL_TYPE[][];
	wallSize: number;
	gravity: { x: number; y: number };
	ball: { x: number; y: number; radius: number; RigidBody: Matter.Body | null };
	controls: { vector: [number, number] };
}

export const data: Data = {
	level: 0,
	score: 0,
	health: 100,
	engine: null,
	runner: null,
	labyrinth: [['e']],
	wallSize: 256,
	gravity: { x: 0, y: 1 },
	ball: { x: 0, y: 0, radius: 64, RigidBody: null },
	controls: { vector: [0, 0] },
};
