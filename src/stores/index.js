import { createStore } from 'redux';
import stateReducers from './reducers';

let store = createStore(stateReducers);

export default store;
 