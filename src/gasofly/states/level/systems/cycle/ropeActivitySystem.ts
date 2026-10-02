import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data, { Matter, constants }) => {
	const { rope, catchedCube, controls } = data;

	if (catchedCube) {
		rope.targetLength = 64;
		rope.isActive = true;
	} else {
		rope.targetLength = 32;
		rope.isActive = controls.catch;
	}

	rope.targetLength = catchedCube ? 64 : 32;

	const { ROPE_EXTEND_SPEED, ROPE_RETRACT_SPEED } = constants;

	rope.isExtending = false;

	// Проходим по всем constraints
	for (const constraint of rope.constraints) {
		const currentLength = constraint.length || 0;

		if (rope.isActive) {
			// Увеличиваем длину до целевой
			if (currentLength < rope.targetLength) {
				constraint.length = Math.min(currentLength + ROPE_EXTEND_SPEED, rope.targetLength);
				rope.isExtending = true;

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
});
