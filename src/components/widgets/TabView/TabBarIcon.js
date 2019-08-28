import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from '@components/widgets';
import { colors } from '@common/styles';

const getLabelColor = (active) => active ? styles.activeLabel : styles.label;

export default ({ active, icon, label, onPress, ...props }) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
            <Icon color={active ? '#c85b81' : colors.gray} {...props} name={icon} />
            <Text style={getLabelColor(active)}>{label}</Text>
        </View>
    </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1
    },
    activeLabel: {
        color: '#c88fa3'
    },
    label: {
        color: colors.gray
    }
});