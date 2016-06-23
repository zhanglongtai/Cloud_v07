import { initialState } from './initialState';

function updateModelReducer(state=initialState.updateModel, action) {
	switch(action.type) {
		case 'updateModel':
		    return {updateModel: action.modelName};
		default:
		    return state;
	};
};

export default updateModelReducer;
