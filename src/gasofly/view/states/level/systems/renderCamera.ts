import { createViewLevelSystem } from '../levelViewState';

let currentZoom = 1;

export default createViewLevelSystem(({ components, data }) => {
	const camera = components.view.screen!;

	const rb = data.ball.RigidBody!;
	const p = rb.position;
	const speed = rb.speed;

	camera.setCameraPoint(p.x, p.y);
	const newCameraZoom = 1 - speed / (5 + speed);
	currentZoom += 0.001 * (newCameraZoom - currentZoom);
	camera.setCameraZoom(currentZoom);
	camera.updateCameraFrame();
});
