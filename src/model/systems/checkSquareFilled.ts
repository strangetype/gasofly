import Matter from 'matter-js';

interface CheckSquareFilledParams {
	cubes: Matter.Body[];
	cellSize: number;
	cellsCount: number;
	matchSize: number;
}

function calcCenterPosition(
	position: Matter.Vector,
	cubes: Matter.Body[],
	cellSize: number,
	i: number
): Matter.Vector {
	return {
		x: 0,
		y: 0,
	};
}

function updateTargetPosition() {}

function updateCubeTargetLink() {}

function checkCubeTargetDistance() {}

function checkCubeAngle() {}

export function createSquareFilledChecker() {
	let i = 0;

	return function checkSquareFilled(params: CheckSquareFilledParams): boolean {
		return false;
	};
}
