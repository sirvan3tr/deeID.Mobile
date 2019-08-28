import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Button,
  View,
  AsyncStorage,
  TouchableHighlight
} from 'react-native';
import { Wallet as WalletUtils } from '@common/utils';
import { Wallets as WalletsActions } from '@common/actions';

export class Register extends Component {

    static navigationOptions = { title: 'deeID - Select an Account' };

    constructor(props) {
        super(props);
        this.state = {
            myKey: null,
            pk: ''
        };
    }

    _storeData = async () => {
        try {
          await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
        } catch (error) {
          // Error saving data
        }
    }

    _retrieveData = async () => {

        let UID123_object = {
            name: 'Chris',
            age: 30,
            traits: {hair: 'brown', eyes: 'brown'},
          };
          // You only need to define what will be added or updated
          let UID123_delta = {
            age: 31,
            traits: {eyes: 'blue', shoe_size: 10},
          };
          
          AsyncStorage.setItem('UID123', JSON.stringify(UID123_object), () => {
            AsyncStorage.mergeItem('UID123', JSON.stringify(UID123_delta), () => {
              AsyncStorage.getItem('UID123', (err, result) => {
                console.log(result);
              });
            });
          });

        try {
          const value = await AsyncStorage.getItem('TASKS');
          if (value !== null) {
            // We have data!!
            console.log(value);
            this.setState({value});
          }
         } catch (error) {
           // Error retrieving data
         }
    }

    async getmong() {
      try {
        var Datastore = require('react-native-local-mongodb');
        var db = new Datastore({ filename: 'asyncStorageKey', autoload: true });
        // You can issue commands right away

        //var doc = { hello: 'world', n : "wow wow" };
        //console.log(doc);
        var person = {
            firstname : "Sirvan",
            surname : "Almasi",
            dob : "26/01/1992",
            placeOfBirth : "Saqqez",
            tel :
                [{
                    title : "Mobile main",
                    mobile : "07799006216"
                },
                {
                    title : "old mobile number",
                    mobile : "07799006216"
                }],
            address :
                [{
                    title: "Home",
                    homeNumber : "33C",
                    street : "Friars Place Lane",
                    town : "London",
                    postcode : "W3 7AQ",
                    country : "UK",
                    beginDate : "",
                    endDate : ""
                },{

                }],
            email :
                [{
                    title : "Personal one",
                    email : "Sirvan3tr@gmail.com"
                },
                {
                    title : "Warwick",
                    email : "mim14sa@mail.wbs.ac.uk"
                }]

        };

        console.log(person);


        db.find({ hello: 'world' }, function (err, docs) {
            // docs is an array containing documents Mars, Earth, Jupiter
            // If no document is found, docs is equal to []
            console.log(docs);
        });
      } catch (error) {

      }
    }

    selectUserA() {

        const newPass = [
            {
                url: 'http://google.com',
                name: 'My Gmail account',
                username: 'sirvan3tr',
                password: 'cant tell you',
                notes: 'nothing to note',
                timestamp: Date.now()
            },
            {
                url: 'http://google.com',
                name: 'My Gmail account',
                username: 'sirvan3tr',
                password: 'cant tell you',
                notes: 'nothing to note',
                timestamp: Date.now()
            },
            {
                url: 'http://google.com',
                name: 'My Gmail account',
                username: 'sirvan3tr',
                password: 'cant tell you',
                notes: 'nothing to note',
                timestamp: Date.now()
            }
        ];
        
        AsyncStorage.setItem('passwords', JSON.stringify(newPass), () => { });
        /*
        pk = ethereum private key

        Fiat-Shamir CryptoSystem:
            s = Fiat-Shamir Private Key
            I = Identity string
            j = random j indices for above id
            n = global modulus

            public key: 0x6751c5563A62675Ffba7D3220f883c719b7B9F49
        */
        const pk = '0xb50c18d670e82f3f559142d63773b5f60882d337f7d40e78f87973484740ab0d',
            s = [1220448689, 386273255, 15269095, 79929288, 1066903174, 592861078, 278860438, 905288239, 536397697, 51542499],
            I = 'Sirvan Almasi || 26/01/1992 || Saqqez || Sirvan3tr@gmail.com',
            j = [879526612, 1864187998, 3119683462, 785478098, 1061096975, 2814024602, 972289411, 2683930126, 1899345369, 666184941],
            n = 3328912597,
            walletName = 'User A Wallet',
            walletDescription = 'Pre-defined user A wallet',
            userA = {
                firstname : "Sirvan",
                surname : "Almasi",
                dob : "26/01/1992",
                placeOfBirth : "Saqqez",
                deeID : '0xa78e5bb6ff6a849e120985d32532e5067f262e19',
                tel :
                    [{
                        title : "Mobile main",
                        mobile : "07799006216"
                    },
                    {
                        title : "old mobile number",
                        mobile : "07799006216"
                    }],
                address :
                    [{
                        homeNumber : "33C",
                        street : "Friars Place Lane",
                        town : "London",
                        postcode : "W3 7AQ",
                        country : "UK",
                        beginDate : "",
                        endDate : ""
                    },{

                    }],
                email :
                    [{
                        title : "Personal one",
                        email : "Sirvan3tr@gmail.com"
                    },
                    {
                        title : "Warwick",
                        email : "mim14sa@mail.wbs.ac.uk"
                    }]
            };
        
        // Store the user in the database
        AsyncStorage.setItem('userA', JSON.stringify(userA), () => {
            AsyncStorage.getItem('userA', (err, result) => {
                console.log(result);
            });
        });

        // save the pk into a wallet, will redirect to wallet overview too
        this.onPressOpenWallet(pk, walletName, walletDescription, s, 'both', n, j);

        // select the wallet and navigat to the detailed page of the wallet
        const wallet = WalletUtils.loadWalletFromPrivateKey(pk);
        WalletsActions.selectWallet(wallet);
        this.props.navigation.navigate('WalletDetails', { wallet, replaceRoute: true });

        // or we can go to the wallets overview page
        //this.props.navigation.navigate('WalletsOverview', { replaceRoute: true });
    }

