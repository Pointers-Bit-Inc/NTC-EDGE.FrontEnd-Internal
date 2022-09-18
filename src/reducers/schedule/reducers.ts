const {
  SET_SCHEDULES,
  SET_SCHEDULE,
  SET_DELETE_SCHEDULE,
  SET_ADD_SCHEDULE,
  SET_EDIT_SCHEDULE
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SCHEDULES: {
            state = state.set('schedules', action.payload);
            return state
        }
        case SET_SCHEDULE: {
            console.log( action.payload)
            state = state.set('schedule', action.payload);
            return state
        }
        case SET_DELETE_SCHEDULE: {
            let schedules = [...state.schedules]

            let exist = state?.schedules?.findIndex((schedule) => action?.payload == schedule.id)
            if (exist > -1) {
                schedules.splice(exist, 1);
            }
            state = state.set('schedules', schedules);
            return state
        }
        case SET_EDIT_SCHEDULE: {
            let schedules = [...state.schedules]

            let exist = state.schedules.findIndex((schedule) => action.payload.id == schedule.id )
            if (exist > -1) {
                schedules[exist] = action.payload
            }

            state = state.set('schedules', schedules);
            return state
        }
        case SET_ADD_SCHEDULE: {
            let schedules = [...state.schedules]
            schedules.push(action?.payload)
            state = state.set('schedules', schedules);
        }
        default:
            return state;
    }
}
