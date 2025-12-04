import { Cubes } from '../components/cubes/cubes';

export function renderCubes(cubes: Matter.Body[], cubesView: ReturnType<typeof Cubes.append>) {
	cubesView.updateTransform((i, setPosition) => {
		setPosition(cubes[i].position.x, cubes[i].position.y, cubes[i].angle);
	});
}
