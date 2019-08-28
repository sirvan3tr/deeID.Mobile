import React from 'react';
import { StyleSheet, Text, View, ListView, AsyncStorage} from 'react-native';
import { Button } from '@components/widgets';
import { colors, measures } from '@common/styles';
import autobind from 'autobind-decorator';

import Row from './Row';
import { set } from 'sinon/lib/sinon/match';
//import console = require('console');

export class PasswordManager extends React.Component {
    
    static navigationOptions = { title: 'Load Wallet' };

    constructor(props) {
        super(props);

        this.state = {
            dataSource: 'nothing',
        };

        AsyncStorage.getItem('passwords', (err, result) => {
            set.state({datasource: JSON.parse(result)});
            console.log(result);
        });

    }

    @autobind
    addPassword(url, name, username, pass, notes) {
        
        const newPassword = {
            url: url,
            name: name,
            username: username,
            password: pass,
            notes: notes,
            timestamp: Date.now()
        };

        AsyncStorage.getItem('passwords', (err, result) => {
            if(result != undefined) {
                result = JSON.parse(result);
                result[result.length + 1] = newPassword;
                AsyncStorage.setItem('passwords', JSON.stringify(result), () => {

                });
            } else {
                result = [
                    {
                        url: url,
                        name: name,
                        username: username,
                        password: pass,
                        notes: notes,
                        timestamp: Date.now()
                    }
                ];

                AsyncStorage.setItem('passwords', JSON.stringify(result), () => {
                });
            }

        });
    }

    render() {
        const { navigate, state: { params: { walletName, walletDescription } } } = this.props.navigation;
        return (
                <View style={styles.container}>
                    <Text style={styles.message}>Load the wallet from</Text>
                    <View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(data) => <Row {...data} />}
                    />
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Button
                            children="Add new login details"
                            onPress={() => navigate('LoadPrivateKey', { walletName, walletDescription })} />
                        <Button
                            children="Mnemonics"
                            onPress={() => navigate('LoadMnemonics', { walletName, walletDescription })} />
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.defaultBackground,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flex: 1,
        padding: measures.defaultPadding,
    },
    message: {
        color: colors.black,
        fontSize: 16,
        textAlign: 'center',
        margin: measures.defaultMargin * 4,
    },
    buttonsContainer: {
        justifyContent: 'space-between'
    }
});