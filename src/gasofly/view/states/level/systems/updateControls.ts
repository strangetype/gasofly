import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }) => {
	const catchControl = components.view.tapControl!;
	const controls = data.controls;
	if (catchControl.tapped[0] && !controls.catch) {
		data.controls.catch = true;
		catchControl.tapped[0] = false;
	}
});
