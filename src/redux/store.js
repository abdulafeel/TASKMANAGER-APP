import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import taskReducer from './reducers/taskReducer'
import themeReducer from './reducers/themeReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks:taskReducer,
  theme: themeReducer,
});

const store = createStore(rootReducer);

export default store;
