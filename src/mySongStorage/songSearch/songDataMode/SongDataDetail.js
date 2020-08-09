import React, {Component} from 'react';
import {connect} from 'react-redux';
import {songDataModeAC} from '../../MssStore';

function mappingState(state) {
  return {
    selectedSongData: state.selectedSongData,
    reasonList: state.reasonList,
    editReasonCondition: state.editReasonCondition
  }
}

class SongDataDetail extends Component {
  constructor(props) {
    super(props);
    this.displayUrl = this.displayUrl.bind(this);
    this.displayReason = this.displayReason.bind(this);
    this.displayEditor = this.displayEditor.bind(this);
    this.displayNote = this.displayNote.bind(this);
  }

  displayUrl(urlArray) {
    setTimeout(() => {
      let urls = urlArray;
      let elemDiv = document.querySelector('#detail-url');
      
      //表示する前にリセットし直す
      let elemDds = elemDiv.querySelectorAll('dd');
      let promise = new Promise((resolve) => {
        if(elemDds.length !== 0) {
          for(let i = (elemDds.length - 1); i >= 0; i--) {
            elemDds[i].remove();
            if(i === 0) {
              resolve();
            }
          }
        } else {
          resolve();
        }
      });

      promise.then(() => {
        let emptyCheck = false;
        urls.forEach((url) => {
          if(url !== ""|null) {
            emptyCheck = true;
          }
        });
        if(emptyCheck === true) {
          urls.forEach((url, index) => {
            let elemDd = document.createElement('dd');
            let elemAnchor = document.createElement('a');
        
            elemAnchor.href = decodeURIComponent(url);
            elemAnchor.setAttribute('target', '_blank');
            elemAnchor.setAttribute('rel', 'noopener');
            elemAnchor.innerHTML = `URL${index + 1}`;
            elemDd.appendChild(elemAnchor);
            elemDd.classList.add('card');
            elemDiv.appendChild(elemDd);
          });
        }
      });
    }, 0);
  }

  displayNote(note) {
    setTimeout(() => {
      let elemDd = document.querySelector('#detail-note');
      let decodedNote = decodeURIComponent(note);
      let noteForHTML = decodedNote.replace(/\n/g, '<br />');
      elemDd.innerHTML = `${noteForHTML}`;
    }, 0);
  }
  displayReason(reasonArray) {
    setTimeout(() => {
      let reasons = reasonArray;
      let elemDiv = document.querySelector('#detail-reason');
      
      //表示する前にリセットし直す
      let elemDds = elemDiv.querySelectorAll('dd');
      let promise = new Promise((resolve) => {
        if(elemDds.length !== 0) {
          for(let i = (elemDds.length - 1); i >= 0; i--) {
            elemDds[i].remove();
            if(i === 0) {
              resolve();
            }
          }
        } else {
          resolve();
        }
      });

      promise.then(() => {
        reasons.forEach((reason, index) => {
          let elemDd = document.createElement('dd');
          elemDd.classList.add('card');
          elemDd.innerHTML = reason;
          elemDiv.appendChild(elemDd);
        });
      });
    }, 0);
  }

  displayEditor() {
    let action = songDataModeAC('edit');
    this.props.dispatch(action);
  }

  render() {
    return <div id="song-detail" className="separate-bar move-point">
      <h3>データ詳細</h3>
      <button onClick={this.displayEditor}>この曲を編集する</button>
      <dl id="detail-item-container">
        <div className="grid-row">
          <dt className="item-bold">曲名</dt><dd>{this.props.selectedSongData.songName}</dd>
        </div>
        <div className="grid-row additional-item">
          <dt>Alphabet</dt><dd>{this.props.selectedSongData.songInit}</dd>
        </div>
        <div className="grid-row">
          <dt className="item-bold">作曲者</dt><dd>{this.props.selectedSongData.compName}</dd>
        </div>
        <div className="grid-row additional-item">
          <dt>Alphabet</dt><dd>{this.props.selectedSongData.compInit}</dd>
        </div>
        <div id="detail-url">
          <dt className="item-bold">参考URL<span>（リンクを開く）</span></dt>
          {this.displayUrl(this.props.selectedSongData.url)}
        </div>
        <div id="detail-note-div">
          <dt className="item-bold">メモ</dt>
          <dd id="detail-note">{this.displayNote(this.props.selectedSongData.note)}</dd>
        </div>
        <div id="detail-reason">
          <dt className="item-bold">きっかけ</dt>
          {this.displayReason(this.props.selectedSongData.reason)}
        </div>
      </dl>
    </div>
  }
}

export default connect(mappingState)(SongDataDetail);