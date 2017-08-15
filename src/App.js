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
    }
    this.changePage = this.changePage.bind(this);
  }

  changePage(page) {
    this.setState({page: page});
  }

  render() {
    let view;
    switch (this.state.page) {
      case 'Welcome': 
        view = <Welcome changePage={this.changePage}/>
        break;
      case 'OptionPage':
        view = <OptionPage />
        break;
      case 'ViewSnap':
        view = <ViewSnap />
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
