import DC from '@/common/DC';
import { State } from '@/common/State';
import StateMachine from '@/common/StateMachine';
import SystemsEngine from '@/common/SystemsEngine';
import Timer from '../services/timer/Timer';
import { constants } from '../constants/constants';
import components from './components/components';
import modelData from '../data/modelData';
import animationTicker from './services/animationTicker';
import * as Utils from '../services/utils';

const gasolfyViewDC = DC({
	constants,
	data: modelData,
	components,
	State,
	StateMachine,
	SystemsEngine,
	Timer,
	animationTicker,
	Utils,
});

export const createViewStateMachine = gasolfyViewDC.create((entities) => {
	type Entities = typeof entities;
	const { SystemsEngine, data, components, State, StateMachine, Utils } = entities;

	type DataKeys = keyof typeof data;

	function createEngine<Data extends DataKeys>(dataType: Data) {
		return SystemsEngine(
			{ data: data[dataType], components },
			{
				constants,
				Utils,
			}
		);
	}

	function _createStateMachine<States extends { [stateName: string]: string }>() {
		const { linkState, setState } = StateMachine<States>();
		type State = keyof States;
		function createState<StateName extends State, Data extends DataKeys>(
			stateName: StateName,
			dataType: Data,
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
									console.log('clearTicker: ', clearTicker);
									clearTicker();
									console.log('exitCode: ', exitCode);
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
