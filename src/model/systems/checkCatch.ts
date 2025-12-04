import Matter from 'matter-js';
import { hasActiveCollision } from '@/common/utils/checkCollision';

export function checkCatch(engine: Matter.Engine, cubes: Matter.Body[], ropeSegment: Matter.Body) {
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
