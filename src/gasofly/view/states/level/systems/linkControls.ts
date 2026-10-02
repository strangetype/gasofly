import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }) => {
	const vectorControl = components.view.vectorControl!;
	data.controls.vector = vectorControl.vector;
});
