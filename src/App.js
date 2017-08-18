import React, { Component } from 'react';
import './App.css';
import Welcome from './component/Welcome';
import OptionPage from './component/OptionPage';
import ViewSnap from './component/ViewSnap';
import AfterSnap from './component/AfterSnap';
import Result from './component/Result';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: null,
      page: 'Welcome',
      photoURL: null,
    }
    this.changePage = this.changePage.bind(this);
    this.setPhotoURL = this.setPhotoURL.bind(this);
  }

  changePage(page) {
    this.setState({page: page});
  }

  setPhotoURL(url) {
    this.setState({
      photoURL: url,
      page: 'AfterSnap',
    }, () => {
      console.log(this.state);
      console.log('pic set?');
    })
  }


  render() {
    let view;
    switch (this.state.page) {
      case 'Welcome': 
        view = <Welcome 
          changePage={this.changePage}
          setPhotoURL={this.setPhotoURL}
          />
        break;
      case 'AfterSnap':
        view = <AfterSnap 
          photoURL={this.state.photoURL}
          />
        break;
      case 'AfterSnap':
        view = <ViewSnap />
        break;
      case 'Result':
        view = <ViewSnap />
        break;
      }
    return (
      <div className="App">
        {view}
      </div>
    );
  }
}

export default App;
