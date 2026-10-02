import DC from '@/common/DC';
import SystemsEngine from '@/common/SystemsEngine';
import { constants } from './constants/constants';
import Matter from 'matter-js';
import * as Utils from './services/utils';
import { State } from '@/common/State';
import Timer from './services/timer/Timer';
import RandomService from './services/random/RandomService';
import StateMachine from '@/common/StateMachine';
import modelData from './data/modelData';

const gasoflyDC = DC({
	StateMachine,
	State,
	SystemsEngine,
	Matter,
	Utils,
	Timer,
	RandomService,
	Math,
	data: modelData,
	constants,
});

export const createStateMachine = gasoflyDC.create((entities) => {
	type Entities = typeof entities;
	const { SystemsEngine, data, Matter, Utils, State, StateMachine, RandomService, Math } =
		entities;

	type DataKeys = keyof typeof data;

	function createEngine<Data extends DataKeys>(dataType: Data) {
		return SystemsEngine(data[dataType], {
			Matter,
			Utils,
			constants,
			RandomService,
			Math,
		});
	}

	function _createStateMachine<States extends { [stateName: string]: string }>() {
		const { linkState, setState } = StateMachine<States>();
		type State = keyof States;
		function createState<StateName extends State, DataType extends DataKeys>(
			stateName: StateName,
			dataType: DataType,
			createTicker: (ent: Entities) => (callback: () => void) => () => void,
			exitCondition: (ent: Entities) => States[StateName] | null
		) {
			type ExitCode = States[StateName];
			const sEngine = createEngine(dataType);
			const _data = data[dataType];
			const ticker = createTicker(entities);
			const stateFn = () => {
				return State<typeof _data, ExitCode>({
					data: _data,
					enter: () => {
						return new Promise((resolve) => {
							sEngine.start();
							resolve();
						});
					},
					live: () => {
						return new Promise((resolve) => {
							const clearTicker = ticker(() => {
								sEngine.update();
								const exitCode = exitCondition(entities);
								if (exitCode !== null) {
									clearTicker();
									resolve(exitCode);
								}
							});
						});
					},
					exit: (data, exitCode) => {
						return new Promise((resolve) => {
							sEngine.end();
							resolve(exitCode);
						});
					},
				});
			};
			const runState = setState(stateName, stateFn);
			const addSystem = sEngine.addSystem;
			const createSystem = sEngine.createSystem;

			return {
				createSystem,
				addSystem,
				runState,
			};
		}

		return {
			createState,
			linkState,
		};
	}

	return _createStateMachine;
});
