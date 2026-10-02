import { createViewStateMachine } from '../gasoflyViewDC';

const viewStateMachine = createViewStateMachine<{ start: 'ready'; level: 'win' | 'lose' }>();
viewStateMachine.linkState('start', 'ready', 'level');
viewStateMachine.linkState('level', 'win', 'start');

export const createViewState = viewStateMachine.createState;
