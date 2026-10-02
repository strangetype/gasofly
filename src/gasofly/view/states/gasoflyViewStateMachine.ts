import { createViewStateMachine } from '../gasoflyViewDC';

const viewStateMachine = createViewStateMachine<{ start: 'ready'; level: 'win' | 'lose' }>();
viewStateMachine.linkState('start', 'ready', 'level');

export const createViewState = viewStateMachine.createState;
