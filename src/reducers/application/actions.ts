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
    FETCHING_SOA,
    SET_SOA,
    FETCH_SOA_SUCCESS,
    FETCH_SOA_ERROR,
    FETCH_SOA,
    SAVE_APPLICATION,
    SAVE_APPLICATION_ERROR,
    SAVE_APPLICATION_SUCCESS,
    SAVING_APPLICATION,
    ADD_APPLICATION,
    SET_REVIEWED,
    SET_COMPLETED,
    SET_REALTIME_COUNT,
    RESET_REALTIME_COUNT,
    SET_DELETE_PINNED_APPLICATION,
    SET_DECREMENT_REALTIME_COUNT,
    SET_MODAL_VISIBLE
} = require('./types').default;
export function setSOA(payload: any) {
    return {
        type: SET_SOA,
        payload,
    }
};
export function fetchSOA(payload: any) {
    return {
        type: FETCH_SOA,
        payload,
    }
};
export function setReviewed(payload: any) {
    return {
        type: SET_REVIEWED,
        payload,
    }
};
export function setCompleted(payload: any) {
    return {
        type: SET_COMPLETED,
        payload,
    }
};

export function setFetchSOASuccess(payload: any) {
    return {
        type: FETCH_SOA_SUCCESS,
        payload,
    }
};

export function setFetchSOAError(payload: any) {
    return {
        type: FETCH_SOA_ERROR,
        payload,
    }
};


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
};export function setRealtimeCounts(payload: any) {
    return {
        type: SET_REALTIME_COUNT,
        payload,
    }
};export function resetRealtimeCounts() {
    return {
        type: RESET_REALTIME_COUNT
    }
};

export function setDeletePinnedApplication(payload: any) {
    return {
        type: SET_DELETE_PINNED_APPLICATION,
        payload
    }
};
export function setModalVisible(payload: any, id?:any) {
    return {
        type: SET_MODAL_VISIBLE,
        payload,
        id
    }
};
export function setDecrementRealtimeCount(payload: any) {
    return {
        type: SET_DECREMENT_REALTIME_COUNT,
        payload
    }
};
export function addApplication(payload: any) {
    return {
        type: ADD_APPLICATION,
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

export function setFetchingSOA(payload: any) {
    return {
        type: FETCHING_SOA,
        payload,
    }
};
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
export function saveApplication(payload: any) {
    return {
        type: SAVE_APPLICATION,
        payload,
    }
};

export function setSaveApplicationError(payload: any) {
    return {
        type: SAVE_APPLICATION_ERROR,
        payload,
    }
};

export function setSaveApplicationSuccess(payload: any) {
    return {
        type: SAVE_APPLICATION_SUCCESS,
        payload,
    }
};

export function setSavingApplication(payload: boolean) {
    return {
        type: SAVING_APPLICATION,
        payload,
    }
};

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

export function setApplicationItem(payload, id?:any) {
    return {
        type: SET_APPLICATION_ITEM,
        payload,
        id
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
