import Matter from 'matter-js';

/**
 * Проверяет наличие столкновения между двумя телами
 * @param bodyA - первое тело для проверки
 * @param bodyB - второе тело для проверки
 * @returns объект с информацией о столкновении или null, если столкновения нет
 */
export function checkCollision(
	bodyA: Matter.Body,
	bodyB: Matter.Body
): Matter.Collision | null {
	// Проверяем столкновение между двумя телами
	const collision = Matter.Collision.collides(bodyA, bodyB);

	// Matter.Collision.collides возвращает null если столкновения нет,
	// или объект Collision с информацией о столкновении
	return collision;
}

/**
 * Проверяет, произошло ли столкновение между двумя телами (упрощенная версия)
 * @param bodyA - первое тело для проверки
 * @param bodyB - второе тело для проверки
 * @returns true, если тела сталкиваются, иначе false
 */
export function hasCollision(bodyA: Matter.Body, bodyB: Matter.Body): boolean {
	const collision = Matter.Collision.collides(bodyA, bodyB);
	return collision !== null;
}

/**
 * Проверяет, было ли столкновение между двумя телами в текущем кадре через engine
 * @param engine - физический движок Matter.js
 * @param bodyA - первое тело для проверки
 * @param bodyB - второе тело для проверки
 * @returns true, если найдено активное столкновение в pairs engine
 */
export function hasActiveCollision(
	engine: Matter.Engine,
	bodyA: Matter.Body,
	bodyB: Matter.Body
): boolean {
	const pairs = engine.pairs.list;

	// Проходим по всем активным парам столкновений
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];

		// Проверяем, участвуют ли наши тела в этой паре столкновений
		if (pair.isActive) {
			const bodyAMatch =
				(pair.bodyA === bodyA && pair.bodyB === bodyB) ||
				(pair.bodyA === bodyB && pair.bodyB === bodyA);

			if (bodyAMatch) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Получает информацию о всех активных столкновениях для конкретного тела
 * @param engine - физический движок Matter.js
 * @param body - тело для проверки
 * @returns массив тел, с которыми происходит столкновение
 */
export function getCollidingBodies(
	engine: Matter.Engine,
	body: Matter.Body
): Matter.Body[] {
	const collidingBodies: Matter.Body[] = [];
	const pairs = engine.pairs.list;

	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];

		if (pair.isActive) {
			if (pair.bodyA === body) {
				collidingBodies.push(pair.bodyB);
			} else if (pair.bodyB === body) {
				collidingBodies.push(pair.bodyA);
			}
		}
	}

	return collidingBodies;
}

