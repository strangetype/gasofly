import { Ball } from '../components/ball/ball';

export function renderBall(
	ball: ReturnType<typeof Ball.mount>,
	ballX: number,
	ballY: number,
	rotation: number
) {
	ball!.setPosition(ballX, ballY, rotation);
}
