import { initialState } from './initialState';

function chooseLanguageReducer(initialState.chooseLanguage, action) {
    switch(action.type) {
		case 'chooseLanguage':
		    return {chooseLanguage: action.dirData};
		default:
		    return state;
	};
};

export default chooseLanguageReducer;
