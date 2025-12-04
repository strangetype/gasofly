import { LABIRYNTH_CELL_TYPE } from '@/common/types';

export interface Data {
	level: number;
	score: number;
	health: number;
	engine: Matter.Engine | null;
	runner: Matter.Runner | null;
	cubes: Matter.Body[];
	catchedCube: Matter.Body | false;
	labyrinth: LABIRYNTH_CELL_TYPE[][];
	wallSize: number;
	cubeSize: number;
	gravity: { x: number; y: number };
	ball: { x: number; y: number; radius: number; RigidBody: Matter.Body | null; maxPower: number };
	rope: { segments: Matter.Body[]; constraints: Matter.Constraint[] };
	controls: { vector: [number, number] };
}

export const data: Data = {
	level: 0,
	score: 0,
	health: 100,
	engine: null,
	runner: null,
	cubes: [],
	catchedCube: false,
	labyrinth: [['e']],
	wallSize: 256,
	cubeSize: 64,
	gravity: { x: 0, y: 1 },
	ball: { x: 0, y: 0, radius: 64, RigidBody: null, maxPower: 0.03 },
	rope: { segments: [], constraints: [] },
	controls: { vector: [0, 0] },
};
