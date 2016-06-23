import { combineReducers } from 'redux';
import updateModelReducer from './updateModelReducer';
import updateDirReducer from './updateDirReducer';
import updateDirDataReducer from './updateDirDataReducer';
import chooseLanguage from './chooseLanguage';

const stateReducers = combineReducers({
    updateModelReducer: updateModelReducer,
    updateDirReducer: updateDirReducer,
    updateDirDataReducer: updateDirDataReducer,
    chooseLanguageReducer: chooseLanguageReducer,
});

export default stateReducers;
