import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateSongStorageAC, updateReasonConditionAC} from '../MssStore';
import AddURL from './AddURL'
import ReasonList from './ReasonList';
import firebase from "firebase";
import "firebase/storage";

function mappingState(state) {
  return {
    songStorage: state.songStorage,
    reasonList: state.reasonList,
    reasonCondition: state.reasonCondition
  }
}

class SongRegist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songName: '',
      songInit: '',
      compName: '',
      compInit: '',
      note: '',
      songStorageLastId: -1,
      maxSongName: 100,
      maxSongInit: 10,
      maxCompName: 30,
      maxCompInit: 10,
    }
    this.doSubmit = this.doSubmit.bind(this);
    this.doChange = this.doChange.bind(this);
    this.urlRef = React.createRef();
    this.confRegist = this.confRegist.bind(this);
    this.registSong = this.registSong.bind(this);
    this.cancelRegist = this.cancelRegist.bind(this);
    this.resetRegist = this.resetRegist.bind(this);
    this.resetReasonCondition = this.resetReasonCondition.bind(this);
    this.getLastId = this.getLastId.bind(this);
  }

  doChange(e) {
    let inputName = e.target.name;
    let newValue;
    switch(inputName) {
      case 'songName':
        let maxSongName = this.state.maxSongName;
        if(e.target.value.length > maxSongName) {
          alert(`曲名は${maxSongName}文字以下で入力してください。`);
          newValue = e.target.value.substr(0, maxSongName);
        }
        break;

      case 'songInit':
        let maxSongInit = this.state.maxSongInit;
        if(e.target.value.length > maxSongInit) {
          alert(`Alphabetは${maxSongInit}文字以下で入力してください。`);
          newValue = e.target.value.substr(0, maxSongInit);
        }
        if(/[^A-Za-z0-9-_ ,.]/.test(e.target.value) === true) {
          alert('半角英数、半角スペース、「-」「_」「,」「.」で入力してください。');
          newValue = e.target.value.substr(0, e.target.value.length - 1);
        }
        break;

      case 'compName':
        let maxCompName = this.state.maxCompName;
        if(e.target.value.length > maxCompName) {
          alert(`曲名は${maxCompName}文字以下で入力してください。`);
          newValue = e.target.value.substr(0, maxCompName);
        }
        break;
  
      case 'compInit':
        let maxCompInit = this.state.maxCompInit;
        if(e.target.value.length > maxCompInit) {
          alert(`Alphabetは${maxCompInit}文字以下で入力してください。`);
          newValue = e.target.value.substr(0, maxCompInit);
        }
        if(/[^A-Za-z0-9-_ ,.]/.test(e.target.value) === true) {
          alert('半角英数、半角スペース、「-」「_」「,」「.」で入力してください。');
          newValue = e.target.value.substr(0, e.target.value.length - 1);
        }
        break;

      default: break;
    }
    this.setState({
      [e.target.name]: newValue
    });
  }

  doSubmit(e) {
    let confirmContainer = document.querySelector('#confirmRegistMessage');
    if(confirmContainer) {
      this.cancelRegist();
    }

    e.preventDefault();
    this.confRegist();
  }

  confRegist() {
    let formElem = document.querySelector('#formSongRegist');
    let divElem = document.createElement('div');
    let pElem = document.createElement('p');
    let okButton = document.createElement('input');
    let cancelButton = document.createElement('input');

    pElem.innerHTML = 'この曲のデータを登録します。';
    divElem.id = 'confirmRegistMessage'
    okButton.setAttribute('value', 'OK');
    okButton.setAttribute('type', 'button');
    okButton.onclick = this.registSong;
    cancelButton.setAttribute('value', 'Cancel');
    cancelButton.setAttribute('type', 'button');
    cancelButton.onclick = this.cancelRegist;
    
    divElem.appendChild(pElem);
    divElem.appendChild(okButton);
    divElem.appendChild(cancelButton);
    formElem.appendChild(divElem);
  }

  registSong() {
    let nullCheck = false;
    let inputSongName = document.querySelector('#formSongRegist input[name="songName"]');
    let listElemSongName = inputSongName.parentNode;

    let songData = {
      songName: '',
      songInit: '',
      compName: '',
      compInit: '',
      url: [],
      note: '',
      reason: [],
      date: ''
    };
    let tempUrl = [];
    let tempReason = [];

    let registItems = document.querySelectorAll('.regist-item');

    registItems.forEach((value) => {
      switch(value.name) {
        case 'songName':
          songData[`${value.name}`] = value.value;
          if(value.value !== '') {
            nullCheck = true;
          }
          break;

        case 'note':
          songData[`${value.name}`] = encodeURIComponent(value.value);
          break;

        case 'url':
          if(value.value !== '') {
            tempUrl.push(encodeURIComponent(value.value));
          }
          break;
        
        case 'reason':
          if(value.checked) {
            tempReason.push(value.value)
          }
          break;

        default:
          songData[`${value.name}`] = value.value;
          break;
      }
    });
    if(tempUrl.length === 0) {
      tempUrl.push('');
    }
    if(tempReason.length === 0) {
      tempReason.push('未選択');
    }

    // 空の場合のコメントをリセット
    let comments = listElemSongName.querySelectorAll('.require-comment');
    if(comments.length !== 0) {
      for(let i = 0; i < comments.length; i++) {
        comments[i].remove();
      }
    }
    if(nullCheck === false) { // songNameが空の場合はコメントを表示して、処理を止める
      inputSongName.classList.add('border-red');
      let elemP = document.createElement('p');
      elemP.innerHTML = '※曲名を入力してください。';
      elemP.classList.add('require-comment');
      listElemSongName.appendChild(elemP);
      return;
    } else { // songNameが空でない場合
      inputSongName.classList.remove('required-input');
    }

    songData.url = tempUrl;
    songData.reason = tempReason;
    songData.date = Date.now();
        
    // firebaseへの追加
    this.addFireSongStorage(songData);

    let newSongStorage = this.props.songStorage.slice();
    newSongStorage.unshift(songData);
    let action = updateSongStorageAC(newSongStorage);
    this.props.dispatch(action);
    this.cancelRegist();
    this.resetRegist();
  }

  getLastId() {
    let db = firebase.database();
    let ref = db.ref('songStorage/');
    let self = this;
    ref.orderByKey()
      .limitToLast(1)
      .on('value', (snapshot) => {
        let res = snapshot.val();
        for(let i in res) {
          self.setState({
            songStorageLastId: i
          });
          return;
        }
    });
  }

  addFireSongStorage(songData) {
    if(this.state.songStorageLastId === -1) {
      return;
    }
    let id = this.state.songStorageLastId * 1 + 1;
    let db = firebase.database();
    let ref = db.ref('songStorage/' + id);
    ref.set(songData);
  }

  cancelRegist() {
    let cancelTarget = document.querySelector('#confirmRegistMessage');
    cancelTarget.remove();
  }

  resetRegist() {
    this.setState({
      songName: '',
      songInit: '',
      compName: '',
      compInit: '',
      note: ''
    });
    this.urlRef.current.resetRegist();
    this.resetReasonCondition();
  }

  resetReasonCondition() {
    let reasonInit = this.props.reasonList.slice();
    let action = updateReasonConditionAC(reasonInit);
    this.props.dispatch(action);
  }

  render() {
    if(this.state.songStorageLastId === -1) {
      this.getLastId();
    }
    return <div id="mss-body-regist">
      <h2>曲登録</h2>
      <form id="formSongRegist">
        <ul>
          <li className="grid-container">
            <label for="songName" className="item-bold item-title">曲名 <span>(必須)</span></label>
            <input type="text" id="songName" name="songName" onChange={this.doChange} value={this.state.songName} className="regist-item" />
          </li>
          <li className="additional-info grid-container">
            <label for="songInit" className="item-title grid-item-label">Alphabet <br /><span>(10文字まで)</span></label>
            <input type="text" id="songInit" name="songInit" onChange={this.doChange} value={this.state.songInit} className="regist-item" />
          </li>
          <li className="grid-container">
            <label for="compName" className="item-bold item-title">作曲者</label>
            <input type="text" id="compName" name="compName" onChange={this.doChange} value={this.state.compName} className="regist-item" />
          </li>
          <li className="additional-info grid-container">
            <label for="compInit" className="item-title">Alphabet <br /><span>(10文字まで)</span></label>
            <input type="text" id="compInit" name="compInit" onChange={this.doChange} value={this.state.compInit} className="regist-item" />
          </li>
          <AddURL type="url" name="url" onchange={this.doChange} className="regist-item" ref={this.urlRef}>
            参考URL
          </AddURL>
          <li>
            <label for="note" className="item-bold item-title">メモ</label><br/>
            <textarea id="note" name="note" onChange={this.doChange} value={this.state.note} className="regist-item" ></textarea>
          </li>
          <li>
            <ReasonList type="checkbox" name="reason" onchange={this.doChange} className="regist-item" />
          </li>
        </ul>
        <button onClick={this.doSubmit}>登録</button>
      </form>
    </div>;
  }
}
export default connect(mappingState)(SongRegist);