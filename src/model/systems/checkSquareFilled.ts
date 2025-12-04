import Matter from 'matter-js';

/**
 * Модуль для итерационной проверки заполнения квадратной сетки кубами в режиме реального времени
 *
 * Функция работает непрерывно, постоянно пересчитывая результат:
 * - Обрабатывает по одному кубу за итерацию
 * - Циклически проходит через все кубы (расчет центра → обработка кубов → повтор)
 * - Возвращает актуальное состояние на каждой итерации
 * - Отслеживает изменения позиций кубов в реальном времени
 *
 * Использование:
 * ```typescript
 * // Создаем чекер с собственной памятью (один раз)
 * const checkSquare = createSquareFilledChecker();
 *
 * // Подготавливаем параметры
 * const params = {
 *   cubes: myCubesArray,     // Массив Matter.Body[]
 *   cellSize: 50,             // Размер одной ячейки
 *   cellsCount: 5,            // Размер сетки 5x5
 *   matchSize: 10             // Допустимое расстояние для считывания куба как "на ячейке"
 * };
 *
 * // Вызываем в каждом кадре игрового цикла
 * function gameLoop() {
 *   const isComplete = checkSquare(params);
 *
 *   if (isComplete) {
 *     // Все ячейки заполнены! Квадрат собран!
 *     onSquareComplete();
 *   } else {
 *     // Квадрат еще не собран
 *   }
 * }
 * ```
 *
 * Функция автоматически сбрасывает состояние при изменении параметров.
 * Кубы могут двигаться в любой момент - функция отследит изменения.
 */

interface CheckSquareFilledParams {
	cubes: Matter.Body[];
	cellSize: number;
	cellsCount: number;
	matchSize: number;
}

interface IterationState {
	phase: 'calculate_center' | 'process_cubes';
	cubeIndex: number;
	centerX: number;
	centerY: number;
	sumX: number;
	sumY: number;
	gridOccupancy: Set<string>; // "x,y" ключи для занятых ячеек
	totalCells: number;
	currentParams: CheckSquareFilledParams | null;
	// Для отслеживания текущего прохода
	currentPassStarted: boolean;
}

/**
 * Создает итерационную функцию для проверки заполнения квадратной сетки кубами в реальном времени
 * Функция использует собственную память и выполняет расчеты постепенно между итерациями
 * Работает непрерывно, циклически пересчитывая результат по мере движения кубов
 *
 * @returns Функция, которая принимает параметры и возвращает текущее состояние:
 *   - true если все ячейки заполнены
 *   - false если не все ячейки заполнены
 */
