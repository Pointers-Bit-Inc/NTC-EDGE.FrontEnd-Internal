const {
  SET_VISIBLE,
  SET_CALENDAR_VISIBLE,
  SET_DATE_END,
  SET_DATE_START,
  SET_PREV_DATE_END,
  SET_PREV_DATE_START,
  SET_SERVICES,
  SET_GETREPORT,
  SET_SERVICESHIGHLIGHT,
  SET_FEESHIGHLIGHT
} = require('./types').default;
export function setVisible(payload) {

  return {
    type: SET_VISIBLE,
    payload,
  };
}

export function setGetReport(payload) {

  return {
    type: SET_GETREPORT,
    payload,
  };
}
export function setServices(payload) {

  return {
    type: SET_SERVICES,
    payload,
  };
}

export function setCalendarVisible(payload) {
  return {
    type: SET_CALENDAR_VISIBLE,
    payload,
  };
}
export function setDateStart(payload) {
  return {
    type: SET_DATE_START,
    payload,
  };
}

export function setDateEnd(payload) {
  return {
    type: SET_DATE_END,
    payload,
  };
}
export function setFeesHighlight(payload) {
  return {
    type: SET_FEESHIGHLIGHT,
    payload,
  };
}
export function setServicesHighlight(payload) {
  return {
    type: SET_SERVICESHIGHLIGHT,
    payload,
  };
}
export function setPrevDateStart(payload) {
  return {
    type: SET_PREV_DATE_START,
    payload,
  };
}

export function setPrevDateEnd(payload) {
  return {
    type: SET_PREV_DATE_END,
    payload,
  };
}
