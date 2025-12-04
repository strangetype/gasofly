import { View } from '@/common/View';
import tapControlHtml from './tap-control.html?raw';
import './tap-control.scss';

export const TapControl = View(
	tapControlHtml,
	(
		root,
		data: { tapped: boolean[]; triggerKey?: string } = {
			tapped: [false],
			triggerKey: ' ',
		}
	) => {
		const control = root.querySelector('.tap-control') as HTMLElement;

		// Используем переданный массив напрямую
		const { tapped, triggerKey = ' ' } = data;

		function handlePointerDown(event: PointerEvent) {
			event.preventDefault();
			// Устанавливаем первый элемент массива в true
			if (tapped.length > 0) {
				tapped[0] = true;
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			// Проверяем, является ли нажатая клавиша триггерной
			if (event.key === triggerKey) {
				event.preventDefault();
				// Устанавливаем первый элемент массива в true
				if (tapped.length > 0) {
					tapped[0] = true;
				}
			}
		}

		// Добавляем слушатели событий
		control.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleKeyDown);

		// Сохраняем ссылки на обработчики для удаления в unmount
		(control as any)._pointerHandler = handlePointerDown;
		(control as any)._keyHandler = handleKeyDown;

		return {
			control,
			tapped,
		};
	},
	(root) => {
		// Удаление слушателей при unmount
		const control = root.querySelector('.tap-control') as HTMLElement;
		if (control) {
			if ((control as any)._pointerHandler) {
				control.removeEventListener(
					'pointerdown',
					(control as any)._pointerHandler
				);
				delete (control as any)._pointerHandler;
			}
			if ((control as any)._keyHandler) {
				window.removeEventListener('keydown', (control as any)._keyHandler);
				delete (control as any)._keyHandler;
			}
		}
	}
);
