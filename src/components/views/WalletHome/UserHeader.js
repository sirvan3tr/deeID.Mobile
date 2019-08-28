import React, { Component } from 'react';
import {
    StyleSheet, View, Dimensions, Image, Text, AsyncStorage,
    Animated, Platform, TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}
export default class UserHeader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            'userDetails' : 'tt'
        };
    }
    render() {
        AsyncStorage.getItem('userA', (err, result) => {
            this.setState({userDetails: JSON.parse(result) });
        });
        return (
            <View style={styles.cart_layout}>
                <LinearGradient colors={['#2278b3', '#697baf', '#e9969f']} style={styles.linearGradient}>
                <View style={styles.cart_detail}>
                
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                top: 15,
                                left: 30,
                                right: 0,
                                width: 70,
                                height: 70,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#FC5734', borderRadius: 10
                            }}>
                            <Image
                                source={require('../../media/img/dummy_icon.png')}
                            />
                            </View>
                        </View>
                        <Text style={{ color: '#fff', fontSize: 25, marginLeft: 70, }}>Hello {this.state.userDetails['firstname']} </Text>
                    </View>
                </View>
                </LinearGradient>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
      },
    cart_layout: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 160,
    },
    cart_detail: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 122,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',

    },
    icon_claw: {
        position: 'absolute',
        top: 2,
        bottom: 0,
        left: (Screen.width / 2) - 16,
        right: (Screen.width / 2) - 16,
        width: 32,
        height: 6,
    },
    icon_checkout: {
        width: 16,
        height: 16,
    },
    icon_cart: {
        width: 22,
        height: 23,
    },
})