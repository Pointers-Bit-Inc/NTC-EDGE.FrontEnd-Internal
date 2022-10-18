const { Record } = require('immutable');
export const DATE_ADDED = "Date Added",
    FOREVALUATION = 'For Evaluation',
    APPROVED = "Approved",
    DECLINED = "Declined",
    RETURNED = "Returned",
    DECLINE = "Decline",
    VERIFICATION = "Verification",
    VERIFIED = "Verified",
    UNVERIFIED = "Unverified",
    PAID = "Paid",
    PENDING = "Pending",
    FORVERIFICATION = 'For Verification',
    FORPAYMENT = "For Payment",
    FORAPPROVAL = "For Approval",
    RELEASED = "Released",
    OTHERS = "Others",
    CASHIER = "cashier",
    DIRECTOR = "director",
    EVALUATOR = "evaluator",
    VERIFIER = "verifier" ,
    CHECKER = "checker",
    ADMIN = "admin",
    ACCOUNTANT = "accountant",
    ACTIVITIES = "Activities",
    ACTIVITIESLIST = "ActivitiesList",
    PAYMENTPENDING = "PaymentPending",
    ACTIVITYITEM = "ActivityItem",
    EDITAPPLICATION = "EditApplication",
    CHAT = "Chat",
    MEET = "Meet",
    SCANQR = "QR",
    SCHEDULE = "Schedule",
    CONFIGURATION = "Configuration",
    MORE = "More",
    DASHBOARD = "Dashboard",
    REPORT="Reports",
    ROLEANDPERMISSION="Roles & Permission",
    GROUP="Group",
    EMPLOYEES="Employee",
    USERS="Users",
    SETTINGS="Settings",
    SEARCH = "Search",

    SEARCHMOBILE = "SearchActivities";

const InitialState = Record({
  visible: false,
  feedVisible: true,
  tabName: '',
  updateIncrement: 0,
  drowdownVisible: false,
  editModalVisible: false,
  statusCode: [
    {
      id: 1,
      checked: false,
      status: DATE_ADDED,
      iconBrand: 'feather',
      iconName: 'calendar',
      isShow: [CHECKER, CASHIER, DIRECTOR, EVALUATOR, ACCOUNTANT]
    },
    {
      id: 2,
      checked: false,
      status: FORAPPROVAL,
      iconBrand: 'evil',
      iconName: 'redo',
      isShow: [CHECKER, DIRECTOR, EVALUATOR]
    },
    {
      id: 3,
      checked: false,
      status: APPROVED,
      iconBrand: 'material-community',
      iconName: 'check-circle-outline',
      isShow: [CHECKER, DIRECTOR, EVALUATOR, ACCOUNTANT]
    },
    {
      id: 4,
      checked: false,
      status: DECLINED,
      iconBrand: 'ionicons',
      iconName: 'md-close-circle-outline',
      isShow: [CHECKER, DIRECTOR, EVALUATOR, ACCOUNTANT]
    },
    {
      id: 5,
      checked: false,
      status: VERIFIED,
      iconBrand: 'feather',
      iconName: 'calendar',
      isShow: [CHECKER, CASHIER]
    },
    {
      id: 6,
      checked: false,
      status: UNVERIFIED,
      iconBrand: 'evil',
      iconName: 'redo',
      isShow: [CHECKER, CASHIER]
    },
  ],
  selectedChangeStatus:[],
  activities:[],

});

export default InitialState;
