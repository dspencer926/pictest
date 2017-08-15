import React, { Component } from 'react';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      media: null,
      header: <h1> Welcome to Keshot </h1>,
      btnText: "Let's Go!",
      status: 'welcome',
      photoType: null,
      optionBox: null,
      videoDimensions: {},
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.snapMode = this.snapMode.bind(this);
    this.takePic = this.takePic.bind(this);
    this.singleShot = this.singleShot.bind(this);
    this.gifShot = this.gifShot.bind(this);
    var cam;
    var video;
  }

  componentDidMount() {
    if(navigator.mediaDevices) {
      console.log('getUserMedia supported');
      this.setState({media: true}, () => {
        let constraints = {video: true};
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          this.video = document.getElementById('video');
          this.setState({videoDimensions: {
            height: this.video.height,
            width: this.video.width,
          }})
          this.cam = window.URL.createObjectURL(stream)
          this.video.src = this.cam;
          this.video.play();
        })
      })
    } else {
      this.setState({media: false})
    }
  }

  snapMode(mode) {
    this.setState({
      photoType: mode,
    }, () => {
      this.changeStatus('snap');
    })
  }

  changeStatus(status) {
    this.setState({status: status}, () => {
      switch (this.state.status) {
        case 'options': 
        this.video = document.getElementById('video');
        this.setState({
          optionBox: 
          <div id='option-box'> 
            <button id='single-option' className='option-btn' onClick={() => {this.snapMode('single')}}> Single Picture </button>
            <button id='gif-option' className='option-btn' onClick={() => {this.snapMode('gif')}}> GIF </button>
          </div>    
        })
        break;
        case 'snap': 
          this.setState({
            optionBox: false,
            btnText: 'Take Picture!',
          });
          break;
      } 
    });
  }

  takePic() {
    if (this.state.photoType === 'single') {
      this.singleShot();
    } else if (this.state.photoType === 'gif') {
      this.gifShot();
    }
  }

  singleShot() {
    console.log('single shot');
    this.video.pause();
    if (window.confirm('like?')) {
      let canv = document.getElementById('canv');
      canv.width = this.state.videoDimensions.width;
      canv.height = this.state.videoDimensions.height;
      console.log(canv.width, canv.height);
      canv.getContext('2d').drawImage(this.video, 0, 0);
      let jpeg = canv.toDataURL("image/jpeg");
      // let file = new File(jpeg, 'newPic.jpg');
      let div = document.getElementById('welcome');
      let a = document.createElement('a');
      a.innerHTML = 'download!!!!!!';
      a.href = jpeg;
      a.download = 'newPic.jpg';
      div.appendChild(a);
    } else {
      this.video.play();
    }
  }

  gifShot() {
    console.log('gif shot');
  }





  render() {
    let view;
    switch (this.state.media) {
      case null: 
        view = <p> Loading </p>
        break;
      case false:
        view = <p> Problem loading camera </p>
        break;
      case true: 
        view = 
      <div className='flex-col'>
        <div id='video-div'>
          {this.state.optionBox}
          <video id="video" width="640" height="480" autoPlay></video>
        </div>
        <button id='go-btn' className='btn' onClick={this.state.status === 'snap' ? () => this.takePic() : () => this.changeStatus('options')}> {this.state.btnText} </button>
        <canvas id='canv'></canvas>
      </div>
      }
    return (
      <div id="welcome" className='flex-col'>
        {this.state.header}
        {view}
      </div>
    );
  }
}

export default Welcome;