export function createSquareFilledChecker() {
	// Память функции - сохраняется между итерациями
	let state: IterationState = {
		phase: 'calculate_center',
		cubeIndex: 0,
		centerX: 0,
		centerY: 0,
		sumX: 0,
		sumY: 0,
		gridOccupancy: new Set<string>(),
		totalCells: 0,
		currentParams: null,
		currentPassStarted: false,
	};

	/**
	 * Проверяет, кратен ли угол вращения тела 90° с допуском ±15°
	 */
	function isAngleAlignedTo90Degrees(angle: number): boolean {
		// Нормализуем угол в диапазон [0, 2π)
		const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

		// Преобразуем в градусы для удобства
		const degrees = (normalizedAngle * 180) / Math.PI;

		// Проверяем кратность 90° с допуском ±15°
		const remainder = degrees % 90;
		const tolerance = 15;

		return remainder <= tolerance || remainder >= 90 - tolerance;
	}

	/**
	 * Вычисляет ключ ячейки сетки
	 */
	function getCellKey(gridX: number, gridY: number): string {
		return `${gridX},${gridY}`;
	}

	/**
	 * Определяет, какие ячейки занимает куб
	 */
	function getCubeOccupiedCells(
		cube: Matter.Body,
		gridCenterX: number,
		gridCenterY: number,
		cellSize: number,
		cellsCount: number,
		matchSize: number
	): string[] {
		const occupiedCells: string[] = [];

		// Размеры куба (прямоугольника)
		const cubeWidth = cube.bounds.max.x - cube.bounds.min.x;
		const cubeHeight = cube.bounds.max.y - cube.bounds.min.y;

		// Определяем, сколько ячеек по ширине и высоте занимает куб
		const cellsWide = Math.round(cubeWidth / cellSize);
		const cellsHigh = Math.round(cubeHeight / cellSize);

		// Позиция куба относительно сетки
		const cubePosX = cube.position.x;
		const cubePosY = cube.position.y;

		// Рассчитываем левый верхний угол сетки
		const gridStartX = gridCenterX - (cellsCount * cellSize) / 2;
		const gridStartY = gridCenterY - (cellsCount * cellSize) / 2;

		// Находим ближайшую ячейку к центру куба
		const nearestGridX = Math.round((cubePosX - gridStartX) / cellSize);
		const nearestGridY = Math.round((cubePosY - gridStartY) / cellSize);

		// Проверяем расстояние до ближайшей ячейки
		const nearestCellCenterX = gridStartX + nearestGridX * cellSize;
		const nearestCellCenterY = gridStartY + nearestGridY * cellSize;
		const distance = Math.sqrt(
			Math.pow(cubePosX - nearestCellCenterX, 2) + Math.pow(cubePosY - nearestCellCenterY, 2)
		);

		// Если расстояние слишком большое или угол не кратен 90°, куб не засчитывается
		if (distance >= matchSize || !isAngleAlignedTo90Degrees(cube.angle)) {
			return [];
		}

		// Определяем все ячейки, которые занимает куб
		// Куб может быть повернут, но мы проверили что угол кратен 90°
		const halfWidth = cellsWide / 2;
		const halfHeight = cellsHigh / 2;

		for (let dy = -Math.floor(halfHeight); dy < Math.ceil(halfHeight); dy++) {
			for (let dx = -Math.floor(halfWidth); dx < Math.ceil(halfWidth); dx++) {
				const gridX = nearestGridX + dx;
				const gridY = nearestGridY + dy;

				// Проверяем, что ячейка в пределах сетки
				if (gridX >= 0 && gridX < cellsCount && gridY >= 0 && gridY < cellsCount) {
					occupiedCells.push(getCellKey(gridX, gridY));
				}
			}
		}

		return occupiedCells;
	}

	/**
	 * Итерационная функция проверки в режиме реального времени
	 * Постоянно пересчитывает результат, обрабатывая по одному кубу за итерацию
	 * Возвращает текущее состояние заполненности сетки:
	 * - true если все ячейки заполнены
	 * - false если не все ячейки заполнены
	 */
	return function checkSquareFilled(params: CheckSquareFilledParams): boolean {
		console.log('state.gridOccupancy.size: ', state.gridOccupancy.size, state.phase);
		// Если новые параметры отличаются от текущих, сбрасываем состояние
		if (
			state.currentParams === null ||
			state.currentParams.cubes.length !== params.cubes.length ||
			state.currentParams.cellSize !== params.cellSize ||
			state.currentParams.cellsCount !== params.cellsCount ||
			state.currentParams.matchSize !== params.matchSize
		) {
			// Сброс состояния для новых параметров
			state = {
				phase: 'calculate_center',
				cubeIndex: 0,
				centerX: 0,
				centerY: 0,
				sumX: 0,
				sumY: 0,
				gridOccupancy: new Set<string>(),
				totalCells: params.cellsCount * params.cellsCount,
				currentParams: params,
				currentPassStarted: false,
			};
		}

		const { cubes, cellSize, cellsCount, matchSize } = params;

		// Если нет кубов, возвращаем false
		if (cubes.length === 0) {
			return false;
		}

		// Фаза 1: Постепенный расчет центра всех кубов
		if (state.phase === 'calculate_center') {
			// Начинаем новый проход - сбрасываем предыдущие данные
			if (state.cubeIndex === 0) {
				state.sumX = 0;
				state.sumY = 0;
				state.currentPassStarted = true;
			}

			// Обрабатываем по одному кубу за итерацию
			if (state.cubeIndex < cubes.length) {
				const cube = cubes[state.cubeIndex];
				state.sumX += cube.position.x;
				state.sumY += cube.position.y;
				state.cubeIndex++;

				// Возвращаем текущий результат
				return state.gridOccupancy.size === state.totalCells;
			} else {
				// Расчет центра завершен
				state.centerX = state.sumX / cubes.length;
				state.centerY = state.sumY / cubes.length;
				state.phase = 'process_cubes';
				state.cubeIndex = 0;
				// Очищаем сетку перед новым проходом
				state.gridOccupancy.clear();

				// Возвращаем текущий результат
				return state.gridOccupancy.size === state.totalCells;
			}
		}

		// Фаза 2: Постепенная обработка каждого куба
		if (state.phase === 'process_cubes') {
			// Обрабатываем по одному кубу за итерацию
			if (state.cubeIndex < cubes.length) {
				const cube = cubes[state.cubeIndex];

				// Определяем ячейки, которые занимает этот куб
				const occupiedCells = getCubeOccupiedCells(
					cube,
					state.centerX,
					state.centerY,
					cellSize,
					cellsCount,
					matchSize
				);

				// Добавляем занятые ячейки в Set
				for (const cellKey of occupiedCells) {
					state.gridOccupancy.add(cellKey);
				}

				state.cubeIndex++;

				// Возвращаем текущий результат
				return state.gridOccupancy.size === state.totalCells;
			} else {
				// Обработка всех кубов завершена, начинаем новый цикл
				state.phase = 'calculate_center';
				state.cubeIndex = 0;

				// Возвращаем текущий результат
				return state.gridOccupancy.size === state.totalCells;
			}
		}

		// Возвращаем текущий результат (на случай непредвиденных ситуаций)
		return state.gridOccupancy.size === state.totalCells;
	};
}
