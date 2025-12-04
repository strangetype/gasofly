import { View } from '@/common/View';
import vectorControlHtml from './vector-control.html?raw';
import './vector-control.scss';

export { vectorControlHtml };

export const VectorControl = View(
	vectorControlHtml,
	(root) => {
		const control = root.querySelector('.vector-control') as HTMLElement;

		// Свойство vector - двумерный массив с нормализованными координатами
		const vector: [number, number] = [0, 0];

		// Радиус полного круга (ширина элемента / 2)
		const getRadius = () => control.clientWidth / 2;

		// Центр круга (как если бы это был полный круг)
		const getCenterX = () => control.clientWidth / 2;
		const getCenterY = () => control.clientHeight; // Центр на нижней границе элемента

		function calculateVector(clientX: number, clientY: number) {
			const rect = control.getBoundingClientRect();

			// Координаты клика относительно элемента
			const x = clientX - rect.left;
			const y = clientY - rect.top;

			// Координаты относительно центра круга
			const centerX = getCenterX();
			const centerY = getCenterY();
			const dx = x - centerX;
			const dy = y - centerY;

			// Длина вектора
			const length = Math.sqrt(dx * dx + dy * dy);
			const radius = getRadius();

			// Нормализация: если длина больше радиуса, обрезаем до радиуса
			const normalizedLength = Math.min(length, radius);

			// Вычисляем нормализованный вектор (длина от 0 до 1)
			if (length > 0) {
				vector[0] = (dx / length) * (normalizedLength / radius);
				vector[1] = (dy / length) * (normalizedLength / radius);
			} else {
				vector[0] = 0;
				vector[1] = 0;
			}
		}

		function handlePointerDown(event: PointerEvent) {
			event.preventDefault();
			calculateVector(event.clientX, event.clientY);

			// Захватываем pointer для отслеживания движения за пределами элемента
			control.setPointerCapture(event.pointerId);
		}

		function handlePointerMove(event: PointerEvent) {
			if (control.hasPointerCapture(event.pointerId)) {
				event.preventDefault();
				calculateVector(event.clientX, event.clientY);
			}
		}

		function handlePointerUp(event: PointerEvent) {
			event.preventDefault();
			control.releasePointerCapture(event.pointerId);
			// Сброс вектора при отпускании
			vector[0] = 0;
			vector[1] = 0;
		}

		// Добавляем слушатели событий
		control.addEventListener('pointerdown', handlePointerDown);
		control.addEventListener('pointermove', handlePointerMove);
		control.addEventListener('pointerup', handlePointerUp);
		control.addEventListener('pointercancel', handlePointerUp);

		// Сохраняем ссылки на обработчики для удаления в unmount
		(control as any)._handlers = {
			handlePointerDown,
			handlePointerMove,
			handlePointerUp,
		};

		return {
			control,
			vector,
		};
	},
	(root) => {
		// Удаление слушателей при unmount
		const control = root.querySelector('.vector-control') as HTMLElement;
		if (control && (control as any)._handlers) {
			const handlers = (control as any)._handlers;
			control.removeEventListener('pointerdown', handlers.handlePointerDown);
			control.removeEventListener('pointermove', handlers.handlePointerMove);
			control.removeEventListener('pointerup', handlers.handlePointerUp);
			control.removeEventListener('pointercancel', handlers.handlePointerUp);
			delete (control as any)._handlers;
		}
	}
);
