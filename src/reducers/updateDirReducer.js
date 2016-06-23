import { initialState } from './initialState';

function updateDirReducer(state=initialState.updateDir, action) {
	switch(action.type) {
		case 'updateDir':
		    return {updateDir: action.dirContent};
		default:
		    return state;
	};
};

export default updateDirReducer;
