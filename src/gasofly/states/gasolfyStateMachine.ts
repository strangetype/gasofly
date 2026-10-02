import { createStateMachine } from '../gasoflyDC';

const { createState, linkState } = createStateMachine<{ start: 'ready'; level: 'win' | 'lose' }>();

linkState('start', 'ready', 'level');
linkState('level', 'win', 'start');

export { createState };
