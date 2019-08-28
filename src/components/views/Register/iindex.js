import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Button, Text, Icon } from 'native-base';

export class Register extends Component {
  render() {
    return (
      <Container>
        <Content style={styles.content}>
          <Form>
            <Item>
                <Icon active name='person' />
                <Input placeholder="First name" />
            </Item>
            <Item>
                <Icon active name='lock' />
                <Input placeholder="Last name" />
            </Item>
            <Item>
                <Icon active name='mail' />
                <Input placeholder="Email address" />
            </Item>
            <Item>
                <Icon active name='phone' />
                <Input placeholder="Telephone number" />
            </Item>
            <Item last>
                <Icon active name='heart' />
              <Input placeholder="NHS number" />
            </Item>
            <Button primary><Text> Sign me up! </Text></Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
    content:{
        backgroundColor:'#fff',
        paddingLeft:40,
        paddingRight:40,
    }
});


<TextInput
style={styles.formInput}
placeholder="Enter key you want to save!"
value={this.state.myKey}
/>
<Button
style={styles.formButton}
onPress={this.getmong.bind(this)}
title="Save Key"
color="#2196f3"
accessibilityLabel="Save Key"
/>
<Button
style={styles.formButton}
onPress={this.getKey.bind(this)}
title="Get Key"
color="#2196f3"
accessibilityLabel="Get Key"
/>

<Button
style={styles.formButton}
onPress={this.resetKey.bind(this)}
title="Reset"
color="#f44336"
accessibilityLabel="Reset"
/>

<Text style={styles.instructions}>
Stored key is = {this.state.myKey}
</Text>


async getKey() {
  try {
    const value = await AsyncStorage.getItem('@MySuperStore:key');
    this.setState({myKey: value});
  } catch (error) {
    console.log("Error retrieving data" + error);
  }
}

async saveKey(value) {
  try {
    await AsyncStorage.setItem('ss', value);
    console.log(value);
  } catch (error) {
    console.log("Error saving data" + error);
  }
}

async resetKey() {
  try {
    await AsyncStorage.removeItem('@MySuperStore:key');
    const value = await AsyncStorage.getItem('@MySuperStore:key');
    this.setState({myKey: value});
  } catch (error) {
    console.log("Error resetting data" + error);
  }
}

<TextInput
style={styles.formInput}
placeholder="Enter key you want to save!"
value={this.state.myKey}
/>