import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }) => {
	const rb = data.ball.RigidBody!;
	const p = rb.position;
	components.view.ball!.setPosition(p.x, p.y, rb.angle);
});
