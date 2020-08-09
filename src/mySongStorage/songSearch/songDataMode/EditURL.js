import React, {Component} from 'react';

class EditURL extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlValues: ['']
    };
    this.doChange = this.doChange.bind(this);
    this.addInputURL = this.addInputURL.bind(this);
    this.delInputURL = this.delInputURL.bind(this);
  }

  pickupUrls() {
    let urlElems = document.querySelectorAll(`#input-url input[name=${this.props.name}]`);
    let currentUrls = [];
    for(let i = 0; i < urlElems.length; i++) {
      currentUrls.push(urlElems[i].value);
    }
    return currentUrls;
  }

  doChange() {
    let currentUrls = this.pickupUrls();
    this.setState({
      urlValues: currentUrls
    });
  }

  addInputURL() {
    const inputContainer = document.querySelector('#input-url');
    const urlSet = document.createElement('div');
    const newInputURL = document.createElement('input');
    const deleteButton = document.createElement('input');
    urlSet.classList.add('regist-item-set');
    newInputURL.setAttribute('type', this.props.type);
    newInputURL.setAttribute('name', this.props.name);
    newInputURL.classList.add(`${this.props.className}`)
    newInputURL.onchange = this.doChange;
    deleteButton.setAttribute('type', 'button');
    deleteButton.setAttribute('name', 'del');
    deleteButton.setAttribute('value', '削除');
    deleteButton.onclick = this.delInputURL;
    urlSet.appendChild(newInputURL);
    urlSet.appendChild(deleteButton);
    inputContainer.append(urlSet);
    this.doChange();
  }

  delInputURL(e) {
    if(this.state.urlValues.length === 1) {
      return;
    }
    e.target.parentNode.remove();
    this.doChange();
  }

  resetRegist() {
    let registItemSets = document.querySelectorAll('.regist-item-set');

    registItemSets.forEach((value) => value.remove());
    this.addInputURL();
  }
  
  render() {
    return <li id="regist-url">
      <label for={this.props.name} className="item-bold item-title">{this.props.children}</label>
      <div id="input-url">
        <div className="regist-item-set">
          <input type={this.props.type} name={this.props.name} onChange={this.doChange/*this.props.onchange*/} value={this.state.urlValues[0].value} className={this.props.className} />
          <input type="button" name="del" value="削除" onClick={this.delInputURL} />
        </div>
      </div>
      <button type="button" onClick={this.addInputURL}>追加</button>
    </li>;
  };
}

export default EditURL;