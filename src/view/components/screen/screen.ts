import { View } from '@/common/View';
import screenHtml from './screen.html?raw';
import './screen.scss';

export const Screen = View(
	screenHtml,
	(root) => {
		const content = root.querySelector('.screen__content') as HTMLElement;
		const camera = root.querySelector('.screen__camera') as HTMLElement;

		// Целевые значения камеры [x, y, zoom]
		const targetCamera = [0, 0, 1];
		// Текущие значения камеры (для плавной интерполяции)
		const currentCamera = [0, 0, 1];

		// Коэффициент плавности (чем меньше, тем плавнее)
		const smoothness = 0.1;

		let animationFrameId: number | null = null;

		function updateCameraTransform() {
			// Интерполяция текущих значений к целевым
			let needsUpdate = false;

			for (let i = 0; i < 3; i++) {
				const diff = targetCamera[i] - currentCamera[i];
				if (Math.abs(diff) > 0.001) {
					currentCamera[i] += diff * smoothness;
					needsUpdate = true;
				} else {
					currentCamera[i] = targetCamera[i];
				}
			}

			// Вычисляем центр screen__content
			const centerX = content.clientWidth / 2;
			const centerY = content.clientHeight / 2;

			// Применяем трансформацию: сначала масштабируем, потом сдвигаем
			// Чтобы точка (x, y) оказалась в центре, нужно:
			// translateX = centerX - x * zoom
			// translateY = centerY - y * zoom
			const translateX = centerX - currentCamera[0] * currentCamera[2];
			const translateY = centerY - currentCamera[1] * currentCamera[2];

			camera.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentCamera[2]})`;

			// Продолжаем анимацию, если есть изменения
			if (needsUpdate) {
				animationFrameId = requestAnimationFrame(updateCameraTransform);
			} else {
				animationFrameId = null;
			}
		}

		function startAnimation() {
			if (animationFrameId === null) {
				animationFrameId = requestAnimationFrame(updateCameraTransform);
			}
		}

		function setCameraPoint(x: number, y: number) {
			targetCamera[0] = x;
			targetCamera[1] = y;
			startAnimation();
		}

		function setCameraZoom(zoom: number) {
			targetCamera[2] = zoom;
			startAnimation();
		}

		// Начальная установка камеры
		updateCameraTransform();

		return {
			content,
			camera,
			setCameraPoint,
			setCameraZoom,
		};
	},
	() => {}
);
