import DC from '@/common/DC';
import SystemsEngine from '@/common/SystemsEngine';
import { constants } from './constants/constants';
import { levelModelData } from './data/levelModelData';
import Matter from 'matter-js';
import * as Utils from './services/utils';
import { State } from '@/common/State';
import Timer from './services/timer/Timer';

const gasoflyDC = DC({
	State,
	SystemsEngine,
	Matter,
	Utils,
	Timer,
	data: {
		level: levelModelData,
	},
	constants,
});

export const createState = gasoflyDC.create((entities) => {
	type Entities = typeof entities;

	const { SystemsEngine, data, Matter, Utils, State } = entities;

	type DataKeys = keyof typeof data;

	function _createEngine(dataType: DataKeys) {
		return SystemsEngine(data[dataType], {
			Matter,
			Utils,
			constants,
		});
	}

	function _createState<ExitCode extends string>(
		dataType: DataKeys,
		createTicker: (ent: Entities) => (callback: () => void) => void,
		exitCondition: (ent: Entities) => ExitCode | null
	) {
		const engine = _createEngine(dataType);
		const _data = data[dataType];

		const ticker = createTicker(entities);

		const run = () => {
			State<typeof _data, ExitCode>({
				data: _data,
				enter: () => {
					return new Promise((resolve) => {
						engine.start();
						resolve();
					});
				},
				live: () => {
					return new Promise((resolve) => {
						ticker(() => {
							engine.update();
							const exitCode = exitCondition(entities);
							if (exitCode !== null) resolve(exitCode);
						});
					});
				},
				exit: () => {
					return new Promise((resolve) => {
						engine.end();
					});
				},
			});
		};

		return {
			run,
			createSystem: engine.createSystem,
			addSystem: engine.addSystem,
		};
	}

	return _createState;
});
