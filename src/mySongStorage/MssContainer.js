import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateReasonConditionAC} from './MssStore';

import SongSearch from './songSearch/SongSearch';
import SongRegist from './songRegist/SongRegist';

class MssContainer extends Component {
  constructor(props) {
    super(props);
    this.modeJudge = this.modeJudge.bind(this)
  }

  modeJudge(mode) {
    this.resetReasonCondition();
    switch(mode) {
      case 'regist':
        return <SongRegist />;
      
      case 'search':
        return <SongSearch />;

      default:
        return '';
    }
  }

  resetReasonCondition() {
    let reasonInit = this.props.reasonList.slice();
    let action = updateReasonConditionAC(reasonInit);
    this.props.dispatch(action);
  }

  render() {
    return <div id="mssContainer">
      {this.modeJudge(this.props.mode)}
    </div>;
  }
}
MssContainer = connect(
  state => ({
    mode: state.mode,
    reasonList: state.reasonList
  })
)(MssContainer);

export default MssContainer;