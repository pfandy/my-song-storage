import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateModeAC} from './MssStore'

class MssTabMenu extends Component {
  constructor(props) {
    super(props);
    this.app = props.app;
    this.doAction = this.doAction.bind(this);
  }

  doAction(e) {
    e.preventDefault();
    let action = updateModeAC(e.target.getAttribute('href'));
    this.props.dispatch(action);
  }

  render() {
    return <div className={`mssTabMenu-${this.props.mode}`}>
      <ul id="main-menu" className="move-point">
        <li id="tab-regist">
          <a href="regist" onClick={this.doAction}>曲登録</a>
        </li>
        <li id="tab-search">
          <a href="search" onClick={this.doAction}>曲検索</a>
        </li>
      </ul>
      <div id="mss-message">
        <p>
          「いい曲を見つけたからメモを取ったのに、どこにメモしたか思い出せない」「曲名が分かっているのに、どのサイトで見つけたのか分からない」なんてことありませんか？
        </p>
        <p>
          <span>My Song Storage</span>は、あなたが日常の中で巡り会った曲との貴重な出会いを大切に保管して、いつでも簡単に探し出せるようサポートいたします。
        </p>
      </div>
    </div>;
  }
}

export default connect(
  state => ({mode: state.mode})
)(MssTabMenu);