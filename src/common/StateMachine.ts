export default function StateMachine<States extends { [stateName: string]: string }>() {
	type State = keyof States;

	const links: Map<State, Map<States[State], State>> = new Map();
	const stateFns: Map<State, () => Promise<States[State]>> = new Map();

	function run(state: State) {
		const stateFn = stateFns.get(state);
		if (!stateFn) return;
		stateFn().then((exitCode) => {
			const link = links.get(state);
			if (link) {
				const nextState = link.get(exitCode);
				if (nextState) run(nextState);
			}
		});
	}

	function linkState<SourceState extends keyof States, DestState extends keyof States>(
		sourceState: SourceState,
		exitCode: States[SourceState],
		destState: DestState
	) {
		let stateLinks = links.get(sourceState);
		if (!stateLinks) {
			links.set(sourceState, new Map());
			stateLinks = links.get(sourceState);
		}

		stateLinks!.set(exitCode, destState);
	}

	function setState<StateToSet extends State>(
		stateToSet: StateToSet,
		stateFn: () => Promise<States[StateToSet]>
	) {
		stateFns.set(stateToSet, stateFn);

		function _run() {
			console.log('run: ', stateToSet);
			run(stateToSet);
		}

		return _run;
	}

	return {
		linkState,
		setState,
	};
}
