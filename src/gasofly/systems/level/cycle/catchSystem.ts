import { createLevelSystem } from '../levelSystem';
import { ropeActivity } from './ropeActivity';
import { checkCatch } from './checkCatch';
import { releaseCatch } from './releaseCatch';

export default createLevelSystem((data) => {
	const { engine, cubes, rope, controls } = data;
	const lastSegment = rope.segments[rope.segments.length - 1];
	const tap = controls.catch;

	if (data.catchedCube) {
		// Куб уже пойман — веревка вытянута до упора
		ropeActivity(rope.constraints, 64, true);

		// Если кнопка кэтча нажата — отпускаем куб
		if (tap) {
			releaseCatch(engine!, data.catchedCube, lastSegment);
			data.catchedCube = false;
			controls.catch = false;
		}
	} else {
		// Куб не пойман — пытаемся ловить (веревка удлиняется при нажатии)
		const isCatching = ropeActivity(rope.constraints, 32, tap);

		if (isCatching && !data.catchedCube) {
			const catchedCube = checkCatch(engine!, cubes, lastSegment);

			// Если куб был пойман, constraint уже создан и добавлен в мир
			if (catchedCube) {
				console.log('Cube catched:', catchedCube);
				data.catchedCube = catchedCube;
				controls.catch = false;
			}
		} else if (!isCatching && tap) {
			controls.catch = false;
		}
	}
});
