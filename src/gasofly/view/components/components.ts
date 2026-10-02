import { Ball } from './ball/ball';
import { Cubes } from './cubes/cubes';
import { Labyrinth } from './labyrinth/labyrinth';
import { Marker } from './marker/marker';
import { Rope } from './rope/rope';
import { Screen } from './screen/screen';
import { TapControl } from './tap-control/tap-control';
import { Ui } from './ui/ui';
import { VectorControl } from './vector-control/vector-control';

const components = {
	Ball,
	Cubes,
	Labyrinth,
	Marker,
	Rope,
	Screen,
	TapControl,
	Ui,
	VectorControl,
	appElement: document.querySelector<HTMLDivElement>('#app'),
};

type View = {
	ball: ReturnType<(typeof Ball)['append']>;
	cubes: ReturnType<(typeof Cubes)['append']>;
	labyrinth: ReturnType<(typeof Labyrinth)['append']>;
	marker: ReturnType<(typeof Marker)['append']>;
	rope: ReturnType<(typeof Rope)['append']>;
	screen: ReturnType<(typeof Screen)['append']>;
	tapControl: ReturnType<(typeof TapControl)['append']>;
	ui: ReturnType<(typeof Ui)['append']>;
	vectorControl: ReturnType<(typeof VectorControl)['append']>;
};

type Components = typeof components & { view: Partial<View> };

export default {
	Ball,
	Cubes,
	Labyrinth,
	Marker,
	Rope,
	Screen,
	TapControl,
	Ui,
	VectorControl,
	appElement: document.querySelector<HTMLDivElement>('#app'),
	view: {},
} as Components;
