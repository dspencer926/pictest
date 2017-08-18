import React, { Component } from 'react';

class Buttons extends Component {
  constructor() {
    super();
    this.state = {
      mode: null,
    }
  }


  render() {
    let btnDisplay;
    switch (this.props.btnStatus) {
      case 'noBtns':
        btnDisplay = null;
        break;
      case 'letsGo': 
        btnDisplay = 
        <button id='go-btn' className='btn' onClick={() => {this.props.changeStatus('options')}}> Let's Go! </button>
        break;
      case 'takePic':
        btnDisplay = 
        <button id='go-btn' className='btn' onClick={this.props.takePic}> Take Picture </button>
        break;
      case 'confirm':
       btnDisplay = 
       <div id='two-btns'>
          <button id='retake-btn' className='btn' onClick={this.props.retake}> Retake </button>
          <button id='continue-btn' className='btn' onClick={this.props.confirmPic}> Create Download Link </button>
        </div>
        break;
    }

    return (
      <div id='button-container'>
        {btnDisplay}
      </div>
    );
  }
}

export default Buttons;
