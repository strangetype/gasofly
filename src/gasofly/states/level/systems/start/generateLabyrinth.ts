import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data, { constants, Utils, RandomService, Math }) => {
	data.levelState = 'active';
	data.isCubeAssembled = false;
	// Уровень 0 — всегда заранее заданная схема из констант
	if (data.level === 0) {
		// Копируем, чтобы не мутировать константу
		data.labyrinth = constants.FIRST_LEVEL_LABYRINTH.map((row) => [...row]);
		return;
	}

	// Размер карты: N×N, где N = round(sqrt(LABYRINTH_BASE_AREA + level))
	const size = Math.max(
		constants.LABYRINTH_MIN_SIZE,
		Math.round(Math.sqrt(constants.LABYRINTH_BASE_AREA + data.level))
	);

	data.labyrinth = Utils.generateRandomLabyrinth(
		size,
		constants.LABYRINTH_WALL_CHANCE,
		RandomService.random,
		Math
	);
});
