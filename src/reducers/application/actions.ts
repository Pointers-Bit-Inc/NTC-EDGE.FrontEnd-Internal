const {
    SET_PINNED_APPLICATION,
    SET_NOT_PINNED_APPLICATION,
    UPDATE_APPLICATION_STATUS,
    SET_APPLICATIONS,
    DELETE_APPLICATIONS,
    HANDLE_LOAD,
    READ_UNREAD_APPLICATIONS,
    SET_TAB_BAR_HEIGHT
} = require('./types').default;

export function setPinnedApplication(payload) {
    return {
        type: SET_PINNED_APPLICATION,
        payload,
    };
}

export function updateApplicationStatus(payload) {
    return {
        type: UPDATE_APPLICATION_STATUS,
        payload,
    };
}

export function setNotPinnedApplication(payload) {
    return {
        type: SET_NOT_PINNED_APPLICATION,
        payload,
    };
}
export function setTabBarHeight(payload) {
    return {
        type: SET_TAB_BAR_HEIGHT,
        payload,
    };
}
export function setApplications(payload) {
    return {
        type: SET_APPLICATIONS,
        payload,
    };
}

export function deleteApplications(payload) {
    return {
        type: DELETE_APPLICATIONS,
        payload,
    };
}
export function readUnreadApplications(payload) {
    return {
        type: READ_UNREAD_APPLICATIONS,
        payload,
    };
}

export function handleInfiniteLoad(payload) {
    return {
        type: HANDLE_LOAD,
        payload,
    };
}