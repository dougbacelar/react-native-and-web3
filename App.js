import './global';

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AES, lib, enc } from "crypto-js"
const Web3 = require('web3');
const bip39 = require("bip39")
const hdKey = require("ethereumjs-wallet/hdkey")

const web3 = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
);
// web3.eth.getBlock('latest').then(console.log);

// TODO: NOT RANDOM ENOUGH
const entropy = lib.WordArray.random(24).toString()

const mnemonic = bip39.entropyToMnemonic(entropy)
const encryptedMnemonic = AES.encrypt(mnemonic, "my encryption key here").toString()
const decryptedMnemonic = AES.decrypt(encryptedMnemonic, 'my encryption key here').toString(enc.Utf8)
const hdwallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
const wallet = hdwallet.derivePath(`m/44'/60'/0'/0/0`).getWallet()
const data = new Date().toJSON()
const signature = web3.eth.accounts.sign(data, wallet.getPrivateKeyString()).messageHash

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{"\nMNEMONIC"}</Text>
        <Text>{mnemonic}</Text>
        <Text>{"\nENCRYPTED"}</Text>
        <Text>{encryptedMnemonic}</Text>
        <Text>{"\nDECRYPTED"}</Text>
        <Text>{decryptedMnemonic}</Text>
        <Text>{"\nWALLET PrivKey"}</Text>
        <Text>{wallet.getPrivateKeyString()}</Text>
        <Text>{"\nWALLET PubKey"}</Text>
        <Text>{wallet.getAddressString()}</Text>
        <Text>{"\nDATA"}</Text>
        <Text>{data}</Text>
        <Text>{"\nSIGNED DATA"}</Text>
        <Text>{signature}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
