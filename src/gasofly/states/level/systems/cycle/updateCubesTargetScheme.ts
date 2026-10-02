import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data) => {
	const { cubes } = data;

	if (cubes.length === 0) return;

	// Суперпозиция координат всех кубов с учётом веса (массы) каждого куба:
	// center = Σ(weight_i * position_i) / Σ(weight_i)
	let totalWeight = 0;
	let weightedX = 0;
	let weightedY = 0;

	for (const cube of cubes) {
		const weight = cube.mass;

		totalWeight += weight;
		weightedX += cube.position.x * weight;
		weightedY += cube.position.y * weight;
	}

	// Защита от деления на ноль (все веса нулевые)
	if (totalWeight === 0) return;

	data.cubesTargetScheme.center.x = weightedX / totalWeight;
	data.cubesTargetScheme.center.y = weightedY / totalWeight;
});
