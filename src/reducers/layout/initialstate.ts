const { Record } = require('immutable');

const InitialState = Record({
  chatLayout: {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  },
  drawerLayout: {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  }
});

export default InitialState;
