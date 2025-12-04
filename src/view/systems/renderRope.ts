import { Rope } from '../components/rope/rope';

export function renderRope(segments: Matter.Body[], ropeView: ReturnType<typeof Rope.append>) {
	ropeView.updateTransform((i, setPosition) => {
		setPosition(segments[i].position.x, segments[i].position.y);
	});
}
