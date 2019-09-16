import React from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View, AsyncStorage } from 'react-native';
import autobind from 'autobind-decorator';
import { Button, Camera, InputWithIcon } from '@components/widgets';
import { colors, measures } from '@common/styles';
import { Wallet as WalletUtils } from '@common/utils';
import { Wallets as WalletsActions } from '@common/actions';

export class LoadProfile extends React.Component {
    
    static navigationOptions = { title: 'Load Profile via QR Code' };

    state = { data: '' };

    @autobind
    async onPressOpenWallet(pk, walletName, walletDescription, almasFFS, type, mod, other) {
        try {
            const wallet = WalletUtils.loadWalletFromPrivateKey(pk);
            await WalletsActions.addWallet(walletName, wallet, walletDescription, almasFFS, type, mod, other);
            this.props.navigation.navigate('WalletDetails', { wallet, replaceRoute: true });
            await WalletsActions.saveWallets();
        } catch (e) {
            console.warn(e);
        }
    }

    @autobind
    initProfile() {
        if (!this.state.data) return;
        try {
            /*
            pk = ethereum private key

            Fiat-Shamir CryptoSystem:
                S = Fiat-Shamir Private Key
                I = Identity string
                J = random j indices for above id
                n = global modulus
            */

            // Parse the data as JSON from the QR code.
            console.log(this.state.data);
            data = this.state.data;

            /*
            Format of the Imported JSON:

            data = {
                type: 'deeIDProfile'
                ver: 0.1
                pk:
                S:
                I:
                J:
                n:
                deeID:
                userInfo: {
                    firstname: ''
                    surname: ''
                    dob: ''
                    placeOfBirth: ''
                    email: [{
                        title:
                        email:
                    }]
                    tel: [{
                        title:
                        tel:
                    }]
                }
            }
            
            */
            const walletName = 'User A Wallet',
            walletDescription = 'Imported wallet';

            
            // Store the user in the database
            AsyncStorage.setItem('userA', JSON.stringify(data.userInfo), () => {
                AsyncStorage.getItem('userA', (err, result) => {
                    console.log(result);
                });
            });

            // save the pk into a wallet, will redirect to wallet overview too
            this.onPressOpenWallet(data.pk, walletName, walletDescription, data.S, 'both', data.n, data.J);
        } catch (e) {
            console.warn(e);
        }
    }

    render() {
        console.log(data);
        return (
            <View style={styles.container}>
                <View style={styles.body}>
                    <Text style={styles.message}>Profile data</Text>
                    <InputWithIcon
                        ref='input'
                        icon='qr-scanner'
                        placeholder='Load your profile'
                        onChangeText={data => this.setState({ data })}
                        onPressIcon={() => this.refs.camera.show()} />
                </View>
                <View style={styles.buttonsContainer}>
                    <Button
                        children='Import profile'
                        onPress={this.initProfile} />
                </View>
                <Camera
                    ref='camera'
                    modal
                    onClose={() => this.refs.camera.hide()}
                    onBarCodeRead={e => this.refs.input.onChangeText(e)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.defaultBackground,
        padding: measures.defaultPadding
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    message: {
        color: colors.black,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: measures.defaultMargin,
        marginHorizontal: 32
    },
    buttonsContainer: {
        width: '100%',
        justifyContent: 'space-between',
        height: 52
    }
});