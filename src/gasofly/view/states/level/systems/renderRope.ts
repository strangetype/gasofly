import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }) => {
	const ropeView = components.view.rope!;
	const segments = data.rope.segments;
	ropeView.updateTransform((i, setPosition) => {
		setPosition(segments[i].position.x, segments[i].position.y);
	});
});
