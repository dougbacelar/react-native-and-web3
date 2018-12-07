import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import './global';

const { AES, lib, enc } = require("crypto-js")
const Web3 = require('web3');
const bip39 = require("bip39")
const ethers = require("ethers")

const web3 = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
);

export default class App extends React.Component {
  state = {}
  componentDidMount() {
    // web3.eth.getBlock('latest').then(console.log);

    // TODO: NOT RANDOM ENOUGH
    const entropy = lib.WordArray.random(24).toString()

    const mnemonic = bip39.entropyToMnemonic(entropy)
    const encryptedMnemonic = AES.encrypt(mnemonic, "my encryption key here").toString()
    const decryptedMnemonic = AES.decrypt(encryptedMnemonic, 'my encryption key here').toString(enc.Utf8)

    const data = new Date().toJSON()

    const hd = ethers.utils.HDNode.fromMnemonic(mnemonic)
    const wallet = hd.derivePath(`m/44'/60'/0'/0/0`)
    const signature = web3.eth.accounts.sign(data, wallet.privateKey).messageHash

    this.setState({ mnemonic, encryptedMnemonic, decryptedMnemonic, privateKey: wallet.privateKey, address: wallet.address.toLowerCase(), data, signature })
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.view}>
          <Text>{"\nMNEMONIC"}</Text>
          <Text>{this.state.mnemonic}</Text>
          <Text>{"\nENCRYPTED"}</Text>
          <Text>{this.state.encryptedMnemonic}</Text>
          <Text>{"\nDECRYPTED"}</Text>
          <Text>{this.state.decryptedMnemonic}</Text>
          <Text>{"\nWALLET PrivKey"}</Text>
          <Text>{this.state.privateKey}</Text>
          <Text>{"\nWALLET @"}</Text>
          <Text>{this.state.address}</Text>
          <Text>{"\nDATA"}</Text>
          <Text>{this.state.data}</Text>
          <Text>{"\nSIGNED DATA"}</Text>
          <Text>{this.state.signature}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  view: {
    margin: 30
  }
});
