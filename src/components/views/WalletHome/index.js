import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Button,
  View,
  Dimensions,
  AsyncStorage,
  TouchableHighlight,
  StatusBar,
  ScrollView
} from 'react-native';
import { Wallet as WalletUtils } from '@common/utils';
import { Wallets as WalletsActions } from '@common/actions';
import { AlmasFFSProve, SendCoins, WalletExtract, WalletSettings, QRCodeScanner } from '../index';
import UserHeader from './UserHeader'

import Drawer from 'react-native-draggable-view'

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 4.778 / 10.417);
const imageWidth = dimensions.width;

const styles = StyleSheet.create({
    container: {
    },
    cover: {
        width: imageWidth,
        height: imageHeight
    },
    qrButton: {
        marginTop: 250
    }
});

export class WalletHome extends Component {
    
    static navigationOptions = { title: 'Load Wallet' };
    
    render() {

        return (
            <View>
            <View>
                <UserHeader />
            </View>
            <View style={styles.qrButton}>
                <AlmasFFSProve />
            </View>
            </View>
        )
    }
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#D8D8D8",
                }}
            />
        );
    };
}