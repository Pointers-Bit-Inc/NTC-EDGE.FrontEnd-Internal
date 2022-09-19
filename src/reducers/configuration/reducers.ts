const {
  SET_CONFIGURATIONS,
  SET_CONFIGURATION,
  SET_DELETE_CONFIGURATION,
  SET_ADD_CONFIGURATION,
  SET_EDIT_CONFIGURATION,
    SET_REGIONS,
    SET_REGION
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CONFIGURATIONS: {
            state = state.set('configurations', action.payload);
            return state
        }
        case SET_CONFIGURATION: {
            state = state.set('configuration', action.payload);
            return state
        }
        case SET_REGIONS: {
            state = state.set('regions', action.payload);
            return state
        }
        case SET_REGION: {
            state = state.set('region', action.payload);
            return state
        }
        case SET_DELETE_CONFIGURATION: {
            let configurations = [...state.configurations]

            let exist = state?.configurations?.findIndex((configuration) => action?.payload == configuration.id)
            if (exist > -1) {
                configurations.splice(exist, 1);
            }
            state = state.set('configurations', configurations);
            return state
        }
        case SET_EDIT_CONFIGURATION: {
            let configurations = [...state.configurations]

            let exist = state.configurations.findIndex((configuration) => action.payload.id == configuration.id )
            if (exist > -1) {
                configurations[exist].permission = action.payload.permission
            }

            state = state.set('configurations', configurations);
            return state
        }
        case SET_ADD_CONFIGURATION: {
            let configurations = [...state.configurations]
            configurations.push(action?.payload)
            state = state.set('configurations', configurations);
        }
        default:
            return state;
    }
}
