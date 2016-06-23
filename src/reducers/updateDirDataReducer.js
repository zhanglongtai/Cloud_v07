import { initialState } from './initialState';

function updateDirDataReducer(initialState.updateDirData, action) {
    switch(action.type) {
		case 'updateDirData':
		    return {updateDirData: action.dirData};
		default:
		    return state;
	};
};

export default updateDirDataReducer;
