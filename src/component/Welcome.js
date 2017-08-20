import React, { Component } from 'react';
import Buttons from './Buttons';
import gifShot from 'gifshot';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      media: null,                                                        //  is mediaDevices available? T/F
      cameraStream: null,                                                 //  data URL for camera stream
      videoElement: null,                                                 //  grab video element
      header: 'Welcome to Keshot',                                         //  message at top of screen
      status: 'welcome',                                                  //  status of page (what screen to show)
      btnStatus: 'letsGo',                                                //  status of buttons (what buttons to show)
      photoType: null,                                                    //  'single' / 'gif'
      optionBox: null,                                                    //  photoType option box HTML
      videoDimensions: {},                                                //  dimensions to use for canvas
      countDown: false,                                                   //  counting down to take picture? T/F
      count: null,                                                        //  number shown for count
      photoArray: [],                                                     //  array of photos to make GIF
      gifConfirm: false,                                                  //  GIF confirm screen T/F 
      currentGif: null,                                                   //  GIF result 

    };  
    this.videoInitialize = this.videoInitialize.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.snapMode = this.snapMode.bind(this);
    this.takePic = this.takePic.bind(this);
    this.retake = this.retake.bind(this);
    this.singleShot = this.singleShot.bind(this);
    this.gifPic = this.gifPic.bind(this);
    this.confirmPic = this.confirmPic.bind(this);
    var video;
  }

  componentDidMount() {                                           //  check userMedia and initialize video
    if(navigator.mediaDevices) {
      console.log('getUserMedia supported');
      this.setState({media: true}, () => {
        this.videoInitialize();
      })
    } else {
      this.setState({media: false})
    }
  }

  videoInitialize() {                                             //  connect video element to stream from camera
    let constraints = {video: true};
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.setState({
        cameraStream: window.URL.createObjectURL(stream),
      })
      this.video = document.getElementById('video');
      this.setState({videoDimensions: {
        height: this.video.height,
        width: this.video.width,
      }})
      this.video.play();              
    })
  }

  snapMode(mode) {                                                 // set state with photo type ('single' or 'gif')
    this.setState({
      photoType: mode,
    }, () => {
      this.changeStatus('snap');
    })
  }

  changeStatus(status) {                                          //  changes state status :
    this.setState({status: status}, () => {                       //  'options': display options box
      switch (this.state.status) {                                //  'snap': take picture
        case 'options': 
        console.log('changeStatus');
        console.log(this.state);
        this.setState({
          header: 'Select Type',
          optionBox: 
          <div id='option-box'> 
            <button id='single-option' className='option-btn' onClick={() => {this.snapMode('single')}}> Single Picture </button>
            <button id='gif-option' className='option-btn' onClick={() => {this.snapMode('gif')}}> GIF </button>
          </div>    
        })
        break;
        case 'snap':                                              
          this.setState({             //  should I move this to snapMode function and delete here?
            header: 'Take Your Picture!',     
            optionBox: null,
            btnStatus: 'takePic',
          });
          break;
        case 'confirm':
          this.setState({

          });
          break;
      } 
    });
  }

  takePic() {                                                         // router for picture taking (single/gif)
    if (this.state.photoType === 'single') {
      this.singleShot();
    } else if (this.state.photoType === 'gif') {
      this.gifPic();
    }
  }

  singleShot() {                                                      // takes single picture
    this.setState({
      countDown: true,
      btnStatus: 'noBtns',
    }, () => {
      let i = 3
      let countInterval = setInterval(()=> {
        this.setState({
          count: i
        }, () => {
            i--;
          })
        if (i < 0) {
          this.setState({
            count: null,
          }, () => {
            clearInterval(countInterval);
            this.video.pause();
            this.setState({
              header: 'Download or Retake!',
              status: 'confirm',
              btnStatus: 'confirm',
            });
          });
        }
      }, 1000);
    })
  }

  async gifPic() {
    this.setState({
      countDown: true,
      btnStatus: 'noBtns',
    })                                                   // takes gif
    let gifShots = () => {
      return new Promise((resolve) => {
        let i = 3
        let countInterval = setInterval(()=> {
          this.setState({
            count: i
          }, () => {
            i--;
          })
          if (i < 0) {
            this.setState({
              count: null,
            }, () => {
              clearInterval(countInterval);
              let canv = document.getElementById('canv');
              let startX = -((this.state.videoDimensions.width - this.state.videoDimensions.height) / 2);
              canv.getContext('2d').drawImage(this.video, startX, 0);
              let jpeg = canv.toDataURL("image/jpeg");

              this.setState((prevState) => {return {
                photoArray: prevState.photoArray.concat(jpeg),
              }}, () => {
                console.log(this.state.photoArray);
                let canvases = document.querySelectorAll('.miniPic');
                console.log(canvases)
                let newCanv = canvases[canvases.length-1];
                console.log(newCanv);
                newCanv.getContext('2d').drawImage(canv, 0, 0, newCanv.width, newCanv.height)
              })
              resolve(jpeg);
            });
          }
        }, 500);
      })
    }
    for (let j = 0; j < 4; j++) {
      await gifShots();
    }
    let gifArray = this.state.photoArray;
    gifShot.createGIF({
      'images': gifArray,
      'interval': 0.3,
      'gifWidth': 480,
      'gifHeight': 480,
    },(obj) => {
      if(!obj.error) {
        this.setState({
          gifConfirm: true,
          header: 'Download or Retake!',
          btnStatus: 'confirm',
          currentGif: obj.image,
        })
      }
    });
    return gifArray;
  }

  retake() {                                                                  //  retake pic (single or gif)
    if (this.state.gifConfirm) {
      let animatedGif = document.getElementById('animated-gif');
      animatedGif.remove();
      document.querySelectorAll('.miniPic').forEach((val) => {
        val.remove();
      })
    }
    this.setState({
      countDown: false,
      gifConfirm: false,
      btnStatus: 'takePic',
    }, () => {
      document.querySelectorAll('a').forEach((val) => {
        val.remove();
      })
      this.videoInitialize();
      this.changeStatus('snap');
      console.log(this.state);
    })
  }

  confirmPic() {                                             //  confirm user likes pic, prepare download link
    let canv = document.getElementById('canv');
    canv.width = this.state.videoDimensions.height;
    canv.height = this.state.videoDimensions.height;
    console.log(this.state);
    let startX = -((this.state.videoDimensions.width - this.state.videoDimensions.height) / 2);
    console.log(startX);
    canv.getContext('2d').drawImage(this.video, startX, 0);
    let jpeg = canv.toDataURL("image/jpeg");
    // this.props.setPhotoURL(jpeg);
    // let file = new File(jpeg, 'newPic.jpg');
    let div = document.getElementById('two-btns');
    let a = document.createElement('a');
    a.innerHTML = 'download!!!!!!';
    console.log(this.state.photoType)
    if (this.state.photoType === 'gif') {
      this.setState({
        toDownload: this.state.currentGif,
        fileName: 'newGif.gif',
      })
      a.href = this.state.currentGif;
      a.download = 'newGif.gif';
    } else if (this.state.photoType === 'single') {
      this.setState({
        toDownload: this.state.currentGif,
        fileName: 'newGif.gif',
      })
      a.href = jpeg;
      a.download = 'newPic.jpg';
    }
    div.appendChild(a);
  }


  render() {
    let view;
    let btnBox;
    switch (this.state.media) {
      case null: 
        view = <p> Loading </p>
        break;
      case false:
        view = <p> Problem loading camera </p>
        break;
      case true: 
        btnBox = 
        <Buttons 
          btnStatus={this.state.btnStatus}
          takePic={this.takePic}
          changeStatus={this.changeStatus}
          retake={this.retake}
          confirmPic={this.confirmPic}
          toDownload={this.state.toDownload}
          fileName={this.state.fileName}
        />
        view = 
          <div className='flex-row'>
            <div id='gif-column' className='flex-col'>
              {this.state.photoArray.map((val, key) => {
                let canv = document.getElementById('canv');
                return (
                  <canvas 
                    key={val}
                    height={(canv.height / 4) - 10}
                    width={(canv.width / 4) - 10}
                    className='miniPic' 
                  />
                )
              })}
            </div>
            <div>
              <div id='video-or-gif'>
              {this.state.gifConfirm ? <div id='gif-result'><img id='animated-gif' src={this.state.currentGif}></img></div> :
              <div id='video-div'>
                {this.state.optionBox}
                {this.state.countDown ? <div id='countdown-box'>{this.state.count}</div> : null}
                <video id="video" width="640" height="480" src={this.state.cameraStream} autoPlay></video>
              </div>
              }
              </div>
              <canvas id='canv' 
                style={{display: 'none'}}
                width={this.state.videoDimensions.height}
                height={this.state.videoDimensions.height}></canvas>
            </div>
          </div>
      }
    return (
      <div id="welcome" className='flex-col'>
        <h1>{this.state.header}</h1>
        {view}
        {btnBox}
      </div>
    );
  }
}

export default Welcome;
