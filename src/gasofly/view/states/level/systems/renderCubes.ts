import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }) => {
	const cubesView = components.view.cubes!;
	const cubes = data.cubes!;
	cubesView.updateTransform((i, setPosition) => {
		setPosition(cubes[i].position.x, cubes[i].position.y, cubes[i].angle);
	});
});
