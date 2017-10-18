import React, { Component } from 'react';
import { 
  View,
  WebView
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class HomePage extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'http://192.168.0.105'}}
      />
    );
  }
}