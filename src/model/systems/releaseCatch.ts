import Matter from 'matter-js';

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
export function releaseCatch(
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
