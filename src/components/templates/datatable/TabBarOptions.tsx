import {useMemo} from "react";
import {Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";

const  tabBarOption = () => {
    return useMemo(() => {
        return {
            tabBarLabelStyle: {

                fontFamily: Regular,
                fontSize: fontValue(12),
            },
            "tabBarActiveTintColor": "#2F5BFA",
            "tabBarInactiveTintColor": "#606A80",
            "tabBarIndicatorStyle": {
                "height": 3,
                "backgroundColor": "#2F5BFA"
            }
        }
    }, []);
}

export default tabBarOption