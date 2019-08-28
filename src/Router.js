import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationActions, StackNavigator } from 'react-navigation';
import * as Views from './components/views';
import { colors } from './common/styles';

export const INITIAL_ROUTE = 'Register';

const navigator = StackNavigator({
    ConfirmMnemonics: { screen: Views.ConfirmMnemonics },
    ConfirmTransaction: { screen: Views.ConfirmTransaction },
    CreateMnemonics: { screen: Views.CreateMnemonics },
    CreateWallet: { screen: Views.CreateWallet },
    LoadMnemonics: { screen: Views.LoadMnemonics },
    LoadPrivateKey: { screen: Views.LoadPrivateKey },
    LoadWallet: { screen: Views.LoadWallet },
    NewWallet: { screen: Views.NewWallet },
    NewWalletName: { screen: Views.NewWalletName },
    SelectDestination: { screen: Views.SelectDestination },
    WalletDetails: { screen: Views.WalletDetails },
    WalletsOverview: { screen: Views.WalletsOverview },
    Register: { screen: Views.Register },
    AlmasFFSProve : { screen: Views.AlmasFFSProve },
    QRCodeScanner : { screen: Views.QRCodeScanner },
    WalletHome : { screen: Views.WalletHome },
    PasswordManager : { screen: Views.PasswordManager }
}, {
    initialRouteName: INITIAL_ROUTE,
    navigationOptions: {
        headerStyle: {
            backgroundColor: colors.primary,
        },
        headerTitleStyle: {
            fontWeight: "bold",
            color: "#fff",
            zIndex: 1,
            fontSize: 18,
            lineHeight: 23
        },
        headerTintColor: colors.secondary,
        tintColor: colors.secondary
    }
});

const parentGetStateForAction = navigator.router.getStateForAction;

navigator.router.getStateForAction = (action, inputState) => {
    const state = parentGetStateForAction(action, inputState);
    
    // fix it up if applicable
    if (state && action.type === NavigationActions.NAVIGATE) {
        if (action.params && action.params.replaceRoute) {
            const leave = action.params.leave || 1;
            delete action.params.replaceRoute;
            while (state.routes.length > leave && state.index > 0) {
                const oldIndex = state.index - 1;
                // remove one that we are replacing
                state.routes.splice(oldIndex, 1);
                // index now one less
                state.index = oldIndex;
            }
        }
    }

    return state;
};

export default navigator;