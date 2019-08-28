import React from 'react';
import { TabView } from '@components/widgets';
import { colors, measures } from '@common/styles';
import { WalletHome, PasswordManager, SendCoins, WalletExtract, WalletSettings, QRCodeScanner } from '../index';

export class WalletDetails extends React.Component {
    
    static navigationOptions = ({ navigation, screenProps }) => ({
        //title: navigation.state.params.wallet.name,
        title: 'deeID'
    });

    tabs = [
        { id: 'wallethome', label: 'Home', icon: 'home', content: <WalletHome {...this.props} /> },
        { id: 'passwordmanager', label: 'Passwords', icon: 'password', type: 'fa', content: <PasswordManager {...this.props} /> },
        { id: 'qrscanner', label: 'Payment', icon: 'qrcode', type: 'mdc', content: <QRCodeScanner {...this.props} /> },
        { id: 'qrscanner', label: 'Contacts', icon: 'cube-send', type: 'mdc', content: <QRCodeScanner {...this.props} /> },
        { id: 'settings', label: 'More', icon: 'settings', content: <WalletSettings {...this.props} /> }
    ];

    render() {
        return <TabView tabs={this.tabs} />
    }
}