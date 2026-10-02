import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data, { constants, Matter, Utils }) => {
	const { ROPE_EXTEND_SPEED, ROPE_RETRACT_SPEED } = constants;
	const { hasActiveCollision } = Utils;

	function ropeActivity(
		constraints: Matter.Constraint[],
		targetLength: number,
		isActive: boolean
	): boolean {
		if (constraints.length === 0) {
			return false;
		}

		let isExtending = false;

		// Проходим по всем constraints
		for (const constraint of constraints) {
			const currentLength = constraint.length || 0;

			if (isActive) {
				// Увеличиваем длину до целевой
				if (currentLength < targetLength) {
					constraint.length = Math.min(currentLength + ROPE_EXTEND_SPEED, targetLength);
					isExtending = true;

					// Активируем сегменты для физического мира
					if (constraint.bodyA && !constraint.bodyA.isStatic) {
						Matter.Body.set(constraint.bodyA, { isSleeping: false });
					}
					if (constraint.bodyB && !constraint.bodyB.isStatic) {
						Matter.Body.set(constraint.bodyB, { isSleeping: false });
					}
				}
			} else {
				// Уменьшаем длину до нуля
				if (currentLength > 0) {
					constraint.length = Math.max(currentLength - ROPE_RETRACT_SPEED, 0);

					// Деактивируем сегменты, когда длина достигла нуля
					if (constraint.length === 0) {
						if (constraint.bodyA && !constraint.bodyA.isStatic) {
							Matter.Body.set(constraint.bodyA, { isSleeping: true });
						}
						if (constraint.bodyB && !constraint.bodyB.isStatic) {
							Matter.Body.set(constraint.bodyB, { isSleeping: true });
						}
					}
				}
			}
		}

		return isExtending;
	}

	function checkCatch(engine: Matter.Engine, cubes: Matter.Body[], ropeSegment: Matter.Body) {
		let catchedCube: Matter.Body | false = false;
		for (const cube of cubes) {
			if (hasActiveCollision(engine, cube, ropeSegment)) {
				catchedCube = cube;
			}
		}

		// Если куб пойман, создаем плотную физическую связь
		if (catchedCube) {
			const constraint = Matter.Constraint.create({
				bodyA: ropeSegment,
				bodyB: catchedCube,
				pointA: { x: 0, y: 0 }, // Центр сегмента веревки
				pointB: { x: 0, y: 0 }, // Центр куба
				stiffness: 1, // Максимальная жесткость для плотной связи
				damping: 1, // Минимальное затухание
				length: 0, // Нулевая длина для жесткого соединения
			});

			// Добавляем constraint в физический мир
			Matter.Composite.add(engine.world, constraint);

			// Отключаем столкновения между кубом и сегментом веревки
			// Изменяем маску коллизий куба, чтобы он не сталкивался с категорией сегментов (0x0008)
			const ropeCategory = 0x0008; // Категория сегментов веревки из createBallRope

			// Убираем категорию веревки из маски куба
			// Используем побитовое И с инвертированной категорией веревки
			const currentMask = catchedCube.collisionFilter.mask ?? 0xffffffff; // Дефолтная маска
			catchedCube.collisionFilter.mask = currentMask & ~ropeCategory;

			return catchedCube;
		}

		return false;
	}

	/**
	 * Разрушает связь между кубом и сегментом веревки
	 * Выполняет обратные действия от checkCatch:
	 * - Удаляет физический constraint между объектами
	 * - Восстанавливает маску столкновений куба
	 *
	 * @param engine - Физический движок Matter.js
	 * @param cube - Куб, который нужно освободить
	 * @param ropeSegment - Сегмент веревки, от которого нужно отсоединить куб
	 * @returns true если связь была найдена и разрушена, false если связь не найдена
	 */
	function releaseCatch(
		engine: Matter.Engine,
		cube: Matter.Body,
		ropeSegment: Matter.Body
	): boolean {
		// Находим constraint между кубом и сегментом веревки
		const constraints = Matter.Composite.allConstraints(engine.world);
		const connectionConstraint = constraints.find(
			(constraint) =>
				(constraint.bodyA === ropeSegment && constraint.bodyB === cube) ||
				(constraint.bodyA === cube && constraint.bodyB === ropeSegment)
		);

		// Если связь не найдена, возвращаем false
		if (!connectionConstraint) {
			return false;
		}

		// Удаляем constraint из физического мира
		Matter.Composite.remove(engine.world, connectionConstraint);

		// Восстанавливаем маску коллизий куба
		// Добавляем обратно категорию веревки в маску
		const ropeCategory = 0x0008; // Категория сегментов веревки из createBallRope
		const currentMask = cube.collisionFilter.mask ?? 0xffffffff; // Дефолтная маска
		cube.collisionFilter.mask = currentMask | ropeCategory;

		return true;
	}

	const { engine, cubes, rope, controls } = data;
	const lastSegment = rope.segments[rope.segments.length - 1];
	const tap = controls.catch;

	if (data.catchedCube) {
		// Куб уже пойман — веревка вытянута до упора
		ropeActivity(rope.constraints, 64, true);

		// Если кнопка кэтча нажата — отпускаем куб
		if (tap) {
			releaseCatch(engine!, data.catchedCube, lastSegment);
			data.catchedCube = false;
			controls.catch = false;
		}
	} else {
		// Куб не пойман — пытаемся ловить (веревка удлиняется при нажатии)
		const isCatching = ropeActivity(rope.constraints, 32, tap);

		if (isCatching && !data.catchedCube) {
			const catchedCube = checkCatch(engine!, cubes, lastSegment);

			// Если куб был пойман, constraint уже создан и добавлен в мир
			if (catchedCube) {
				console.log('Cube catched:', catchedCube);
				data.catchedCube = catchedCube;
				controls.catch = false;
			}
		} else if (!isCatching && tap) {
			controls.catch = false;
		}
	}
});
