const {
  SET_VISIBLE,
  SET_SERVICES,
  SET_CALENDAR_VISIBLE,
  SET_DATE_END,
  SET_DATE_START,
  SET_PREV_DATE_END,
  SET_PREV_DATE_START,
  SET_GETREPORT,
  SET_SERVICESHIGHLIGHT,
  SET_FEESSHIGHLIGHT
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CALENDAR_VISIBLE: {
      state = state.set('calendarVisible', action.payload);
      return state
    }
    case SET_SERVICES: {
      state = state.set('services', action.payload);
      return state
    }
    case SET_SERVICESHIGHLIGHT: {
      state = state.set('servicesHighlight', action.payload);
      return state
    }

    case SET_FEESSHIGHLIGHT: {
      state = state.set('feesHighlight', action.payload);
      return state
    }
    case SET_GETREPORT: {
      state = state.set('getReport', action.payload);
      return state
    }
    case SET_DATE_END: {
      state = state.set('dateEnd', action.payload);
      return state
    }
    case SET_DATE_START: {
      state = state.set('dateStart', action.payload);
      return state
    }

    case SET_PREV_DATE_END: {
      state = state.set('prevDateEnd', action.payload);
      return state
    }
    case SET_PREV_DATE_START: {
      state = state.set('prevDateStart', action.payload);
      return state
    }
    case SET_VISIBLE:{
      return state.set('visible', action.payload)
    }
    default:
      return state;
  }
}
