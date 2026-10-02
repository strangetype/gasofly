import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components }) => {
	// Размонтирование всех смонтированных компонентов:
	// удаляет их DOM и снимает подписки (события, ResizeObserver и т.п.)
	for (const component of Object.values(components.view)) {
		component?.unmount();
	}

	// Очистка HTML уровня
	if (components.appElement) {
		components.appElement.innerHTML = '';
	}

	// Сброс ссылок на инстансы
	components.view = {};
});
