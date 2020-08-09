import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateReasonAC, updateReasonConditionAC, editReasonConditionAC} from '../../MssStore';

class EditReason extends Component {
  reasonEdit = {
    addReason: "",
    removeReason: ""
  }

  constructor(props) {
    super(props);
    this.state = {
      reasonEdit: {
        addReason: '',
        removeReason: ''
      }
    };
    this.addReason = this.addReason.bind(this);
    this.removeReason = this.removeReason.bind(this);
    this.doChangeEdit = this.doChangeEdit.bind(this);
    this.deleteReason = this.deleteReason.bind(this);
    this.resetEdit = this.resetEdit.bind(this);
    this.doChangeList = this.doChangeList.bind(this);
    this.displayReason = this.displayReason.bind(this);
  }

  pickupReasons() {
    let reasonElems = document.querySelectorAll(`#edit-input-reason input[name=${this.props.name}]`);
    let currentReasons = [];
    for(let i = 0; i < reasonElems.length; i++) {
      let reasonObject = {}
      if(reasonElems[i].checked) {
        reasonObject[`${reasonElems[i].value}`] = 'checked';
      } else {
        reasonObject[`${reasonElems[i].value}`] = '';
      }
      currentReasons.push(reasonObject);
    }
    return currentReasons;
  }
  doChangeList() {
    let currentReasons = this.pickupReasons();
    let action = editReasonConditionAC(currentReasons);
    this.props.dispatch(action);
  }

  doChangeEdit(e) {
    switch(e.target.getAttribute('name')) {
      case 'addReason':
        this.reasonEdit.addReason = e.target.value;
        this.setState({
          reasonEdit: this.reasonEdit
        });
        break;
      
      case 'removeReason':
        this.reasonEdit.removeReason = e.target.value;
        this.setState({
          reasonEdit: this.reasonEdit
        });
        break;

      default:
        break;
    }
  }
  addReason() {
    let newReasonList = this.props.reasonList.slice();
    let newReasonCondition = this.props.reasonCondition.slice();
    let addReasonObject = {}; //追加分の連想配列
    addReasonObject[`${this.reasonEdit.addReason}`] = '';
    newReasonList.push(addReasonObject);
    newReasonCondition.push(addReasonObject);
    
    let actionReason = updateReasonAC(newReasonList); //action creator
    this.props.dispatch(actionReason);

    let actionReasonCondition = updateReasonConditionAC(newReasonCondition);
    this.props.dispatch(actionReasonCondition);

    this.reasonEdit.addReason = '';
    this.setState({
      reasonEdit: this.reasonEdit
    });
  }
  removeReason() {
    this.resetEdit();
    let reasonContainer = document.querySelector('#reason-add-remove');
    let message = document.createElement('p');
    message.id = 'message-add-remove';
    if(this.props.reasonList[this.reasonEdit.removeReason]) {
      let removeTarget = this.props.reasonList[`${this.reasonEdit.removeReason}`];
      message.innerHTML = `<span>「${Object.keys(removeTarget)[0]}」</span>を削除します。<input type="button" name="ok" value="OK" /><input type="button" name="cancel" value="Cancel" />`;
      reasonContainer.appendChild(message);
      reasonContainer.querySelector('input[name=ok]').onclick = this.deleteReason;
      reasonContainer.querySelector('input[name=cancel]').onclick = this.resetEdit;
    } else {
      message.innerHTML = '入力した番号の項目が存在しない、または入力方法が正しくありません。半角数字のみを使用してください。<input type="button" name="cancel" value="Cancel" />'
      reasonContainer.appendChild(message);
      reasonContainer.querySelector('input[name=cancel]').onclick = this.resetEdit;
    }
  }
  deleteReason() {
    let newReasonList = this.props.reasonList.slice();
    newReasonList.splice(this.reasonEdit.removeReason, 1);
    let actionReason = updateReasonAC(newReasonList); //action creator
    this.props.dispatch(actionReason);

    let newReasonCondition = this.props.reasonCondition.slice();
    newReasonCondition.splice(this.reasonEdit.removeReason, 1);
    let actionReasonCondition = updateReasonConditionAC(newReasonCondition); //action creator
    this.props.dispatch(actionReasonCondition);

    this.reasonEdit.removeReason = '';
    this.setState({
      reasonEdit: this.reasonEdit
    });
    this.resetEdit();
  }
  resetEdit() {
    let editMessage = document.querySelector('#message-add-remove');
    if(editMessage != null) {
      editMessage.remove();
    }
  }

  displayReason() {
    let displayReason = this.props.editReasonCondition.map((state, id) => (
      <label>
        <input type={this.props.type} value={Object.keys(state)[0]} name={this.props.name} onChange={this.doChangeList} checked={state[`${Object.keys(state)[0]}`]} className={this.props.className} />{`${Object.keys(state)[0]}(${id})`}
      </label>
    ));
    return displayReason;
  }

  render() {
    return <fieldset id="edit-input-reason">
      <legend className="item-bold item-title">きっかけ</legend>
      {this.displayReason()}
      <p className="comment">※きっかけの項目の追加は、曲の登録画面で行ってください。</p>
    </fieldset>;
  }
}

export default connect(
  state => ({
    reasonList: state.reasonList,
    editReasonCondition: state.editReasonCondition
  })
)(EditReason);