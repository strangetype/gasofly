import { levelModelData } from '@/gasofly/data/levelModelData';
import { State } from '@/common/State';
import { createLevelView } from '@/view/systems/createLevelView';
import { renderBall } from '@/view/systems/renderBall';
import { renderCamera } from '@/view/systems/renderCamera';
import { renderRope } from '@/view/systems/renderRope';
import { renderCubes } from '@/view/systems/renderCubes';

import runStartState from '@/gasofly/states/start/startState';

export async function LevelState(appElement: HTMLElement) {
	let view: ReturnType<typeof createLevelView> | null = null;

	//const checkSquareFilled = createSquareFilledChecker();

	return State<typeof levelModelData, 'win' | 'lose' | 'exit'>({
		data: levelModelData,
		enter: (data) => {
			console.log(data);
			return new Promise((resolve) => {
				resolve();
			});
		},
		live: (data) => {
			return new Promise((resolve) => {
				runStartState();

				function render() {
					if (view!.catchControl.tapped[0] && !data.controls.catch) {
						data.controls.catch = true;
						view!.catchControl.tapped[0] = false;
					} else if (view!.catchControl.tapped[0] && data.controls.catch) {
						//data.controls.catch = false;
						//view!.catchControl.tapped[0] = false;
					}
					renderBall(
						view!.ball,
						data.ball.RigidBody!.position.x,
						data.ball.RigidBody!.position.y,
						data.ball.RigidBody!.angle
					);
					renderCamera(
						view!.screen,
						data.ball.RigidBody!.position.x,
						data.ball.RigidBody!.position.y,
						data.ball.RigidBody!.speed
					);
					renderCubes(data.cubes, view!.cubesView);
					renderRope(data.rope.segments, view!.ropeView);

					requestAnimationFrame(render);
				}

				setTimeout(() => {
					view = createLevelView(
						appElement,
						data.labyrinth,
						data.wallSize,
						data.ball.radius,
						data.cubes,
						data.rope.segments
					);
					data.controls.vector = view.vectorControl.vector;

					render();
				}, 5e3);
			});
		},
		exit: (data, exitCode) => {
			return new Promise((resolve) => {
				resolve(exitCode);
			});
		},
	});
}
