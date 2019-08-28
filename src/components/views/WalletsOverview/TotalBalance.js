import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import ethers from 'ethers';
import { inject, observer } from 'mobx-react';
import { colors, measures } from '@common/styles';
import { Wallet as WalletUtils } from '@common/utils';

const { wallet, utils } = ethers;

@inject('prices')
@observer
export default class TotalBalance extends React.Component {

    get balance() {
        const { wallets } = this.props;
        const balances = wallets.map(({ balance }) => balance);
        if (balances.some(el => !el)) return 0;
        const balance = WalletUtils.reduceBigNumbers(balances).toString();
        return Number(WalletUtils.formatBalance(balance));
    }
    
    get fiatBalance() {
        return Number(this.props.prices.usd * this.balance);
    }

    render() {
        //const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';
        //var providers = require('ethers').providers;
        // Connect to a local Parity instance
        //var provider = new providers.JsonRpcProvider('http://localhsot:8545', ethers.providers.networks.ropsten);

        // From here is the real code -- 
        //var provider = new ethers.providers.JsonRpcProvider('http://10.0.2.2:8545');
        //console.log(provider);
        //var address = '0x68dc3e7342acaf52ebe1356d2b211623dca9e022';
        var abi = [
            {
              "constant": true,
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "name": "",
                  "type": "address"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "name": "_entity_type",
                  "type": "uint256"
                },
                {
                  "name": "_f_name",
                  "type": "string"
                },
                {
                  "name": "_l_name",
                  "type": "string"
                },
                {
                  "name": "_email",
                  "type": "string"
                },
                {
                  "name": "_NHSNum",
                  "type": "uint256"
                },
                {
                  "name": "_senderAddress",
                  "type": "address"
                }
              ],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "changeInfo",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "getName",
              "outputs": [
                {
                  "name": "_f_name",
                  "type": "string"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "getInfo",
              "outputs": [
                {
                  "name": "name_",
                  "type": "string"
                },
                {
                  "name": "lastname_",
                  "type": "string"
                },
                {
                  "name": "email_",
                  "type": "string"
                },
                {
                  "name": "NHSNum_",
                  "type": "uint256"
                },
                {
                  "name": "_owner",
                  "type": "address"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            }
          ];
          //var contract = new ethers.Contract(address, abi, provider);
          //var gg = contract.getInfo();
          //console.log(gg);

          //console.log(contract);
          /*
        gg.then((result) => {
            console.log(result[0])
            Alert.alert(
                result[0]
            )
        })
        */
 /*
 var abi = [
    {
        constant: true,
        inputs: [],
        name: "getValue",
        outputs: [
            {
                name: "value",
                type: "string"
            }
        ],
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "value",
                type: "string"
            }
        ],
        name: "setValue",
        outputs: [],
        type: "function"
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: "oldValue",
                type: "string"
            },
            {
                indexed: false,
                name: "newValue",
                type: "string"
            }
        ],
        name: "valueChanged",
        type: "event"
    }
];
*/
 //var address = "0x68dc3e7342acaf52ebe1356d2b211623dca9e022";
 //var provider = ethers.providers.getDefaultProvider('mainnet');

    //var contract = new ethers.Contract(address, abi, provider);
    //var callPromise = contract.getInfo();

    //console.log(callPromise);
    //callPromise.then(function(result) {
        //console.log("Result (property parameter; 0)", result);
        // "Hello World"
    //});
        
        return (
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    <Text style={styles.title}>Total balance:</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.balance}>ETH {this.balance.toFixed(3)}</Text>
                    <Text style={styles.fiatBalance}>US$ {this.fiatBalance.toFixed(2)}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 60,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.white
    },
    leftColumn: {
        flex: 1
    },
    title: {
        fontSize: measures.fontSizeLarge,
        color: colors.gray
    },
    balance: {
        fontSize: measures.fontSizeMedium + 2,
        fontWeight: 'bold',
        color: colors.gray
    },
    fiatBalance: {
        fontSize: measures.fontSizeMedium - 3,
        color: colors.gray
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    }
});