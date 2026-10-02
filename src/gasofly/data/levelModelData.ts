import { LABYRINTH_CELL_TYPE } from '../types/types';
import Matter from 'matter-js';

export interface Data {
	counter: number;
	level: number;
	levelState: 'active' | 'win' | 'lose' | null;
	score: number;
	health: number;
	engine: Matter.Engine | null;
	runner: Matter.Runner | null;
	cubes: Matter.Body[];
	cubesTargetScheme: {
		center: { x: number; y: number };
	};
	isCubeAssembled: boolean;
	catchedCube: Matter.Body | false;
	labyrinth: LABYRINTH_CELL_TYPE[][];
	wallSize: number;
	cubeSize: number;
	fullCubeSize: number;
	gravity: { x: number; y: number };
	ball: { x: number; y: number; radius: number; RigidBody: Matter.Body | null; maxPower: number };
	rope: {
		segments: Matter.Body[];
		constraints: Matter.Constraint[];
		targetLength: number;
		isActive: boolean;
		isExtending: boolean;
	};
	controls: { vector: [number, number]; catch: boolean };
}

export const levelModelData: Data = {
	counter: 0,
	level: 150,
	levelState: null,
	score: 0,
	health: 100,
	engine: null,
	runner: null,
	cubes: [],
	cubesTargetScheme: {
		center: { x: 0, y: 0 },
	},
	isCubeAssembled: false,
	catchedCube: false,
	labyrinth: [['e']],
	wallSize: 256,
	cubeSize: 64,
	fullCubeSize: 4,
	gravity: { x: 0, y: 1 },
	ball: { x: 0, y: 0, radius: 64, RigidBody: null, maxPower: 0.03 },
	rope: { segments: [], constraints: [], targetLength: 0, isActive: false, isExtending: false },
	controls: { vector: [0, 0], catch: false },
};
