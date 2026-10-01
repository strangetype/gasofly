import { levelModelData } from '@/gasofly/data/levelModelData';
import { State } from '@/common/State';
import { createMatterWorld } from '@/model/systems/createMatterWorld';
import { runWorld } from '@/model/systems/runWorld';
import { createLabyrinth } from '@/model/systems/createLabyrinth';
import { createBall } from '@/model/systems/createBall';
import { createBallRope } from '@/model/systems/createBallRope';
import { updateBallThrust } from '@/model/systems/updateBallThrust';
import { generateLabyrinth } from '@/model/systems/generateLabyrinth';
import { createLevelView } from '@/view/systems/createLevelView';
import Matter from 'matter-js';
import { renderBall } from '@/view/systems/renderBall';
import { renderCamera } from '@/view/systems/renderCamera';
import { renderRope } from '@/view/systems/renderRope';
import { createCubes } from '@/model/systems/createCubes';
import { spreadCubes } from '@/model/systems/spreadCubes';
import { renderCubes } from '@/view/systems/renderCubes';
import { ropeActivity } from '@/model/systems/ropeActivity';
import { checkCatch } from '@/model/systems/checkCatch';
import { releaseCatch } from '@/model/systems/releaseCatch';
import { createSquareFilledChecker } from '@/model/systems/checkSquareFilled';

import runLevel from '@/gasofly/systems/level/runLevel';

export async function LevelState(appElement: HTMLElement) {
	let view: ReturnType<typeof createLevelView> | null = null;

	const checkSquareFilled = createSquareFilledChecker();

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
				runLevel();

				function render() {
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

				view = createLevelView(
					appElement,
					data.labyrinth,
					data.wallSize,
					data.ball.radius,
					data.cubes,
					data.rope.segments
				);

				render();
			});
		},
		exit: (data, exitCode) => {
			return new Promise((resolve) => {
				resolve(exitCode);
			});
		},
	});
}
