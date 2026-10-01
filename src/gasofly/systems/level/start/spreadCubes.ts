import { createLevelSystem } from '../levelSystem';

export default createLevelSystem((data, { Utils, Matter }) => {
	const { cubes, labyrinth, wallSize } = data;
	const { shuffleArray, getMinDistance, findCellsByType, cellToWorld } = Utils;

	// Найти все ячейки 'c' для размещения кубов
	const cubePositions = findCellsByType(labyrinth, 'c');

	// Случайно перемешать позиции
	shuffleArray(cubePositions);

	// Разместить кубы
	let cubeIndex = 0;

	// Сначала размещаем в ячейках 'c'
	for (let i = 0; i < cubePositions.length && cubeIndex < cubes.length; i++) {
		const pos = cubePositions[i];
		const worldPos = cellToWorld(pos.x, pos.y, wallSize);

		Matter.Body.setPosition(cubes[cubeIndex], worldPos);
		cubeIndex++;
	}

	// Если остались кубы, размещаем их в свободных ячейках 'e' на максимальном удалении
	if (cubeIndex < cubes.length) {
		// Найти все свободные ячейки 'e'
		const emptyPositions = findCellsByType(labyrinth, 'e');

		// Позиции уже размещенных кубов
		const placedPositions: Utils.Position[] = cubePositions.slice(0, cubeIndex);

		// Размещаем оставшиеся кубы на максимальном удалении
		while (cubeIndex < cubes.length && emptyPositions.length > 0) {
			// Найти ячейку с максимальным минимальным расстоянием до всех размещенных кубов
			let bestIndex = 0;
			let maxMinDistance = -1;

			for (let i = 0; i < emptyPositions.length; i++) {
				const pos = emptyPositions[i];
				const minDistance = getMinDistance(pos, placedPositions);

				if (minDistance > maxMinDistance) {
					maxMinDistance = minDistance;
					bestIndex = i;
				}
			}

			// Разместить куб в лучшей позиции
			const bestPos = emptyPositions[bestIndex];
			const worldPos = cellToWorld(bestPos.x, bestPos.y, wallSize);

			Matter.Body.setPosition(cubes[cubeIndex], worldPos);

			// Добавить в список размещенных и удалить из списка свободных
			placedPositions.push(bestPos);
			emptyPositions.splice(bestIndex, 1);
			cubeIndex++;
		}
	}
});
