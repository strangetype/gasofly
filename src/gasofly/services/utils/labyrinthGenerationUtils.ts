import { LABYRINTH_CELL_TYPE } from '@/common/types';
import { Position } from './geometryUtils';

type Labyrinth = LABYRINTH_CELL_TYPE[][];

/**
 * Генерирует случайный лабиринт size×size:
 * - края закрыты стенами (вылететь нельзя);
 * - внутри случайные стены с вероятностью wallChance;
 * - все проходы связны (нет замкнутых комнат);
 * - в случайный проход ставится мяч ('b').
 */
export function generateRandomLabyrinth(
	size: number,
	wallChance: number,
	random: () => number,
	math: Math
): Labyrinth {
	// 1. Изначально всё — стены: это гарантирует закрытые края
	const labyrinth: Labyrinth = [];
	for (let y = 0; y < size; y++) {
		const row: LABYRINTH_CELL_TYPE[] = [];
		for (let x = 0; x < size; x++) {
			row.push('w');
		}
		labyrinth.push(row);
	}

	// 2. Внутренняя область заполняется случайно; края остаются стенами
	for (let y = 1; y < size - 1; y++) {
		for (let x = 1; x < size - 1; x++) {
			labyrinth[y][x] = random() < wallChance ? 'w' : 'e';
		}
	}

	// 3. Связываем все проходы в один компонент — замкнутых комнат нет
	connectLabyrinthPassages(labyrinth, math);

	// 4. Ставим мяч в случайный проход
	placeBallInLabyrinth(labyrinth, random, math);

	return labyrinth;
}

/**
 * Соединяет все проходы в один связный компонент,
 * прорубая коридоры между ближайшими частями разных компонентов.
 */
export function connectLabyrinthPassages(labyrinth: Labyrinth, math: Math): void {
	while (true) {
		const components = getLabyrinthComponents(labyrinth);

		if (components.length <= 1) {
			return;
		}

		const first = components[0];
		const second = components[1];

		// Ближайшая пара клеток между двумя компонентами
		let closestFrom = first[0];
		let closestTo = second[0];
		let closestDistance = Infinity;

		for (const from of first) {
			for (const to of second) {
				const distance = math.abs(from.x - to.x) + math.abs(from.y - to.y);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestFrom = from;
					closestTo = to;
				}
			}
		}

		carveLabyrinthPath(labyrinth, closestFrom, closestTo);
	}
}

/** Возвращает список связных компонентов проходов (4-связность) */
export function getLabyrinthComponents(labyrinth: Labyrinth): Position[][] {
	const height = labyrinth.length;
	const width = labyrinth[0].length;

	const visited: boolean[][] = [];
	for (let y = 0; y < height; y++) {
		visited.push(new Array<boolean>(width).fill(false));
	}

	const components: Position[][] = [];

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (labyrinth[y][x] === 'w' || visited[y][x]) {
				continue;
			}

			const component: Position[] = [];
			const stack: Position[] = [{ x, y }];
			visited[y][x] = true;

			while (stack.length > 0) {
				const cell = stack.pop()!;
				component.push(cell);

				const neighbors: Position[] = [
					{ x: cell.x + 1, y: cell.y },
					{ x: cell.x - 1, y: cell.y },
					{ x: cell.x, y: cell.y + 1 },
					{ x: cell.x, y: cell.y - 1 },
				];

				for (const neighbor of neighbors) {
					if (neighbor.x < 0 || neighbor.x >= width) continue;
					if (neighbor.y < 0 || neighbor.y >= height) continue;
					if (visited[neighbor.y][neighbor.x]) continue;
					if (labyrinth[neighbor.y][neighbor.x] === 'w') continue;

					visited[neighbor.y][neighbor.x] = true;
					stack.push(neighbor);
				}
			}

			components.push(component);
		}
	}

	return components;
}

/** Прорубает Г-образный коридор между двумя клетками */
export function carveLabyrinthPath(labyrinth: Labyrinth, from: Position, to: Position): void {
	let x = from.x;
	let y = from.y;

	while (x !== to.x) {
		x += x < to.x ? 1 : -1;
		labyrinth[y][x] = 'e';
	}

	while (y !== to.y) {
		y += y < to.y ? 1 : -1;
		labyrinth[y][x] = 'e';
	}
}

/** Ставит мяч ('b') в случайную клетку-проход */
export function placeBallInLabyrinth(labyrinth: Labyrinth, random: () => number, math: Math): void {
	const passages: Position[] = [];

	for (let y = 0; y < labyrinth.length; y++) {
		for (let x = 0; x < labyrinth[y].length; x++) {
			if (labyrinth[y][x] === 'e') {
				passages.push({ x, y });
			}
		}
	}

	if (passages.length === 0) {
		// Страховка: центральная клетка становится клеткой мяча
		const centerX = math.floor(labyrinth[0].length / 2);
		const centerY = math.floor(labyrinth.length / 2);
		labyrinth[centerY][centerX] = 'b';
		return;
	}

	const cell = passages[math.floor(random() * passages.length)];
	labyrinth[cell.y][cell.x] = 'b';
}
