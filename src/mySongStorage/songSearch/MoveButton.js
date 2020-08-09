import React, {Component} from 'react';

class MoveButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prev: "",
      next: ""
    };
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.getMovePoints = this.getMovePoints.bind(this);
    this.moveInitialize = this.moveInitialize.bind(this);
    this.maxScroll = this.maxScroll.bind(this);
    this.doMove = this.doMove.bind(this);
  }

  moveUp(e) {
    e.preventDefault();
    let currentPos = window.scrollY; // 現在のスクロール量
    let movePointArray = this.getMovePoints(currentPos);

    this.moveInitialize(movePointArray, currentPos);

    setTimeout(() => {
      this.doMove(this.state.prev);
    }, 0);
  }
  moveDown(e) {
    e.preventDefault();
    let currentPos = window.scrollY; // 現在のスクロール量
    let movePointArray = this.getMovePoints(currentPos);

    this.moveInitialize(movePointArray, currentPos);

    setTimeout(() => {
      this.doMove(this.state.next);
    }, 0);
  }

  doMove(target) {
    let current = window.scrollY;
    let decelerationRate = 0.2;
    let progressTimer;

    progressTimer = setInterval(updateprogress, 1000 / 60);
  
    function updateprogress() {
      current -= (current - target) * decelerationRate;
      window.scrollTo(0, current);
  
      if(Math.abs(current - target) < 2) {
        clearInterval(progressTimer);
        window.scrollTo(0, target);
        return;
      }
    }
  }

  moveInitialize(movePointArray, currentPos) {
    let prev;
    let next;

    let maxScroll = this.maxScroll();
    let check = false;

    for(let i = 0; i < movePointArray.length; i++) {
      if(currentPos === 0) {
        check = true;
        prev = 0;
        next = movePointArray[1] + 2;
      }
      if(check === false && movePointArray[i] < currentPos && movePointArray[i + 1] >= currentPos) {
        check = true;
        prev = movePointArray[i];

        if(movePointArray[i + 1] > maxScroll) {
          next = maxScroll;
        } else {
          next = movePointArray[i + 1] + 2;
        }
      }
      if(check === false && i === movePointArray.length - 1) {
        prev = movePointArray[i];
        next = maxScroll;
      }
    }

    this.setState({
      prev: prev,
      next: next
    });
  }

  maxScroll() {
    let main = document.querySelector('main');
    let mainMarginBtm = getComputedStyle(main).marginBottom.slice(0, -2) * 1; // px以外の数字だけ取得して数値化
    let contentHeight = main.clientHeight + mainMarginBtm;

    let windowHeight = document.querySelector('footer').getBoundingClientRect().bottom; // 表示部上端からfooter bottomまでの長さ(= 表示部の高さ)

    let maxScroll = contentHeight - windowHeight;
    return maxScroll;
  }
  getMovePoints(currentPos) {
    let headerHight = document.querySelector('header').clientHeight;
    let movePoint = document.querySelectorAll('.move-point'); // 移動先のターゲット要素
    let movePointArray = [];

    for(let i = 0; i < movePoint.length; i++) {
      let elemRect = movePoint[i].getBoundingClientRect();
      if(i == 0) {
        movePointArray.push(Math.abs(elemRect.top + currentPos)); // ページの戦闘からの距離
      } else {
        movePointArray.push(elemRect.top + currentPos - headerHight); // headerHeightの分を補正
      }
    }
    return movePointArray;
  }

  render() {
    return <div id="move-button">
      <a href="#" className="updown-button up" onClick={this.moveUp}>▲</a>
      <hr />
      <a href="#" className="updown-button down"onClick={this.moveDown}>▼</a>
    </div>;
  };
}

export default MoveButton;