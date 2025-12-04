import { Data } from '@/model/data/levelModelData';
import Matter from 'matter-js';

export function updateBallThrust(
	ball: Data['ball'],
	vector: [number, number],
	offsetY: number = -0.2 * ball.radius
) {
	if (vector[0] === 0 && vector[1] === 0) return;

	// Создаем вектор силы из нормализованного вектора управления
	const force = {
		x: vector[0] * ball.maxPower * 0.5,
		y: vector[1] * ball.maxPower,
	};

	// Получаем угол вращения мяча
	const angle = ball.RigidBody!.angle;

	// Вычисляем смещение точки приложения силы с учетом вращения
	// Исходное смещение (0, -offsetY) поворачиваем на угол мяча
	const offsetX = -offsetY * Math.sin(angle);
	const offsetY_rotated = -offsetY * Math.cos(angle);

	// Вычисляем точку приложения силы в мировых координатах
	const forcePoint = {
		x: ball.RigidBody!.position.x + offsetX,
		y: ball.RigidBody!.position.y + offsetY_rotated,
	};

	// Применяем силу к точке с учетом вращения
	Matter.Body.applyForce(ball.RigidBody!, forcePoint, force);
}
