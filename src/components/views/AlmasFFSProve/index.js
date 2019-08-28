import React from 'react';
import { Clipboard,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Image,
    Share,
    Dimensions,
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
export class AlmasFFSProve extends React.Component {
    constructor(props) {
        super();
        this.state = {
            'url' : null,
            'authResult' : '',
            modalVisible: false,
            modalContent: ''
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
        var data = JSON.parse(this.state.url),
            type = data['type'];

        console.log(type);
        if (type == 'almasFFSRegister') {
            this.wsFunc.almasFFSSubmit(this.state.url);
        }else if(type == 'loginSig') {
            this.setState({modalContent: 'site y wants to authenticate your account, would you like to sign in?'});
            this.setState({modalVisible: true});
        } else {
            Alert('Unknown message');
        }
    }

    async ethSign() {
        // Retrieve data from state stores
        var event = JSON.parse(this.state.url),
            wsURL = event['wsURL'],
            uID  = event['uID'],
            expirytime = event['expirytime'],
            data = event['data'];
            

        console.log('ethSign is active');
        console.log(uID.length);
        // Serialisation
       // if (uID.length == 36) {
            // Open new websocket
            var ws = new WebSocket(wsURL);
            var deeID = '0xa78e5bb6ff6a849e120985d32532e5067f262e19';
            const msg = uID + deeID + expirytime + data;
            const { item } = this.props.wallet;
            let flatSig = await item.signMessage(msg);

            ws.onopen = () => {
                var payload = JSON.stringify({
                    'type': 'loginSig',
                    'uID': uID,
                    'deeID': deeID,
                    'expirytime': '',
                    'data': event['data'],
                    'msg': msg,
                    'signature' : flatSig
                });

                ws.send(payload);
            };
            this.setState({modalVisible: false});
            alert('Message sent!');
        //} //- if
        
    }

    renderColumn = (icon, label, action) => (
        <TouchableWithoutFeedback onPress={action}>
            <View style={styles.actionColumn}>
                <Icon name={icon} style={styles.actionIcon} />
                <Text style={styles.actionLabel}>{label}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    async onBarCodeReadFx(data) {
        console.log(data);
        this.setState({ url: data });
        this.initiateProof();
    }

    render() {
        if (this.wsFunc.status == "Pass") {
            alert("Successful Authentication!");
        } else if(this.wsFunc.status == "Fail") {
            alert("Unsuccessful Authentication :(");
        }
        const { wallet: { item } } = this.props;
        return (
            <View style={styles.container}>

                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.accessmodal}>
                    <View style={styles.modalContents}>
                        <Text>{this.state.modalContent}</Text>
                        <TouchableHighlight>
                        <Button
                            onPress={() => {
                            this.ethSign();
                            }}
                            title="Allow"
                            accessibilityLabel="Allow" />
                        </TouchableHighlight>
                        <TouchableHighlight>
                        <Button
                            onPress={() => {
                            this.setModalVisible(false);
                            }}
                            title="Don't Allow"
                            accessibilityLabel="Don't Allow" />
                        </TouchableHighlight>
                    </View>
                </View>
                </Modal>
            <View style={styles.qrButton}>
            <TouchableOpacity onPress={() => this.refs.camera.show()}>
                <Image
                    source={require('../../media/img/qr_button.png')}
                />
            </TouchableOpacity>
            </View>
            <Text style={styles.centered}>{this.wsFunc.status}</Text>
            <Camera
                ref='camera'
                modal
                onClose={() => this.refs.camera.hide()}
                onBarCodeRead={data => this.onBarCodeReadFx(data)}/>
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
    qrButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        bottom: 20,
        left: Dimensions.get('window').width - 70,
        zIndex: 100,
    },
    accessmodal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor:'rgba(0,0,0,0.7)'
    },
    modalContents: {
        flex: 1,
        padding:20,
    },
    container: {
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