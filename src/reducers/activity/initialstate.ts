const { Record } = require('immutable');
export const DATE_ADDED = "Date Added",
    FOREVALUATION = 'For Evaluation',
    APPROVED = "Approved",
    DECLINED = "Declined",
    DECLINE = "Decline",
    VERIFICATION = "Verification",
    VERIFIED = "Verified",

    UNVERIFIED = "Unverified",
    PAID = "Paid",
    PENDING = "Pending",
    FORVERIFICATION = 'For Verification',
    FORPAYMENT = "For Payment",
    RELEASED = "Released",
    OTHERS = "Others",
    CASHIER = "cashier",
    DIRECTOR = "director",
    EVALUATOR = "evaluator",
    VERIFIER = "verifier"

const InitialState = Record({
  visible: false,
  statusCode: [
    {
      id: 1,
      checked: false,
      status: DATE_ADDED,
      iconBrand: 'feather',
      iconName: 'calendar',
      isShow: [CASHIER, DIRECTOR, EVALUATOR]
    },
    {
      id: 2,
      checked: false,
      status: FOREVALUATION,
      iconBrand: 'evil',
      iconName: 'redo',
      isShow: [DIRECTOR, EVALUATOR]
    },
    {
      id: 3,
      checked: false,
      status: APPROVED,
      iconBrand: 'material-community',
      iconName: 'check-circle-outline',
      isShow: [DIRECTOR, EVALUATOR]
    },
    {
      id: 4,
      checked: false,
      status: DECLINED,
      iconBrand: 'ionicons',
      iconName: 'md-close-circle-outline',
      isShow: [DIRECTOR, EVALUATOR]
    },
    {
      id: 5,
      checked: false,
      status: VERIFIED,
      iconBrand: 'feather',
      iconName: 'calendar',
      isShow: [CASHIER]
    },
    {
      id: 6,
      checked: false,
      status: UNVERIFIED,
      iconBrand: 'evil',
      iconName: 'redo',
      isShow: [CASHIER]
    },
  ],
  selectedChangeStatus:[],
  activities:[]
});

export default InitialState;
