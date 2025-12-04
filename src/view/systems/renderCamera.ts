import { Screen } from '../components/screen/screen';

let currentZoom = 1;

export function renderCamera(
	camera: ReturnType<typeof Screen.mount>,
	targetX: number,
	targetY: number,
	targetSpeed: number
) {
	camera!.setCameraPoint(targetX, targetY);
	const newCameraZoom = 1 - targetSpeed / (5 + targetSpeed);
	currentZoom += 0.001 * (newCameraZoom - currentZoom);
	camera!.setCameraZoom(currentZoom);
	camera!.updateCameraFrame();
}
