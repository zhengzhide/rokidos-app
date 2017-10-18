import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { 
  ActivateGuidePage, 
  ActivatePowerHintPage, 
  ActivateLightHintPage, 
  ActivateDiscoveryPage,
  ActivateConfigurePage
} from './components/ActivatePage';
import HomePage from './components/HomePage';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="ActivateGuide" 
            component={ActivateGuidePage} hideNavBar initial={true} />
          <Scene key="ActivatePowerHint"
            component={ActivatePowerHintPage} />
          <Scene key="ActivateLightHint"
            component={ActivateLightHintPage} />
          <Scene key="ActivateDiscovery"
            component={ActivateDiscoveryPage} />
          <Scene key="ActivateConfigure"
            component={ActivateConfigurePage} />
          <Scene key="Home" component={HomePage} />
        </Scene>
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
