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
    resetPasswordPermission = "permission.resetpassword",
    qrCodePermission = "permission.qrcode";
const InitialState = Record({
  roles: [],
  role:{}
});

export default InitialState;
