import { createLevelSystem } from '../../levelState';

export default createLevelSystem((data, { Matter }) => {
	// Находим constraint между кубом и сегментом веревки

	const { engine, rope, controls } = data;
	const lastSegment = rope.segments[rope.segments.length - 1];
	const tap = controls.catch;
	const cube = data.catchedCube;

	console.log('cube: ', !!cube, 'tap: ', tap);

	if (!cube) {
		if (!rope.isExtending && controls.catch) {
			controls.catch = false;
		}
		return;
	}
	if (!tap) return;

	console.log('RELEASE');

	const constraints = Matter.Composite.allConstraints(engine!.world);
	const connectionConstraint = constraints.find(
		(constraint) =>
			(constraint.bodyA === lastSegment && constraint.bodyB === cube) ||
			(constraint.bodyA === cube && constraint.bodyB === lastSegment)
	);

	// Если связь не найдена, возвращаем false
	if (!connectionConstraint) {
		return;
	}

	// Удаляем constraint из физического мира
	Matter.Composite.remove(engine!.world, connectionConstraint);

	// Восстанавливаем маску коллизий куба
	// Добавляем обратно категорию веревки в маску
	const ropeCategory = 0x0008; // Категория сегментов веревки из createBallRope
	const currentMask = cube.collisionFilter.mask ?? 0xffffffff; // Дефолтная маска
	cube.collisionFilter.mask = currentMask | ropeCategory;

	//отпускаем куб
	data.catchedCube = false;
	controls.catch = false;
});
