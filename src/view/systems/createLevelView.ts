import { Ui } from '../components/ui/ui';
import { VectorControl } from '../components/vector-control/vector-control';
import { Ball } from '../components/ball/ball';
import { Labyrinth } from '../components/labyrinth/labyrinth';
import { Screen } from '../components/screen/screen';
import { LABIRYNTH_CELL_TYPE } from '@/common/types';
import { getBodyDimensions } from '@/common/utils';
import { Cubes } from '../components/cubes/cubes';
import { Rope } from '../components/rope/rope';
import { TapControl } from '../components/tap-control/tap-control';

export function createLevelView(
	appElement: HTMLElement,
	labyrinth: LABIRYNTH_CELL_TYPE[][],
	wallSize: number,
	ballRadius: number,
	cubes: Matter.Body[],
	ropeSegments: Matter.Body[]
) {
	const screen = Screen.mount(appElement);
	const ui = Ui.mount(screen.ui!);
	const vectorControl = VectorControl.append(ui.vectorControl);
	const catchControl = TapControl.append(ui.catchControl);
	const labyrinthView = Labyrinth.mount(screen.camera!, {
		labyrinth: labyrinth.map((row) => row.map((cell) => (cell === 'w' ? 1 : 0))),
		wallSize: wallSize,
		style: 'wood',
	});

	const cubesView = Cubes.append(labyrinthView.container, {
		cubes: cubes.map((c) => {
			const dims = getBodyDimensions(c);
			return {
				x: c.position.x,
				y: c.position.y,
				width: dims.width,
				height: dims.height,
				rotation: 0,
			};
		}),
	});

	const ropeView = Rope.append(labyrinthView.container, {
		segments: ropeSegments.map((segment) => ({
			x: segment.position.x,
			y: segment.position.y,
			radius: segment.circleRadius!,
		})),
	});

	const ball = Ball.append(labyrinthView.container, {
		radius: ballRadius,
	});

	return {
		screen,
		ui,
		vectorControl,
		labyrinthView,
		ball,
		cubesView,
		ropeView,
		catchControl,
	};
}
