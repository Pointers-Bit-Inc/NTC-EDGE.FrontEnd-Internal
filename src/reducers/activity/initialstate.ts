const { Record } = require('immutable');
export const DATE_ADDED = "Date Added",
    FOREVALUATION = 'For Evaluation',
    APPROVED = "Approved",
    DECLINED = "Declined",
    DECLINE = "Decline",
    VERIFICATION = "Verification",
    PAID = "Paid",
    FORPAYMENT = "For Payment",
    RELEASED = "Released",
    OTHERS = "Others",
    CASHIER = "cashier",
    DIRECTOR = "director",
    EVALUATOR = "evaluator"

const InitialState = Record({
  visible: false,
  statusCode: [
    {
      id: 1,
      checked: false,
      status: DATE_ADDED,
      iconBrand: 'feather',
      iconName: 'calendar'
    },
    {
      id: 2,
      checked: false,
      status: FOREVALUATION,
      iconBrand: 'evil',
      iconName: 'redo'
    },
    {
      id: 3,
      checked: false,
      status: APPROVED,
      iconBrand: 'material-community',
      iconName: 'check-circle-outline'
    },
    {
      id: 4,
      checked: false,
      status: DECLINED,
      iconBrand: 'ionicons',
      iconName: 'md-close-circle-outline'
    }
  ],
  selectedChangeStatus:[],
  activities:[]
});

export default InitialState;
