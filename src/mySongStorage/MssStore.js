import {createStore} from 'redux';
import firebase from "firebase";

// Firebaseの初期化
var firebaseConfig = {
  apiKey: "AIzaSyCMoRKjWKKuT5Hodx6bwSCs_uSQJ-UHSm8",
  authDomain: "my-song-storage-ya.firebaseapp.com",
  databaseURL: "https://my-song-storage-ya.firebaseio.com",
  projectId: "my-song-storage-ya",
  storageBucket: "my-song-storage-ya.appspot.com",
  messagingSenderId: "61830005283",
  appId: "1:61830005283:web:a228cfeccda59e7f356796",
  measurementId: "G-ZNQ34FB0XY"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch(error) {
  console.log(error.message);
}

const initData = {
  mode: 'default',
  songStorage: [],
  reasonList: [// 初期値
    /*
    {お気に入り: ''},
    {ライブ候補曲: ''},
    {いつか自分のライブでやりたい: ''},
    {コピー候補: ''},
    {人からのお勧め: ''},
    {参考音源: ''},
    {その他: ''}
    */
  ],
  reasonCondition: [],// reasonの状態を保存する
  displayResult: 'default',
  searchCondition: {},
  searchedSongs: [
    {key: 'songName', songIDs: [], registDate: ''},
    {key: 'songInit', songIDs: [], registDate: ''},
    {key: 'compName', songIDs: [], registDate: ''},
    {key: 'compInit', songIDs: [], registDate: ''},
    {key: 'reason', songIDs: [], registDate: ''},
    {key: 'keyword', songIDs: [], registDate: ''}
  ],
  finalResult: [],
  selectedSongId: '',
  selectedSongData: [],
  songDataMode: '',
  editReasonCondition: [// editReasonにおけるreasonの状態を保存する
    /*
    {お気に入り: ''},
    {ライブ候補曲: ''},
    {いつか自分のライブでやりたい: ''},
    {コピー候補: ''},
    {人からのお勧め: ''},
    {参考音源: ''},
    {その他: ''}
    */
  ]
}

// reducer
export function modeSelect(state = initData, action) {
  switch(action.type) {
    case 'updateMode':
      return updateModeReduce(state, action);

    case 'updateReasonList':
      return updateReasonReduce(state, action);

    case 'updateSongStorage':
      return updateSongStorageReduce(state, action);

    case 'updateReasonCondition':
      return updateReasonConditionReduce(state, action);

    case 'updateDisplayResult':
      return updateDisplayResultReduce(state, action);

    case 'updateSearchCondition':
      return searchConditionReduce(state, action);

    case 'searchedSongs':
      return searchedSongsReduce(state, action);

    case 'finalResult':
      return finalResultReduce(state, action);

    case 'updateFinalResult':
      return updateFinalResultReduce(state, action);

    case 'selectedSongId':
      return selectedSongIdReduce(state, action);

    case 'selectedSongData':
      return selectedSongDataReduce(state, action);

    case 'songDataMode':
      return songDataModeReduce(state, action);

    case 'editReasonCondition':
      return editReasonConditionReduce(state, action);
      
    default:
      return state;
  }
}

// reduce action
function updateModeReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'mode') {
      newState[`${key}`] = action.mode;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function updateReasonReduce(state, action) {
  let newState = {};
  let resetReasonList = {};
  resetReasonList = action.reasonList.map((value) => {
    let key = Object.keys(value)[0];
    return {[`${key}`]: ''};
  });
  for(let key in state) {
    if(key === 'reasonList') {
      newState[`${key}`] = resetReasonList;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function updateSongStorageReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'songStorage') {
      newState[`${key}`] = action.songStorage;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function updateReasonConditionReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'reasonCondition') {
      newState[`${key}`] = action.reasonCondition;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function updateDisplayResultReduce(state, action){
  let newState = {};
  for(let key in state) {
    if(key === 'displayResult') {
      newState[`${key}`] = action.displayResult;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
};

function searchConditionReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'searchCondition') {
      newState[`${key}`] = action.searchCondition;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function searchedSongsReduce(state, action) {
  let searchCondition = action.searchCondition;
  let songStorage = action.songStorage;

  let newSearchedSongs = [
    {key: 'songName', songIDs: [], registDate: ''},
    {key: 'songInit', songIDs: [], registDate: ''},
    {key: 'compName', songIDs: [], registDate: ''},
    {key: 'compInit', songIDs: [], registDate: ''},
    {key: 'reason', songIDs: [], registDate: ''},
    {key: 'keyword', songIDs: [], registDate: ''}
  ];

  for(let key in searchCondition) {
    if(searchCondition[key]) {
      //valueが含まれる曲をstorageのnameSongから探してsearchedSongsのsongNameにunshiftする。

      switch(key) {
        case 'songName':
          let tempSongName = {};
          let tempSongIDs0 = [];
          songStorage.forEach(value => {
            if(value.songName.toLowerCase().includes(`${searchCondition[key].toLowerCase()}`)) {
              tempSongIDs0.unshift(value.date);
            }
          });
          tempSongName.key = 'songName';
          tempSongName.songIDs = tempSongIDs0;
          tempSongName.registDate = Date.now();
          newSearchedSongs[0] = tempSongName;
          break;

        case 'songInit':
          let tempSongInit = {};
          let tempSongIDs1 = [];
          songStorage.forEach(value => {
            if(value.songInit.toLowerCase().includes(`${searchCondition[key].toLowerCase()}`)) {
              tempSongIDs1.unshift(value.date);
            }
          });
          tempSongInit.key = 'songInit';
          tempSongInit.songIDs = tempSongIDs1;
          tempSongInit.registDate = Date.now();
          newSearchedSongs[1] = tempSongInit;
          break;

        case 'compName':
          let tempCompName = {};
          let tempSongIDs2 = [];
          songStorage.forEach(value => {
            if(value.compName.toLowerCase().includes(`${searchCondition[key].toLowerCase()}`)) {
              tempSongIDs2.unshift(value.date);
            }
          });
          tempCompName.key = 'compName';
          tempCompName.songIDs = tempSongIDs2;
          tempCompName.registDate = Date.now();
          newSearchedSongs[2] = tempCompName;
          break;

        case 'compInit':
          let tempCompInit = {};
          let tempSongIDs3 = [];
          songStorage.forEach(value => {
            if(value.compInit.toLowerCase().includes(`${searchCondition[key].toLowerCase()}`)) {
              tempSongIDs3.unshift(value.date);
            }
          });
          tempCompInit.key = 'compInit';
          tempCompInit.songIDs = tempSongIDs3;
          tempCompInit.registDate = Date.now();
          newSearchedSongs[3] = tempCompInit;
          break;

        case 'reason':
          if(searchCondition[key].length !== 0) {
            let tempReason = {};
            let tempSongIDs4 = [];
            songStorage.forEach(songData => {
              let includeJudge = false;
              searchCondition[key].some((value) => {
                if(songData.reason.includes(`${value}`)) {
                  includeJudge = true;
                  return true;
                }
              });
              if(includeJudge === true) {
                tempSongIDs4.unshift(songData.date);
              }
            });
            tempReason.key = 'reason';
            tempReason.songIDs = tempSongIDs4;
            tempReason.registDate = Date.now();
            newSearchedSongs[4] = tempReason;
          }
          break;

        case 'keyword':
          if(searchCondition[key].length !== 0) {
            let tempKeyword = {};
            let tempSongIDs5 = [];
            songStorage.forEach(songData => {
              let includeJudge = false;
              searchCondition[key].some((value) => {
                songData.reason.some((reason) => {
                  if(reason.toLowerCase().includes(`${value.toLowerCase()}`)) {
                    includeJudge = true;
                    return true;
                  }
                });
                if(includeJudge === true) {
                  return true;
                };
              });
              if(includeJudge === true) {
                tempSongIDs5.unshift(songData.date);
              }
            });
            tempKeyword.key = 'keyword';
            tempKeyword.songIDs = tempSongIDs5;
            tempKeyword.registDate = Date.now();
            newSearchedSongs[5] = tempKeyword;
          }
          break;

        default:
          break;
      }
    }
  }
  let newState = {};
  for(let key in state) {
    if(key === 'searchedSongs') {
      newState[`${key}`] = newSearchedSongs;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  if(action.resolve !== '') {
    action.resolve();
  }
  return newState;
};

function finalResultReduce(state, action) {
  let searchedSongs = action.searchedSongs;
  let duplicateResult = [];
  searchedSongs.forEach((value) => {
    duplicateResult = duplicateResult.concat(value.songIDs);
  });
  let uniqueResult = duplicateResult.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  let newState = {};
  for(let key in state) {
    if(key === 'finalResult') {
      newState[`${key}`] = uniqueResult;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function updateFinalResultReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'finalResult') {
      newState[`${key}`] = action.searchedSongs;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function selectedSongIdReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'selectedSongId') {
      newState[`${key}`] = action.selectedSongId;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function selectedSongDataReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'selectedSongData') {
      newState[`${key}`] = action.selectedSongData;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

function songDataModeReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'songDataMode') {
      newState[`${key}`] = action.songDataMode;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
};

function editReasonConditionReduce(state, action) {
  let newState = {};
  for(let key in state) {
    if(key === 'editReasonCondition') {
      newState[`${key}`] = action.editReasonCondition;
    } else {
      newState[`${key}`] = state[`${key}`];
    }
  }
  return newState;
}

// action creator
export function updateModeAC(newMode) {
  return {
    type: 'updateMode',
    mode: newMode
  }
}

export function updateReasonAC(newReasonList) {
  return {
    type: 'updateReasonList',
    reasonList: newReasonList
  }
}

export function updateSongStorageAC(newSongStorage) {
  return {
    type: 'updateSongStorage',
    songStorage: newSongStorage
  }
}

export function updateReasonConditionAC(currentReasons) {
  return {
    type: 'updateReasonCondition',
    reasonCondition: currentReasons
  }
}

export function updateDisplayResultAC(displayResult) {
  return {
    type: 'updateDisplayResult',
    displayResult: displayResult
  }
}

export function searchConditionAC(searchCondition) {
  return {
    type: 'updateSearchCondition',
    searchCondition: searchCondition
  }
}

export function searchSongsAC(searchCondition, songStorage, resolve) {
  return {
    type: 'searchedSongs',
    searchCondition: searchCondition,
    songStorage: songStorage,
    resolve: resolve
  }
}

export function finalResultAC(searchedSongs) {
  return {
    type: 'finalResult',
    searchedSongs: searchedSongs
  }
}

export function updateFinalResultAC(searchedSongs) {
  return {
    type: 'updateFinalResult',
    searchedSongs: searchedSongs
  }
}

export function selectedSongIdAC(songId) {
  return {
    type: 'selectedSongId',
    selectedSongId: songId
  }
}

export function selectedSongDataAC(songData) {
  return {
    type: 'selectedSongData',
    selectedSongData: songData
  }
}

export function songDataModeAC(newMode) {
  return {
    type: 'songDataMode',
    songDataMode: newMode
  }
}

export function editReasonConditionAC(currentEditReasons) {
  return {
    type: 'editReasonCondition',
    editReasonCondition: currentEditReasons
  }
}


export default createStore(modeSelect);
