import React, { Component } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TextInput,
  Alert, 
  Button, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

class ActivateHeader extends Component {
  render() {
    return (
      <Text style={{
        fontSize: 30, 
        textAlign: 'center', 
        alignSelf: 'center',
        color: '#fff', 
        paddingTop: '18%', 
        marginBottom: 20}}>{this.props.text}</Text>
    );
  }
}

class ActivateHintText extends Component {
  render() {
    return (
      <Text style={{
        fontSize: 20, 
        lineHeight: 30,
        textAlign: 'center', 
        alignSelf: 'center',
        width: '80%',
        color: '#ccc'}}>{this.props.text}</Text>
    );
  }
}

class BottomClickable extends Component {
  render() {
    return (
      <View style={{
        backgroundColor: '#777',
        borderTopWidth: 1,
        borderTopColor: '#333',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
      }}>
        <Button title={this.props.text}
          color="#ececec" 
          onPress={this.props.onPress} />
      </View>
    );
  }
}

class DeviceClickable extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress.bind(null, this.props.device)} style={{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 7,
        paddingBottom: 7,
      }}>
        <Text style={{color: '#fff', fontSize: 15, textAlign: 'center'}}>{this.props.device.name}</Text>
      </TouchableOpacity>
    );
  }
}

export class ActivateGuidePage extends Component {
  render() {
    return (
      <View style={{flex: 1, height: '100%'}}>
        <View style={{backgroundColor: '#343434', }}>
          <ActivateHeader text="添加机器人" />
          <ActivateHintText text="请选择你要添加的开发板类型" />
        </View>
        <View style={{
          flex: 1,
          backgroundColor: '#343434',
          paddingTop: 50,
        }}>
          <TouchableOpacity style={{
            backgroundColor: '#fff',
            borderRadius: 5,
            paddingTop: 40,
            paddingBottom: 40,
            marginLeft: '5%',
            width: '90%',
          }} onPress={Actions.ActivatePowerHint}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>All-in-one 全栈开发板</Text>
          </TouchableOpacity>
        </View>
        <BottomClickable onPress={() => false} text="获取若琪开发板" />
      </View>
    );
  }
}

export class ActivatePowerHintPage extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#343434'}}>
        <View style={{flex: 1}}>
          <ActivateHeader text="接上电源" />
          <ActivateHintText text="请帮我接上电源，开机后，我将出现蓝色光圈" />
        </View>
        <BottomClickable text="已出现蓝色光圈" onPress={Actions.ActivateLightHint} />
      </View>
    );
  }
}

export class ActivateLightHintPage extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#343434'}}>
        <View style={{flex: 1}}>
          <ActivateHeader text="等待出现橙色灯光闪烁" />
          <ActivateHintText text="初始化大约需要两分钟" />
        </View>
        <BottomClickable text="已出现橙色灯光闪烁" onPress={Actions.ActivateDiscovery} />
      </View>
    );
  }
}

export class ActivateDiscoveryPage extends Component {
  constructor() {
    super();
    this._bleMgr = new BleManager();
    this.state = {
      loading: false,
      devices: [],
    };
  }
  componentDidMount() {
    const subscription = this._bleMgr.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.scan();
        subscription.remove();
      } else if (state === 'PoweredOff') {
        this.reportOpenBluetooth();
      }
    }, true);
  }
  scan() {
    this.setState({
      loading: true,
    });
    this._bleMgr.startDeviceScan(null, null, (err, device) => {
      if (err || !device.name || this.findDeviceByName(device.name))
        return;
      const newDevices = this.state.devices.push(device);
      this.setState({
        device: newDevices
      });
    });
  }
  findDeviceByName(name) {
    let device;
    for (let i = 0; i < this.state.devices.length; i++) {
      if (this.state.devices[i].name === name) {
        device = this.state.devices[i];
        break;
      }
    }
    return device;
  }
  reportOpenBluetooth() {
    Alert.alert('请打开设备蓝牙');
  }
  async onPressDeviceItem(device) {
    this._bleMgr.stopDeviceScan();
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      await device.characteristicsForService('4000');
      Actions.ActivateConfigure({
        device,
      });
    } catch (err) {
      Alert.alert('不是正确的设备');
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#343434'}}>
        <View>
          <ActivateHeader text="连接蓝牙" />
          <ActivateHintText text="请确保手机蓝牙打开，选择需要连接的设备" />
        </View>
        <ScrollView style={{
          flex: 1, 
          width: '60%', 
          marginLeft: '20%', 
          marginTop: '5%', 
          paddingTop: 10, 
          paddingBottom: 10}}>
          {this.state.devices.map((device, index) => {
            return <DeviceClickable key={index} device={device} onPress={this.onPressDeviceItem.bind(this)} />;
          })}
        </ScrollView>
        <View style={{paddingTop: 20, paddingBottom: 20, marginBottom: 50}}>
          <Text style={{fontSize: 15, textAlign: 'center', color: '#fff'}}>请前往手机-设置-蓝牙-打开蓝牙</Text>
        </View>
      </View>
    );
  }
}

export class ActivateConfigurePage extends Component {
  static styles = {
    input: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      margin: 10,
      width: '70%',
      alignSelf: 'center',
      fontSize: 20,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      ssid: null,
      psk: null,
    };
  }
  componentDidMount() {
    Actions.refresh({
      rightTitle: '连接',
      onRight: this.configure.bind(this),
    });
  }
  async configure() {
    if (!this.state.ssid) {
      return Alert.alert('WIFI名称不能为空');
    }
    try {
      const device = this.props.device;
      const result = { ssid: this.state.ssid, psk: this.state.psk };
      const data = new Buffer(JSON.stringify(result)).toString('base64');
      device.writeCharacteristicWithResponseForService('4000', '9745', data);
      // redirect to homepage when networking is configured
      Actions.Home();
    } catch (err) {
      Alert.alert('配网过程出错，请重试一次，或者换一个设备再试一下');
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#343434'}}>
        <View>
          <ActivateHeader text="配置网络" />
          <ActivateHintText text="请输入您的WIFI名称和密码" />
        </View>
        <View style={{flex: 1, marginTop: '5%'}}>
          <TextInput
            onChangeText={(val) => this.setState({ ssid: val })}
            style={ActivateConfigurePage.styles.input} 
            placeholder="WIFI名称" />
          <TextInput 
            onChangeText={(val) => this.setState({ psk: val })}
            style={ActivateConfigurePage.styles.input} 
            placeholder="密码" 
            secureTextEntry={true} />
        </View>
      </View>
    );
  }
}



