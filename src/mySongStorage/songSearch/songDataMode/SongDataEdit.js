import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateSongStorageAC, searchSongsAC, finalResultAC, songDataModeAC} from '../../MssStore';
import firebase from "firebase";
import "firebase/storage";

import EditURL from './EditURL';
import EditReason from './EditReason';

function mappingState(state) {
  return {
    songStorage: state.songStorage,
    selectedSongData: state.selectedSongData,
    searchedSongs: state.searchedSongs,
    finalResult: state.finalResult,
    selectedSongId: state.selectedSongId,
    searchCondition: state.searchCondition
  }
}

class SongDataEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songName: props.selectedSongData.songName,
      songInit: props.selectedSongData.songInit,
      compName: props.selectedSongData.compName,
      compInit: props.selectedSongData.compInit,
      note: decodeURIComponent(props.selectedSongData.note),
      maxSongName: 100,
      maxSongInit: 10,
      maxCompName: 30,
      maxCompInit: 10,
    }
    this.doSubmit = this.doSubmit.bind(this);
    this.doChange = this.doChange.bind(this);
    this.confRegist = this.confRegist.bind(this);
    this.editSong = this.editSong.bind(this);
    this.cancelRegist = this.cancelRegist.bind(this);
    this.doRemoveSong = this.doRemoveSong.bind(this);
    this.confRemove = this.confRemove.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
    this.cancelRemove = this.cancelRemove.bind(this);
    this.editFireSongStorage = this.editFireSongStorage.bind(this);
    this.deleteFireSongStorage = this.deleteFireSongStorage.bind(this);
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
    let formElem = document.querySelector('#formSongEdit');
    let divElem = document.createElement('div');
    let pElem = document.createElement('p');
    let okButton = document.createElement('input');
    let cancelButton = document.createElement('input');

    pElem.innerHTML = 'この曲のデータを登録します。';
    divElem.id = 'confirmRegistMessage'
    okButton.setAttribute('value', 'OK');
    okButton.setAttribute('type', 'button');
    okButton.onclick = this.editSong;
    cancelButton.setAttribute('value', 'Cancel');
    cancelButton.setAttribute('type', 'button');
    cancelButton.onclick = this.cancelRegist;
    
    divElem.appendChild(pElem);
    divElem.appendChild(okButton);
    divElem.appendChild(cancelButton);
    formElem.appendChild(divElem);
  }

  editSong() {
    let nullCheck = false;
    let inputSongName = document.querySelector('#formSongEdit input[name="songName"]');
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

    let editItems = document.querySelectorAll('.edit-item');

    editItems.forEach((value) => {
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
            tempReason.push(value.value);
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
      elemP.innerHTML = '曲名を入力してください。';
      elemP.classList.add('require-comment');
      listElemSongName.appendChild(elemP);
      return;
    } else { // songNameが空でない場合
      inputSongName.classList.remove('required-input');
    }

    songData.url = tempUrl;
    songData.reason = tempReason;
    songData.date = this.props.selectedSongData.date;
        
    // firebaseのsongStorageのデータを変更
    this.editFireSongStorage(songData);

    let newSongStorage = this.props.songStorage.slice();
    let targetIndex = newSongStorage.indexOf(this.props.selectedSongData);
    
    newSongStorage.splice(targetIndex, 1, songData);
    let action = updateSongStorageAC(newSongStorage);
    this.props.dispatch(action);

    // ストレージから検索
    const promise2 = new Promise((resolve) => {
      let action = searchSongsAC(this.props.searchCondition, this.props.songStorage, resolve);
      this.props.dispatch(action);
    });

    // searchSongsの後にdoFinalResultを呼び出すための処理
    promise2.then(() => {
      this.doFinalResult();
    });
    
    this.cancelRegist();
  }

  editFireSongStorage(songData) {
    let selectedSongDate = this.props.selectedSongData.date;
    let editId;

    let db = firebase.database();
    let ref = db.ref('songStorage/');
    ref.orderByKey()
    //.limitToFirst() 全て抽出
      .on('value', (snapshot) => {
        let fireData = snapshot.val();
        for(let key in fireData) {
          if(fireData[key].date === selectedSongDate) {
            editId = key;
          }
        };
      });

    let editRef = db.ref('songStorage/' + editId);
    editRef.set(songData);
  }

  // 検索結果から重複のないfinalResultを作る
  doFinalResult() {
    let actionResult = finalResultAC(this.props.searchedSongs);
    this.props.dispatch(actionResult);
  }

  cancelRegist() {
    let cancelTarget = document.querySelector('#confirmRegistMessage');
    cancelTarget.remove();
  }

  componentDidMount() {
    // selectedSongDataのurlからeditorの中に値をセットする。
    let inputContainer = document.querySelector('#input-url');
    let button = inputContainer.parentNode.querySelector('button');
    let urls = this.props.selectedSongData.url
    for(let i = 0; i < urls.length - 1; i++) {
      button.click();
    }
    let inputs = inputContainer.querySelectorAll('.edit-item');
    for(let j = 0; j < urls.length; j++) {
      inputs[j].value = decodeURIComponent(urls[j]);
    }
  };

  doRemoveSong(e) {
    let confirmContainer = document.querySelector('#confirmRemoveMessage');
    if(confirmContainer) {
      this.cancelRemove();
    }

    e.preventDefault();
    this.confRemove();
  }
  confRemove() {
    let formElem = document.querySelector('#formSongRemove');
    let divElem = document.createElement('div');
    let pElem = document.createElement('p');
    let okButton = document.createElement('input');
    let cancelButton = document.createElement('input');

    pElem.innerHTML = 'この曲のデータを削除します。';
    divElem.id = 'confirmRemoveMessage'
    okButton.setAttribute('value', 'OK');
    okButton.setAttribute('type', 'button');
    okButton.onclick = this.deleteSong;
    cancelButton.setAttribute('value', 'Cancel');
    cancelButton.setAttribute('type', 'button');
    cancelButton.onclick = this.cancelRemove;
    
    divElem.appendChild(pElem);
    divElem.appendChild(okButton);
    divElem.appendChild(cancelButton);
    formElem.appendChild(divElem);
  }
  deleteSong() {
    // firebaseからselectedSongDataを削除
    this.deleteFireSongStorage();

    let newSongStorage = [];
    let songStorage = this.props.songStorage;
    songStorage.forEach((value) => {
      if(value.date !== this.props.selectedSongData.date) {
        newSongStorage.unshift(value);
      }
    });
    let action = updateSongStorageAC(newSongStorage);
    this.props.dispatch(action);

    // delete後の処理
    // ストレージから検索
    const promise = new Promise((resolve) => {
      let action = searchSongsAC(this.props.searchCondition, this.props.songStorage, resolve);
      this.props.dispatch(action);
    });

    // searchSongsの後にdoFinalResultを呼び出すための処理
    promise.then(() => {
      this.doFinalResult();
    });
    
    this.cancelRemove();

    // 結果の表示モードをdefaultにする
    let actionMode = songDataModeAC('default');
    this.props.dispatch(actionMode);
  }

  deleteFireSongStorage() {
    let selectedSongDate = this.props.selectedSongData.date;
    let deleteId;

    let db = firebase.database();
    let ref = db.ref('songStorage/');
    ref.orderByKey()
    //.limitToFirst() 全て抽出
      .on('value', (snapshot) => {
        let fireData = snapshot.val();
        for(let key in fireData) {
          if(fireData[key].date === selectedSongDate) {
            deleteId = key;
          }
        }
      });

    let deleteRef = db.ref('songStorage/' + deleteId);
    deleteRef.remove();
  }

  cancelRemove() {
    let cancelTarget = document.querySelector('#confirmRemoveMessage');
    cancelTarget.remove();
  }

  render() {
    return <div id="song-edit" className="separate-bar move-point">
      <h3>曲データの編集・削除</h3>
      <form id="formSongEdit">
        <ul>
          <li className="grid-container">
            <label for="songName" className="item-bold item-title">曲名 <span>(必須)</span></label>
            <input type="text" id="songName" name="songName" onChange={this.doChange} value={this.state.songName} className="edit-item" />
          </li>
          <li className="additional-info grid-container">
            <label for="songInit" className="item-title grid-item-label">Alphabet <br /><span>(10文字まで)</span></label>
            <input type="text" id="songInit" name="songInit" onChange={this.doChange} value={this.state.songInit} className="edit-item" />
          </li>
          <li className="grid-container">
            <label for="compName" className="item-bold item-title">作曲者</label>
            <input type="text" id="compName" name="compName" onChange={this.doChange} value={this.state.compName} className="edit-item" />
          </li>
          <li className="additional-info grid-container">
            <label for="compInit" className="item-title">Alphabet <br /><span>(10文字まで)</span></label>
            <input type="text" id="compInit" name="compInit" onChange={this.doChange} value={this.state.compInit} className="edit-item" />
          </li>
          <EditURL type="url" name="url" onchange={this.doChange} className="edit-item">
            参考URL
          </EditURL>
          <li>
            <label for="note" className="item-bold item-title">メモ</label><br/>
            <textarea id="note" name="note" onChange={this.doChange} value={this.state.note} className="edit-item" ></textarea>
          </li>
          <li>
            <EditReason type="checkbox" name="reason" onchange={this.doChange} className="edit-item" />
          </li>
        </ul>
        <button onClick={this.doSubmit}>データを更新</button>
      </form>
      <form id="formSongRemove" className="separate-bar move-point">
        <button onClick={this.doRemoveSong}>この曲を削除</button>
      </form>
    </div>;
  }
}

export default connect(mappingState)(SongDataEdit);