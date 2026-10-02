import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data) => {
	const { cubes, cubesTargetScheme, cubeSize, fullCubeSize } = data;

	if (cubes.length === 0) return;

	// Габариты предполагаемого собранного куба (сторона = fullCubeSize * cubeSize)
	const side = fullCubeSize * cubeSize;
	const half = side / 2;

	// Допуск: куб не должен выходить за границы более чем на 1/4 cubeSize
	const tolerance = cubeSize / 16;

	const { center } = cubesTargetScheme;

	// Границы предполагаемого куба (модель считает их сама, без данных от view)
	const left = center.x - half;
	const right = center.x + half;
	const top = center.y - half;
	const bottom = center.y + half;

	// Куб собран, если каждый малый куб своими габаритами (AABB из модели)
	// не выходит за границы предполагаемого куба более чем на tolerance
	const isAssembled = cubes.every((cube) => {
		const { min, max } = cube.bounds;

		return (
			min.x >= left - tolerance &&
			max.x <= right + tolerance &&
			min.y >= top - tolerance &&
			max.y <= bottom + tolerance
		);
	});

	// Латч: как только куб собран — фиксируем флаг и оповещаем один раз
	if (isAssembled && !data.isCubeAssembled) {
		data.isCubeAssembled = true;
		data.levelState = 'win';
	}
});
