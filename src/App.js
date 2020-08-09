import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateSongStorageAC, updateReasonAC} from './mySongStorage/MssStore';
import MssTabMenu from './mySongStorage/MssTabMenu';
import MssContainer from './mySongStorage/MssContainer';
import './css/App.css';
import firebase from "firebase";
import "firebase/storage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.appName = props.appName;
    this.getFireSongStorage();
    this.getFireReasonList();
  }

  getFireSongStorage() {
    let db = firebase.database();
    let ref = db.ref('songStorage/');
    let fireData;
    const promise = new Promise((resolve) => {
      ref.orderByKey()
        //.limitToFirst() 全て抽出
        .on('value', (snapshot) => {
          fireData = Object.values(snapshot.val());
          resolve();
        });
    });
    promise.then(() => {
      let action = updateSongStorageAC(fireData);
      this.props.dispatch(action);
    });
  };

  getFireReasonList() {
    let db = firebase.database();
    let ref = db.ref('reasonList/');
    let fireData = [];
    const promise = new Promise((resolve) => {
      ref.orderByKey()
        //.limitToFirst() 全て抽出
        .on('value', (snapshot) => {
          let arrayReasonList = Object.keys(snapshot.val());
          arrayReasonList.forEach((value) => {
            let object = {};
            object[`${value}`] = "";
            fireData.push(object);
          });
          resolve();
        });
    });
    promise.then(() => {
      let action = updateReasonAC(fireData);
      this.props.dispatch(action);
    });
  };

  render() {
    return <div id="main-container">
      <MssTabMenu app={this} />
      <MssContainer app={this} mode={this.props.mode} />
    </div>;
  }
}

export default connect(
  state => ({mode: state.mode})
)(App);
