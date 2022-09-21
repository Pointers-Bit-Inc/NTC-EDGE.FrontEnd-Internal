const { Record } = require('immutable');
export const chat = "permission.chat",
    activity = "permission.activity",
    meet = "permission.meet",
    userCreate = "permission.user.create",
    userDelete = "permission.user.delete",
    userEdit = "permission.user.edit",
      userView = "permission.user.view",
    employeeCreate = "permission.employee.create",
    employeeDelete = "permission.employee.delete",
    employeeEdit = "permission.employee.edit",
    employeeView = "permission.employee.view",
    rolePermissionCreate = "permission.rolepermission.create",
    rolePermissionDelete = "permission.rolepermission.delete",
    rolePermissionEdit = "permission.rolepermission.edit",
    rolePermissionView = "permission.rolepermission.view",
    scheduleCreate = "permission.schedule.create",
    scheduleDelete = "permission.schedule.delete",
    scheduleEdit = "permission.schedule.edit",
    scheduleView = "permission.schedule.view",
    configurationCreate = "permission.configuration.create",
    configurationDelete = "permission.configuration.delete",
    configurationEdit = "permission.configuration.edit",
    configurationView = "permission.configuration.view",
    resetPasswordPermission = "permission.resetpassword",
    tabAllPermission = "permission.tab.all",
    tabPendingPermission = "permission.tab.pending",
    tabHistoryPermission = "permission.tab.history",
    qrCodePermission = "permission.qrcode";
const InitialState = Record({
  roles: [],
  role:{},
  roles_select: []
});

export default InitialState;
