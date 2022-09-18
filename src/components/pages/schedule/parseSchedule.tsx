import {recursionObject} from "../../../utils/ntc";
import _ from "lodash";

function parseSchedule(_originalForm: any[], item) {
    for (let i = 0; i < _originalForm.length; i++) {
        for (const [key, value] of Object.entries(item)) {
            if (_originalForm[i].stateName == key) {
                if (_.isObject(value)) {
                    recursionObject(value, (val, key) => {
                        if (key == _originalForm[i].subStateName) {
                            _originalForm[i].value = val
                        }
                    })
                } else {
                    _originalForm[i].value = value
                }

            }
        }
    }
}

export default parseSchedule
