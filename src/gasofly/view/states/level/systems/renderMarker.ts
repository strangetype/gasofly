import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }) => {
	const marker = components.view.marker!;
	const c = data.cubesTargetScheme.center;
	marker.setPosition(c.x, c.y);
});
