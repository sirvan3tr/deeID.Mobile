import React from 'react';
import { Wallet as WalletUtils } from '@common/utils';
import { Wallets as WalletsActions } from '@common/actions';
import { Clipboard,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TextInput,
    Alert,
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
import almasFFSC from './ws2';
import { ConfirmDialog } from 'react-native-simple-dialogs';

@inject('wallet', 'wallets')
@observer
export class AlmasFFSProve extends React.Component {
    constructor(props) {
        super();
        this.state = {
            'url' : null,
            'authResult' : '',
            modalVisible: false,
            modalContent: '',
            dialogVisible: false,
            custFormDiag: false,
            text: '',
            textInput : []
        };
        this.wsFunc = new almasFFSC();
        WalletsActions.selectWallet(props.wallet)
        //debugger;
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
        var data = JSON.parse(this.state.url);
        let type = data.type;
        console.log(data);
        console.log(type);
        if (type == 'almasFFSRegister') {
            this.wsFunc.almasFFSSubmit(this.state.url);
        }else if(type == 'loginSig') {
            // !! need to change the button in the form
            this.setState({modalContent: 'site y wants to authenticate your account, would you like to sign in?'});
            this.setState({modalVisible: true});
        }else if(type == 'deeIDForm') {
            //this.setState({dialogVisible: true});
            this.setState({custFormDiag: true})
            this.formSign();
            /**
            Alert.alert(
                'Form Request',
                'Website X wants to access your payment information!',
                [
                  {text: 'Approve', onPress: () => this.formSign()},
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: true},
              );
              **/
        } else {
            //Alert.alert('Unknown message');
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
            //Alert('Message sent!');
        //} //- if
        
    }

    async formSign() {
        // Retrieve data from state stores
        /**
         * type, form_type, y, deeID, msg, sig
         */

        var event = JSON.parse(this.state.url),
            wsURL = event.ws_url,
            uID  = event.uID,
            expirytime = event.exp_time,
            y = event.y;

        if(event.form_type =='custom') {
            var form = event.form;
            let textInput = this.state.textInput;
            for(let i=0; i < form.length; i++) {
                textInput.push(<TextInput
                    style = {styles.input}
                    placeholder={form[i][1]} />);
            }
            this.setState({ textInput });
        } else {
            console.log("RUNNING FORMSIGN() -----");
                
            // verify signature
            // check if public-key and domain are correct

            // Get the payment info and send it over

            // Serialisation
            // if (uID.length == 36) {
                // Open new websocket
                var ws = new WebSocket(wsURL);
                console.log(wsURL);
                var deeID = '0xa78e5bb6ff6a849e120985d32532e5067f262e19';

                // form data:
                // need to fetch this from a database
                // need to encrypt this data
                const data = {
                    'card_num': '456523453567643',
                    'exp_date': '04/24',
                    'cvv': '983'
                };

                const msg = uID + deeID + expirytime + y + data;
                const { item } = this.props.wallet;
                // let flatSig = await item.signMessage(msg);
                let flatSig = '35';

                ws.onopen = () => {
                    var payload = JSON.stringify({
                        'type': 'deeIDForm',
                        'uID': uID,
                        'y': y,
                        'deeID': deeID,
                        'exp_time': '',
                        'data': data,
                        'msg': msg,
                        'sig' : flatSig
                    });

                    ws.send(payload);
                };
        }
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
                <ConfirmDialog
                    visible={this.state.dialogVisible}
                    title="Data Request"
                    onTouchOutside={() => this.setState({dialogVisible: false})}
                    positiveButton={{
                        title: "Confirm & Approve",
                        onPress: () => this.formSign()
                    }}
                    negativeButton={{
                        title: "Cancel",
                        onPress: () => this.setState({dialogVisible: false})
                    }} >
                    <View>
                        <Image
                            source={require('../../media/img/cc.jpg')}
                        />
                        <Text>A website is requesting your payment information. Type in their URL below to confirm.</Text>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            placeholder="Type URL/Domain here...!"
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                        />
                    </View>
                </ConfirmDialog>

                <ConfirmDialog
                    visible={this.state.custFormDiag}
                    title="Custom form"
                    onTouchOutside={() => this.setState({custFormDiag: false})}
                    positiveButton={{
                        title: "Send",
                        onPress: () => this.formSign()
                    }}
                    negativeButton={{
                        title: "Cancel",
                        onPress: () => this.setState({custFormDiag: false})
                    }} >
                    <View>
                    {this.state.textInput.map((value, index) => {
                        return value
                    })}
                    </View>
                </ConfirmDialog>

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
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
     }
});