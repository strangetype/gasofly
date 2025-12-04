import { View } from '@/common/View';
import screenHtml from './screen.html?raw';
import './screen.scss';

export const Screen = createScreen();

function createScreen() {
	// Общие переменные для mount и unmount
	let resizeObserver: ResizeObserver | null = null;

	return View(
		screenHtml,
		(root) => {
			const content = root.querySelector('.screen__content') as HTMLElement;
			const camera = root.querySelector('.screen__camera') as HTMLElement;
			const ui = root.querySelector('.screen__ui') as HTMLElement;

			// Целевые значения камеры [x, y, zoom]
			const targetCamera = [0, 0, 1];
			// Текущие значения камеры (для плавной интерполяции)
			const currentCamera = [0, 0, 1];

			// Коэффициент плавности (увеличен для быстрой интерполяции)
			const smoothness = 0.15;

			// Кэшированные размеры для оптимизации (избегаем reflow)
			let cachedCenterX = content.clientWidth / 2;
			let cachedCenterY = content.clientHeight / 2;

			// Обновляем кэш размеров при resize
			resizeObserver = new ResizeObserver(() => {
				cachedCenterX = content.clientWidth / 2;
				cachedCenterY = content.clientHeight / 2;
			});
			resizeObserver.observe(content);

			// Флаг для отслеживания необходимости обновления
			let needsUpdate = false;

			function updateCameraTransform() {
				// Интерполяция текущих значений к целевым
				needsUpdate = false;

				for (let i = 0; i < 3; i++) {
					const diff = targetCamera[i] - currentCamera[i];
					if (Math.abs(diff) > 0.001) {
						currentCamera[i] += diff * smoothness;
						needsUpdate = true;
					} else {
						currentCamera[i] = targetCamera[i];
					}
				}

				// Применяем трансформацию используя кэшированные размеры
				const translateX = cachedCenterX - currentCamera[0] * currentCamera[2];
				const translateY = cachedCenterY - currentCamera[1] * currentCamera[2];

				camera.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentCamera[2]})`;
			}

			function setCameraPoint(x: number, y: number) {
				targetCamera[0] = x;
				targetCamera[1] = y;
			}

			function setCameraZoom(zoom: number) {
				targetCamera[2] = zoom;
			}

			// Метод для внешнего вызова обновления (из основного цикла рендеринга)
			function updateCameraFrame() {
				updateCameraTransform();
			}

			// Начальная установка камеры
			updateCameraTransform();

			return {
				content,
				camera,
				ui,
				setCameraPoint,
				setCameraZoom,
				updateCameraFrame,
			};
		},
		() => {
			// Отписка от слушателей при размонтировании
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
		}
	);
}
