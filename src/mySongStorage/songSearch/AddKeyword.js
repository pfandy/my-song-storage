import React, {Component} from 'react';

class AddKeyword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywordValues: ['']
    };
    this.doChange = this.doChange.bind(this);
    this.addInputKeyword = this.addInputKeyword.bind(this);
    this.delInputKeyword = this.delInputKeyword.bind(this);
  }

  pickupKeywords() {
    let keywordElems = document.querySelectorAll(`#input-keyword input[name=${this.props.name}]`);
    let currentKeywords = [];
    for(let i = 0; i < keywordElems.length; i++) {
      currentKeywords.push(keywordElems[i].value);
    }
    return currentKeywords;
  }

  doChange() {
    let currentKeywords = this.pickupKeywords();
    this.setState({
      keywordValues: currentKeywords
    });
  }

  addInputKeyword() {
    const inputContainer = document.querySelector('#input-keyword');
    const keywordSet = document.createElement('div');
    const newInputKeyword = document.createElement('input');
    const deleteButton = document.createElement('input');
    keywordSet.classList.add('search-item-set');
    newInputKeyword.setAttribute('type', this.props.type);
    newInputKeyword.setAttribute('name', this.props.name);
    newInputKeyword.classList.add(`${this.props.className}`)
    newInputKeyword.onchange = this.doChange;
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('name', 'del');
    deleteButton.setAttribute('value', '削除');
    deleteButton.onclick = this.delInputKeyword;
    keywordSet.appendChild(newInputKeyword);
    keywordSet.appendChild(deleteButton);
    inputContainer.append(keywordSet);
    this.doChange();
  }

  delInputKeyword(e) {
    if(this.state.keywordValues.length === 1) {
      return;
    }
    e.target.parentNode.remove();
    this.doChange();
  }

  resetSearch() {
    let searchItemSets = document.querySelectorAll('.search-item-set');
    searchItemSets.forEach((value) => value.remove());
    this.addInputKeyword();
  }
  
  render() {
    return <li id="search-keyword">
      <label for={this.props.name} className="item-bold item-title">{this.props.children}</label>
      <div id="input-keyword">
        <div className="search-item-set">
          <input type={this.props.type} id={this.props.name} name={this.props.name} onChange={this.doChange/*this.props.onchange*/} value={this.state.keywordValues[0].value} className={this.props.className} />
          <input type="button" name="del" value="削除" onClick={this.delInputKeyword} />
        </div>
      </div>
      <button type="button" onClick={this.addInputKeyword}>追加</button>
    </li>;
  };
}

export default AddKeyword;