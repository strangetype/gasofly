import DC from '@/common/DC';
import { levelModelData } from '../data/levelModelData';
import { State } from '@/common/State';
import StateMachine from '@/common/StateMachine';
import SystemsEngine from '@/common/SystemsEngine';
import Timer from '../services/timer/Timer';
import { constants } from '../constants/constants';

const gasolfyViewDC = DC({
	constants,
	data: {
		common: {},
		levelModelData,
	},
	State,
	StateMachine,
	SystemsEngine,
	Timer,
});

export const createStateMachine = gasolfyViewDC.create((entities) => {
	type Entities = typeof entities;
	const { SystemsEngine, data, State, StateMachine } = entities;

	type DataKeys = keyof typeof data;

	function createEngine(dataType: DataKeys) {
		return SystemsEngine(data[dataType], {
			constants,
		});
	}

	function _createStateMachine<States extends { [stateName: string]: string }>() {
		const { linkState, setState } = StateMachine<States>();
		type State = keyof States;
		function createState<StateName extends State>(
			stateName: StateName,
			dataType: DataKeys,
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
								console.log(exitCode);
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
