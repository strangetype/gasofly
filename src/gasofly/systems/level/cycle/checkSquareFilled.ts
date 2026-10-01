import { createLevelSystem } from '../levelSystem';
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

function checkSquareFilled(params: CheckSquareFilledParams): boolean {
	return false;
}

export default createLevelSystem((data) => {
	const isSquareFilled = checkSquareFilled({
		cubes: data.cubes,
		cellSize: data.cubeSize,
		cellsCount: 2,
		matchSize: data.cubeSize / 2,
	});

	if (isSquareFilled) {
		// TODO: обработать заполненный квадрат (в старом коде — alert)
	}
});
