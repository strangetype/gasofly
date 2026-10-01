import Matter from 'matter-js';

const ROPE_EXTEND_SPEED = 3; // Быстрое увеличение длины (пикселей за итерацию)
const ROPE_RETRACT_SPEED = 0.2; // Медленное уменьшение длины (пикселей за итерацию)

/**
 * Управляет активностью веревки, изменяя длину её сегментов
 * @param constraints - связи между сегментами
 * @param targetLength - целевая длина каждого сегмента
 * @param isActive - флаг активности веревки
 * @returns true - если веревка увеличивается, false - если увеличена или уменьшается
 */
export function ropeActivity(
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
