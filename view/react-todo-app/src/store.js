import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import todoReducer from './redux/reducer';

const store = createStore(todoReducer, applyMiddleware(thunk));

export default store;
