import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateReasonConditionAC, updateDisplayResultAC, searchConditionAC, searchSongsAC, finalResultAC} from '../MssStore';

import AddKeyword from './AddKeyword';
import SearchResult from './SearchResult';
import SongDataDetail from './SongDataMode/SongDataDetail';
import SongDataEdit from './SongDataMode/SongDataEdit';

function mappingState(state) {
  return {
    songStorage: state.songStorage,
    reasonList: state.reasonList,
    reasonCondition: state.reasonCondition,
    displayResult: state.displayResult,
    searchCondition: state.searchCondition,
    searchedSongs: state.searchedSongs,
    songDataMode: state.songDataMode
  }
}

class SongSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songName: '',
      songInit: '',
      compName: '',
      compInit: ''
    };
    this.doChange = this.doChange.bind(this);
    this.displayResult = this.displayResult.bind(this);
    this.searchResult = this.searchResult.bind(this);
    this.pickupReasons = this.pickupReasons.bind(this);
    this.doChangeList = this.doChangeList.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.resetReasonCondition = this.resetReasonCondition.bind(this);
    this.keywordRef = React.createRef();
    this.doFinalResult = this.doFinalResult.bind(this);
    this.displaySongData = this.displaySongData.bind(this);
  }

  doChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  pickupReasons() {
    let reasonElems = document.querySelectorAll(`#input-reason input[name="reason"]`);
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

  resetSearch() {
    this.setState({
      songName: '',
      songInit: '',
      compName: '',
      compInit: ''
    });
    this.keywordRef.current.resetSearch();
    this.resetReasonCondition();
  }
  resetReasonCondition() {
    let reasonInit = this.props.reasonList.slice();
    let action = updateReasonConditionAC(reasonInit);
    this.props.dispatch(action);
  }

  displayResult() {
    switch(this.props.displayResult) {
      case 'display':
        return <SearchResult />;

      default:
        return '';
    }
  }
  displaySongData() {
    switch(this.props.songDataMode) {
      case 'detail':
        return <SongDataDetail />;

      case 'edit':
        return <SongDataEdit />;

      default:
        return /*'default'*/;
    }
  }

  searchResult() {
    // 結果の表示
    let action = updateDisplayResultAC('display');
    this.props.dispatch(action);

    // 検索条件を取得
    let searchItems = document.querySelectorAll('.search-item');
    let searchCondition = {
      songName: '',
      songInit: '',
      compName: '',
      compInit: '',
      reason: [],
      keyword: []
    };

    let tempReason = [];
    let tempKeyword = [];

    searchItems.forEach((value) => {
      switch(value.name) {
        case 'reason':
          if(value.checked) {
            tempReason.push(value.value)
          }
          break;

        case 'keyword':
          if(value.value !== '') {
            tempKeyword.push(value.value)
          }
          break;

        default:
          searchCondition[`${value.name}`] = value.value;
          break;
      }
    });
    searchCondition.reason = tempReason;
    searchCondition.keyword = tempKeyword;

    // 検索条件をStoreに設定
    let actionSearchCondition = searchConditionAC(searchCondition);
    this.props.dispatch(actionSearchCondition);

    // ストレージから検索
    const promise2 = new Promise((resolve) => {
      let action = searchSongsAC(searchCondition, this.props.songStorage, resolve);
      this.props.dispatch(action);
    });

    // searchSongsの後にdoFinalResultを呼び出すための処理
    promise2.then(() => {
      this.doFinalResult();
    });
  }

  // 検索結果から重複のないfinalResultを作る
  doFinalResult() {
    let actionResult = finalResultAC(this.props.searchedSongs);
    this.props.dispatch(actionResult);
  }

  render() {
    return <div id="mss-body-search">
      <h2>曲検索<span>（部分一致検索）</span></h2>
      <form>
        <ul>
          <li className="grid-container">
            <label for="songName" className="item-bold item-title">曲名</label>
            <input type="text" id="songName" name="songName" onChange={this.doChange} value={this.state.songName} className="search-item"/>
          </li>
          <li className="additional-info grid-container">
            <label for="songInit" className="item-title grid-item-label">Alphabet <br /><span>(10文字まで)</span></label>
            <input type="text" id="songInit" name="songInit" onChange={this.doChange} value={this.state.songInit} className="search-item grid-item-input"/>
          </li>
          <li className="grid-container">
            <label for="compName" className="item-bold item-title">作曲者</label>
            <input type="text" id="compName" name="compName" onChange={this.doChange} value={this.state.compName} className="search-item"/>
          </li>
          <li className="additional-info grid-container">
            <label for="compInit" className="item-title">Alphabet <br /><span>(10文字まで)</span></label>
            <input type="text" id="compInit" name="compInit" onChange={this.doChange} value={this.state.compInit} className="search-item"/>
          </li>
          <li>
            <fieldset id="input-reason">
              <legend className="item-bold item-title">きっかけ</legend>
              
              {this.props.reasonCondition.map((state, id) => (
                <label key={id}>
                  <input type="checkbox" value={Object.keys(state)[0]} name="reason" onChange={this.doChangeList} checked={state[`${Object.keys(state)[0]}`]} className="search-item" />{`${Object.keys(state)[0]}(${id})`}
                </label>
              ))}
            </fieldset>
          </li>
          <AddKeyword type="text" name="keyword" onchange={this.doChange} className="search-item" ref={this.keywordRef}>
            きっかけキーワード検索：
          </AddKeyword>
        </ul>
        <div className="button-container">
          <button id="search-button" type='button' onClick={this.searchResult}>検索</button>
          <button type='button' onClick={this.resetSearch}>リセット</button>
        </div>

      </form>
      <div className="separate-bar move-point">
        {this.displayResult(this.props.displayResult)}
        {this.displaySongData(this.props.songDataMode)}
      </div>
    </div>;
  }
}

export default connect(mappingState)(SongSearch);