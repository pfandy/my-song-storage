import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateReasonAC, updateReasonConditionAC} from '../MssStore';
import firebase from "firebase";
import "firebase/storage";

class ReasonList extends Component {
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
    this.addFireReason = this.addFireReason.bind(this);
    this.deleteFireReason = this.deleteFireReason.bind(this);
  }

  pickupReasons() {
    let reasonElems = document.querySelectorAll(`#input-reason input[name=${this.props.name}]`);
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
    let action = updateReasonConditionAC(currentReasons);
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
    if(this.state.reasonEdit.addReason === ""|null) {
      return;
    }
    let regexp = /\.|\#|\$|\[|\]/;
    let empty = /\S/;
    if(regexp.test(this.state.reasonEdit.addReason) || !empty.test(this.state.reasonEdit.addReason)) {
      alert('きっかけの項目名には、スペースのみの登録、および「.」「#」「$」「[」「]」の文字は使用できません。');
      return;
    }
    
    let newReasonList = this.props.reasonList.slice();
    let addReasonObject = {}; //追加分の連想配列
    addReasonObject[`${this.reasonEdit.addReason}`] = '';
    newReasonList.push(addReasonObject);

    // Firebaseにreasonを追加する。
    this.addFireReason(addReasonObject, newReasonList);
    
    this.reasonEdit.addReason = '';
    this.setState({
      reasonEdit: this.reasonEdit
    });
  }

  addFireReason(addReasonObject, newReasonList) {
    let db = firebase.database();
    let ref = db.ref('reasonList/');
    ref.once('value', (snapshot) => {
      let reasonArray = Object.keys(snapshot.val());
      let check = false;
      let promise = new Promise((resolve) => {
        reasonArray.forEach((value, key) => {
          if(value === Object.keys(addReasonObject)[0]) {
            check = true;
          }
          if(key === reasonArray.length - 1) {
            resolve();
          }
        });
      });
      promise.then(() => {
        if(check !== true) {
          let newRef = db.ref('reasonList/' + Object.keys(addReasonObject)[0]);
          newRef.set('');

          // reduxのstoreへ登録
          let actionReason = updateReasonAC(newReasonList); //action creator
          this.props.dispatch(actionReason);
        }
      });
    });
  };

  removeReason() {
    this.resetEdit();
    let reasonContainer = document.querySelector('#reason-add-remove');
    let message = document.createElement('p');
    message.id = 'message-add-remove';
    if(this.props.reasonList.length === 1) {
      message.innerHTML = '最後の「きっかけ」は削除することができません。別の「きっかけ」追加してから削除してください。';
      reasonContainer.appendChild(message);
    } else if(this.props.reasonList[this.reasonEdit.removeReason]) {
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
    let deleteNumber = this.reasonEdit.removeReason;

    this.deleteFireReason(newReasonList[deleteNumber]);
    
    newReasonList.splice(deleteNumber, 1);
    let actionReason = updateReasonAC(newReasonList); //action creator
    this.props.dispatch(actionReason);

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
  
  deleteFireReason(deleteObject) {
    let db = firebase.database();
    let ref = db.ref('reasonList/');

    let deleteKey = Object.keys(deleteObject)[0];
    ref.once('value', (snapshot) => {
      let storage = snapshot.val();
      if(storage.hasOwnProperty(deleteKey) && Object.keys(storage).length > 1) {
        let deleteRef = db.ref('reasonList/' + deleteKey);
        deleteRef.remove();
      }
    });
  }

  render() {
    return <fieldset id="input-reason">
      <legend className="item-bold item-title">きっかけ</legend>
      
      {this.props.reasonCondition.map((state, id) => (
        <label key={id}>
          <input type={this.props.type} value={Object.keys(state)[0]} name={this.props.name} onChange={this.doChangeList} checked={state[`${Object.keys(state)[0]}`]} className={this.props.className} />{`${Object.keys(state)[0]}(${id})`}
        </label>
      ))}
      <div id="reason-add-remove">
        <p>
          <label for="addReason">項目追加</label>
          <input type="text" id="addReason" name="addReason" onChange={this.doChangeEdit} value={this.state.reasonEdit.addReason} placeholder='追加したい項目を入力' />
          <input type="button" value="追加" onClick={this.addReason} />
        </p>
        <p>
          <label for="removeReason">項目削除</label>
          <input type="text" id="removeReason" name="removeReason" onChange={this.doChangeEdit} value={this.state.reasonEdit.removeReason} placeholder='削除したい項目の番号を入力' />
          <input type="button" value="削除" onClick={this.removeReason} />
        </p>
      </div>
    </fieldset>;
  }
}

export default connect(
  state => ({
    reasonList: state.reasonList,
    reasonCondition: state.reasonCondition
  })
)(ReasonList);