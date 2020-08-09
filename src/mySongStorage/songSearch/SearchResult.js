import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selectedSongIdAC, selectedSongDataAC, songDataModeAC, editReasonConditionAC} from '../MssStore';

import MoveButton from './MoveButton';

function mappingState(state) {
  return {
    songStorage: state.songStorage,
    finalResult: state.finalResult,
    selectedSongId: state.selectedSongId,
    selectedSongData: state.selectedSongData,
    reasonList: state.reasonList
  }
}

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.displaySearchResult = this.displaySearchResult.bind(this);
    this.noResultTr = this.noResultTr.bind(this);
    this.resetResultTable = this.resetResultTable.bind(this);
    this.songResultTr = this.songResultTr.bind(this);
    this.clickSongResult = this.clickSongResult.bind(this);
    this.setBgInSelectedSong = this.setBgInSelectedSong.bind(this);
    this.buildEditReasonConditon = this.buildEditReasonConditon.bind(this);
  }

  displaySearchResult(songStorage, finalResult) {
    let searchedSongList = [];
    songStorage.forEach((songData) => {
      if(finalResult.includes(songData.date)) {
        searchedSongList.unshift(songData);
      }
    });
    // renderを全部終えてからsongResultTrを処理する為のsetTimeout
    setTimeout(() => {
      this.resetResultTable();
      if(searchedSongList.length === 0) {
        this.noResultTr();
      } else {
        searchedSongList.forEach((songData, index) => {
          this.songResultTr(songData, index);
        });
      }
    }, 0);
  };

  noResultTr() {
    let elemTbody = document.getElementById('result-tbody');
    let elemTr = document.createElement('tr');
    let elemTd = document.createElement('td');

    elemTr.classList.add('displayed-tr');
    elemTr.id = 'no-result';
    elemTd.innerHTML = '検索条件に該当する曲はありませんでした。';
    elemTd.setAttribute('colspan', 4);

    elemTr.appendChild(elemTd);
    elemTbody.appendChild(elemTr);

    // 選択されたハイライトを消す
    let action = selectedSongIdAC('');
    this.props.dispatch(action);

    // songDataModeをdefaultへ変更
    let actionMode = songDataModeAC('default');
    this.props.dispatch(actionMode);
  }

  resetResultTable() {
    let displayedTrs = document.querySelectorAll('#result-tbody .displayed-tr');
    if(displayedTrs !== null) {
      for(let i = 0; i < displayedTrs.length; i++) {
        displayedTrs[i].remove();
      }
    }
  }

  songResultTr(songData, index) {
    let elemTbody = document.getElementById('result-tbody');
    let elemTr = document.createElement('tr');
    let elemTd0 = document.createElement('td');
    let elemTd1 = document.createElement('td');
    let elemTd2 = document.createElement('td');
    let elemTd3 = document.createElement('td');
    let elemUl = document.createElement('ul');

    let reasons = songData.reason;
    reasons.forEach((reason, index) => {
      let elemLi = document.createElement('li');
      elemLi.classList.add('card');
      elemLi.innerHTML = reason;
      elemUl.appendChild(elemLi);
    });

    elemTr.classList.add('displayed-tr');
    elemTr.onclick = this.clickSongResult;
    elemTr.dataset.songid = songData.date;
    elemTd0.innerHTML = index + 1;
    elemTd1.innerHTML = songData.songName;
    elemTd2.innerHTML = songData.compName;
    elemTd3.appendChild(elemUl);//songData.reason.join([' / ']);

    elemTr.appendChild(elemTd0);
    elemTr.appendChild(elemTd1);
    elemTr.appendChild(elemTd2);
    elemTr.appendChild(elemTd3);
    elemTbody.appendChild(elemTr);
  }

  clickSongResult(e) {
    let targetTr = e.currentTarget;
    let songId = targetTr.dataset.songid;
    let prevSelect = document.querySelector('#result-tbody .selectSongResult');

    if(prevSelect !== null) {
      if(prevSelect.dataset.songid !== songId) {
        prevSelect.classList.remove('selectSongResult');
      }
    }

    let action = selectedSongIdAC(songId);
    this.props.dispatch(action);
    
    //songDataを取得して、storeに設定する為の処理
    let selectedSongId = this.props.selectedSongId;
    if(selectedSongId !== '') {
      let songData = this.props.songStorage.find((song) => song.date == selectedSongId); // ここの比較演算子は==であることに注意
      let action = selectedSongDataAC(songData);
      this.props.dispatch(action);
    }

    //songDataModeにdetailを設定
    let actionMode = songDataModeAC('detail');
    this.props.dispatch(actionMode);

    this.buildEditReasonConditon();
  }

  setBgInSelectedSong() {
    let selectedSongId = '';
    selectedSongId = this.props.selectedSongId;

    // 最後に処理を行う為のsetTimeout
    // ターゲットに背景色のクラスを設定する
    setTimeout(() => {
      let trs = document.querySelectorAll('#result-tbody .displayed-tr');
      for(let i = 0; i < trs.length; i++) {
        if(trs[i].dataset.songid === selectedSongId) {
          trs[i].classList.add('selectSongResult');
        }
      }
    }, 0);
  }

  buildEditReasonConditon() {
    let selectedSongReason = this.props.selectedSongData.reason;
    let initReasonList = this.props.reasonList;
    let newEditReasonConditon = [];
    let initReasonKeyArray = [];

    initReasonList.forEach((value) => {
      let key = Object.keys(value)[0];
      let reasonObject = {};
      if(selectedSongReason.includes(key)) {
        reasonObject[`${key}`] = "checked";
      } else {
        reasonObject[`${key}`] = "";
      }
      newEditReasonConditon.push(reasonObject);
      initReasonKeyArray.push(key);
    });

    selectedSongReason.forEach((value) => {
      if(!initReasonKeyArray.includes(value)) {
        let reasonObject2 = {};
        reasonObject2[`${value}`] = "checked";
        newEditReasonConditon.push(reasonObject2);
      }
    });
    let action = editReasonConditionAC(newEditReasonConditon);
    this.props.dispatch(action);
  }

  render() {
    return <figure id="search-result">
      <h3><figcaption>検索結果</figcaption></h3>
      <div id="table-container">
        <table id="result-table">
          <thead id="result-thead">
            <tr>
              <th>No.</th>
              <th>曲名</th>
              <th>作曲者</th>
              <th>きっかけ</th>
            </tr>
          </thead>
          <tbody id="result-tbody">
            {this.displaySearchResult(this.props.songStorage, this.props.finalResult)}
            {this.setBgInSelectedSong()}
          </tbody>
        </table>
      </div>
      <MoveButton />
    </figure>
  }
}

export default connect(mappingState)(SearchResult);