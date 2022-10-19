const {
    SET_PINNED_APPLICATION,
    SET_NOT_PINNED_APPLICATION,
    UPDATE_APPLICATION_STATUS,
    SET_APPLICATIONS,
    DELETE_APPLICATIONS,
    HANDLE_LOAD,
    READ_UNREAD_APPLICATIONS,
    SET_TAB_BAR_HEIGHT,
    SET_APPLICATION_ITEM,
    SET_FILTER_RECT,
    SET_RIGHT_LAYOUT_COMPONENT,
    SET_TOPBARNAV,
    SET_ACTIVITY_SIZE,
    SET_SELECTED_YPOS,
    UPDATE_APPLICATIONS,
    SET_HAS_CHANGE,
    SET_EDIT,
    SET_USER_PROFILE_FORM,
    SET_USER_ORIGINAL_PROFILE_FORM,
    UPDATE_CHANGE_EVENT,
    SET_DATA,
    SET_CALENDAR_VISIBLE,
    SET_DATE_END,
    SET_DATE_START,
    SET_PREV_DATE_START,
    SET_PREV_DATE_END,
    SET_DATA_ID,
    SET_DELETE_DATA,
    SET_SCENE_INDEX,
    SET_PROVINCES,
    FETCH_CITIES,
    FETCHING_CITIES,
    SET_CITIES,
    FETCH_PROVINCES,
    FETCHING_PROVINCES,
    FETCH_SCHEDULES,
    FETCHING_SCHEDULES,
    SET_SCHEDULES,
    FETCH_REGIONS,
    FETCHING_REGIONS,
    SET_REGIONS,
    UPLOADING_REQUIREMENT,
    UPLOAD_REQUIREMENT,
} = require('./types').default;
export function fetchSchedules(payload: any) {
    return {
        type: FETCH_SCHEDULES,
        payload,
    }
};
export function setUploadingRequirement(payload: any) {
    return {
        type: UPLOADING_REQUIREMENT,
        payload,
    }
};

export function uploadRequirement(payload: any) {
    return {
        type: UPLOAD_REQUIREMENT,
        payload,
    }
};

export function setFetchingSchedules(payload: boolean) {
    return {
        type: FETCHING_SCHEDULES,
        payload,
    }
};

export function setSchedules(payload: any) {
    return {
        type: SET_SCHEDULES,
        payload,
    }
};
export function setPinnedApplication(payload) {
    return {
        type: SET_PINNED_APPLICATION,
        payload,
    };
}
export function updateChangeEvent(payload) {
    return {
        type: UPDATE_CHANGE_EVENT,
        payload,
    };
}
export function setHasChange(payload) {
    return {
        type: SET_HAS_CHANGE,
        payload,
    };
}
export function setEdit(payload) {
    return {
        type: SET_EDIT,
        payload,
    };
}
export function setData(payload) {
    return {
        type: SET_DATA,
        payload,
    };
}
export function setDataId(payload) {
    return {
        type: SET_DATA_ID,
        payload,
    };
}
export function setSceneIndex(payload) {
    return {
        type: SET_SCENE_INDEX,
        payload,
    };
}
export function fetchProvinces(payload: any) {
    return {
        type: FETCH_PROVINCES,
        payload,
    }
};

export function setFetchingProvinces(payload: boolean) {
    return {
        type: FETCHING_PROVINCES,
        payload,
    }
};
export function fetchRegions() {
    return {
        type: FETCH_REGIONS,
    }
};

export function setFetchingRegions(payload: boolean) {
    return {
        type: FETCHING_REGIONS,
        payload,
    }
};

export function setRegions(payload: any) {
    return {
        type: SET_REGIONS,
        payload,
    }
};

export function setProvinces(payload: any) {
    return {
        type: SET_PROVINCES,
        payload,
    }
};

export function fetchCities(payload: any) {
    return {
        type: FETCH_CITIES,
        payload,
    }
};

export function setFetchingCities(payload: boolean) {
    return {
        type: FETCHING_CITIES,
        payload,
    }
};

export function setCities(payload: any) {
    return {
        type: SET_CITIES,
        payload,
    }
};


export function setDeleteData(payload) {
    return {
        type: SET_DELETE_DATA,
        payload,
    };
}
export function updateApplicationStatus(payload) {
    return {
        type: UPDATE_APPLICATION_STATUS,
        payload,
    };
}

export function setTopBarNav(payload) {
    return {
        type: SET_TOPBARNAV,
        payload,
    };
}

export function setactivitySizeComponent(payload) {
    return {
        type: SET_ACTIVITY_SIZE,
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
export function updateApplications(payload) {
    return {
        type: UPDATE_APPLICATIONS,
        payload,
    };
}

export function setFilterRect(payload) {
    return {
        type: SET_FILTER_RECT,
        payload,
    };
}

export function setRightLayoutComponent(payload) {
    return {
        type: SET_RIGHT_LAYOUT_COMPONENT,
        payload,
    };
}

export function setApplicationItem(payload) {
    return {
        type: SET_APPLICATION_ITEM,
        payload,
    };
}
export function setUserProfileForm(payload) {
    return {
        type: SET_USER_PROFILE_FORM,
        payload,
    };
}
export function setUserOriginalProfileForm(payload) {
    return {
        type: SET_USER_ORIGINAL_PROFILE_FORM,
        payload,
    };
}
export function setSelectedYPos(payload) {
    return {
        type: SET_SELECTED_YPOS,
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
