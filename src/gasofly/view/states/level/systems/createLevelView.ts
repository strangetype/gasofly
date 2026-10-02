import { createViewLevelSystem } from '../levelViewState';

export default createViewLevelSystem(({ components, data }, { Utils }) => {
	const {
		Ui,
		VectorControl,
		TapControl,
		Labyrinth,
		Ball,
		Marker,
		Rope,
		Cubes,
		Screen,
		appElement,
	} = components;

	const { labyrinth, wallSize, cubes, rope, ball, fullCubeSize, cubeSize } = data;
	const ropeSegments = rope.segments;
	const ballRadius = ball.radius;

	const getBodyDimensions = Utils.getBodyDimensions;

	const screen = Screen.mount(appElement!);
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

	const vBall = Ball.append(labyrinthView.container, {
		radius: ballRadius,
	});

	const marker = Marker.append(labyrinthView.container, {
		size: 16,
		schemeSize: fullCubeSize * cubeSize,
	});

	components.view = {
		screen,
		ui,
		vectorControl,
		labyrinth: labyrinthView,
		ball: vBall,
		cubes: cubesView,
		rope: ropeView,
		tapControl: catchControl,
		marker,
	};
});
