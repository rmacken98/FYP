import {} from 'redux';
import spotReducer from './reducers/Reducers';

const rootReducer= combineReducers({
    spotReducer: spotReducer
})

const store = () => createStore(rootReducer)

export default store;
