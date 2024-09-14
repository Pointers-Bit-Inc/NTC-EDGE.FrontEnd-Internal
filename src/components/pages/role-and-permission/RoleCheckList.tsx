import {View} from "react-native";
import {
    activity,
    chat,
    configurationCreate,
    configurationDelete,
    configurationEdit,
    configurationView,
    employeeCreate,
    employeeDelete,
    employeeEdit,
    employeeView,
    meet,
    qrCodePermission,
    reportCashierPermission,
    reportEvaluatorPermission,
    resetPasswordPermission,
    rolePermissionCreate,
    rolePermissionDelete,
    rolePermissionEdit,
    rolePermissionView,
    scheduleCreate,
    scheduleDelete,
    scheduleEdit,
    scheduleView,
    tabAllPermission,
    tabHistoryPermission,
    tabPendingPermission,
    userCreate,
    userDelete,
    userEdit,
    userView
} from "../../../reducers/role/initialstate";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import React, {memo} from "react";
import {CheckboxList} from "@atoms/checkboxlist/CheckboxList";

function RoleChecklist(props: { value: any[], onChange: (value) => void }) {
   console.log(props.value, "value")
    return <View style={{padding: 20}}>

        <View>

            <CheckboxList
                containerStyle={{flex: 1}}
                showCheckAll={false}
                value={props.value}
                onChange={props.onChange
                }
                options={[
                    {label: "Chat", value: chat},
                    {label: "Meet", value: meet},
                    {label: "Activity", value: activity},
                ]}
            />
            <View style={{paddingTop: 10}}>
                <Text size={14} style={styles.text}>User</Text>
                <CheckboxList
                    showCheckAll={false}
                    value={props.value}
                    onChange={props.onChange
                    }
                    options={[
                        {label: "Create", value: userCreate},
                        {label: "Read", value: userView},
                        {label: "Update", value: userEdit},
                        {label: "Delete", value: userDelete},
                    ]}
                />
            </View>
            <View style={{paddingTop: 10}}>
                <Text size={14} style={styles.text}>Employee</Text>
                <CheckboxList
                    showCheckAll={false}
                    value={props.value}
                    onChange={props.onChange
                    }
                    options={[
                        {label: "Create", value: employeeCreate},
                        {label: "Read", value: employeeView},
                        {label: "Update", value: employeeEdit},
                        {label: "Delete", value: employeeDelete},
                    ]}
                />
            </View>
            <View style={{paddingTop: 10}}>
                <Text size={14} style={styles.text}>Role and Permission</Text>
                <CheckboxList
                    size={12}
                    showCheckAll={false}
                    value={props.value}
                    onChange={props.onChange
                    }
                    options={[
                        {label: "Create", value: rolePermissionCreate},
                        {label: "Read", value: rolePermissionView},
                        {label: "Update", value: rolePermissionEdit},
                        {label: "Delete", value: rolePermissionDelete},
                    ]}
                />
            </View>
        </View>
        <Text size={14} style={styles.text}>Misc.</Text>
        <CheckboxList
            size={12}
            showCheckAll={false}
            value={props.value}
            onChange={props.onChange
            }
            options={[
                {label: "Reset Password", value: resetPasswordPermission},
                {label: "Qr Code", value: qrCodePermission},
            ]}
        />
        <Text size={14} style={styles.text}>Tabs</Text>
        <CheckboxList
            size={12}
            showCheckAll={false}
            value={props.value}
            onChange={props.onChange
            }
            options={[
                {label: "All", value: tabAllPermission},
                {label: "Pending", value: tabPendingPermission},
                {label: "History", value: tabHistoryPermission},
            ]}
        />
        <Text size={14} style={styles.text}>Schedule</Text>
        <CheckboxList
            size={12}
            showCheckAll={false}
            value={props.value}
            onChange={props.onChange
            }
            options={[
                {label: "Create", value: scheduleCreate},
                {label: "Read", value: scheduleView},
                {label: "Update", value: scheduleEdit},
                {label: "Delete", value: scheduleDelete},
            ]}
        />

        <Text size={14} style={styles.text}>Report</Text>
        <CheckboxList
            size={12}
            showCheckAll={false}
            value={props.value}
            onChange={props.onChange
            }
            options={[
                {label: "Cashier", value: reportCashierPermission},
                {label: "Evaluator", value: reportEvaluatorPermission},
            ]}
        />

        <Text size={14} style={styles.text}>Configuration</Text>
        <CheckboxList
            size={12}
            showCheckAll={false}
            value={props.value}
            onChange={props.onChange
            }
            options={[
                {label: "Create", value: configurationCreate},
                {label: "Read", value: configurationView},
                {label: "Update", value: configurationEdit},
                {label: "Delete", value: configurationDelete},
            ]}
        />
    </View>;
}

export default memo(RoleChecklist)
