import React from 'react';
import { Clipboard,
    TouchableHighlight,
    TextInput,
    Share,
    Button,
    StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import autobind from 'autobind-decorator';
import QRCode from 'react-native-qrcode-svg';
import Snackbar from 'react-native-snackbar';
import { Icon, Camera, InputWithIcon } from '@components/widgets';
import { colors, measures } from '@common/styles';
import almasFFSC from './ws';



@inject('wallet')
@observer
export class QRCodeScanner extends React.Component {
    constructor(props) {
        super();
        this.state = {
            'url' : null,
            'authResult' : '',
        };
        this.wsFunc = new almasFFSC();
    }

    @autobind
    copyToClipboard() {
        const { item } = this.props.wallet;
        Clipboard.setString(item.getAddress());
        Snackbar.show({
            title: 'Copied to clipboard.',
            duration: Snackbar.LENGTH_SHORT
        });
    }

    @autobind
    share() {
        const { item } = this.props.wallet;
        Share.share({
            title: 'Wallet address:',
            message: item.getAddress()
        });
    }

    @autobind
    initiateProof() {
        this.wsFunc.almasFFSSubmit(this.state.url);
    }

    renderColumn = (icon, label, action) => (
        <TouchableWithoutFeedback onPress={action}>
            <View style={styles.actionColumn}>
                <Icon name={icon} style={styles.actionIcon} />
                <Text style={styles.actionLabel}>{label}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    render() {
        if (this.wsFunc.status == "Pass") {
            alert("Successful Authentication!")
        }
        const { wallet: { item } } = this.props;
        return (
            <View style={styles.container}>
            <Text style={styles.centered}>Enter or scan the request url:</Text>
            <InputWithIcon
                ref='input'
                icon='qr-scanner'
                placeholder='eg.: https://omnee.me/almasFFS'
                onChangeText={url => this.setState({ url })}
                onPressIcon={() => this.refs.camera.show()} />
            <TouchableHighlight>
                <Button onPress={this.initiateProof}            
                    title="Submit URL"
                    accessibilityLabel="Submit URL" /> 
            </TouchableHighlight>
            <Text style={styles.centered}>{this.wsFunc.status}</Text>
            <Camera
                ref='camera'
                modal
                onClose={() => this.refs.camera.hide()}
                onBarCodeRead={data => this.refs.input.onChangeText(data)}/>
            <Text style={styles.centered}>{this.state.authResult}</Text>
                <Text style={styles.centered}>This is the Fiat-Shamir Cryptosystem, your identity such as name, place of birth and date of birth represent a sort of public key. Therefore, an automatic method of authentication.</Text>
                <Text style={styles.centered}>{item.getAddress()}</Text>
                <View style={styles.actions}>
                    <View style={styles.actionsBar}>
                        {this.renderColumn('copy', 'Copy', this.copyToClipboard)}
                        {this.renderColumn('share', 'Share', this.share)}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        padding: measures.defaultPadding
    },
    actions: {
        height: 56
    },
    actionsBar: {
        flexDirection: 'row',
        flex: 3
    },
    actionColumn: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centered: {
        alignSelf: 'center'
    }
});