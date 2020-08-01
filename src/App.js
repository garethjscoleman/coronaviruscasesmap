import React, { Component } from 'react';
import logo from './logo.svg';
import {Dashboard} from './Components/dashboard';
import {Footer} from './Components/footer';
import {Header} from './Components/header';

import './App.css';

function App() {
  let footerTitle = "Gareth Coleman"
  return (
    <div className="App">
      <Header title="Coronavirus Case Rate in the last 5-10 days by Local Authority"></Header>
      <Dashboard ></Dashboard>
      <Footer title={footerTitle}></Footer>
    </div>
  );
}

export default App;