    async onPressOpenWallet(pk, walletName, walletDescription, almasFFS, type, mod, other) {
        try {
            const wallet = WalletUtils.loadWalletFromPrivateKey(pk);
            //const { walletName, walletDescription } = this.props.navigation.state.params;
            await WalletsActions.addWallet(walletName, wallet, walletDescription, almasFFS, type, mod, other);
            await WalletsActions.saveWallets();
        } catch (e) {
            console.warn(e);
        }
    }

    selectUserB() {
        const pk = '0xb50c18d670e82f3f559142d63773b5f60882d337f7d40e78f87973484740ab1d',
            walletName = 'User B Wallet',
            walletDescription = 'Pre-defined user B wallet',
            userB = {
                firstname : "Robin",
                surname : "Smith",
                dob : "26/01/1992",
                placeOfBirth : "London",
                tel :
                    [{
                        title : "Mobile main",
                        mobile : "07799006216"
                    },
                    {
                        title : "old mobile number",
                        mobile : "07799006216"
                    }],
                address :
                    [{
                        homeNumber : "33C",
                        street : "Friars Place Lane",
                        town : "London",
                        postcode : "W3 7AQ",
                        country : "UK",
                        beginDate : "",
                        endDate : ""
                    },{

                    }],
                email :
                    [{
                        title : "Personal one",
                        email : "robin@gmail.com"
                    },
                    {
                        title : "Work",
                        email : "robin@work.com"
                    }]
            };
        
        // Store the user in the database
        AsyncStorage.setItem('userB', JSON.stringify(userB), () => {
            AsyncStorage.getItem('userB', (err, result) => {
                console.log(result);
            });
        });

        // save the pk into a wallet, will redirect to wallet overview too
        this.onPressOpenWallet(pk, walletName, walletDescription);
    }

    render() {
        this._storeData();
        return (
            <View style={styles.container}>

        <Text style={styles.titleS}>Welcome!</Text>
            <Text style={styles.welcome}>Select a pre-defined account:</Text>
            <TouchableHighlight 
                    style={styles.formButton}>
                <Button onPress={this.selectUserA.bind(this)}            
                    title="I want to be User A"
                    accessibilityLabel="Learn more about this button"
                /> 
            </TouchableHighlight>
            <TouchableHighlight 
                    style={styles.formButton}>
                <Button onPress={this.selectUserB.bind(this)}            
                    title="I want to be User B"
                    accessibilityLabel="Learn more about this button"
                /> 
            </TouchableHighlight>
            </View>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleS: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    margin: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  formInput: {
    paddingLeft: 5,
    height: 50,
    borderWidth: 1,
    borderColor: "#555555",
  },
  formButton: {
    borderWidth: 0,
    marginTop: 10,
    padding: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginTop: 5,
  },
});

AppRegistry.registerComponent('Register', () => Register);