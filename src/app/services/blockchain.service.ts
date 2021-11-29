import { Injectable } from '@angular/core';
import {Blockchain} from 'savjeecoin/src/blockchain';
import * as EC from "elliptic";

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance = new Blockchain();
  public walletKeys : any[] = []; 
  public senseiKeys : any[] = []; 


  constructor() {
    this.blockchainInstance.difficulty = 1;

    this.generateWalletKeys();
    this.generateSenseiKeys();

    //this.blockchainInstance.minePendingTransactions(this.senseiKeys[0].publicKey);

   }

   getBlocks(){ 
     return this.blockchainInstance.chain;
   }


   getBalance(address){
     return this.blockchainInstance.getBalanceOfAddress(address);
   }


   addTransaction(tx){
     this.blockchainInstance.addTransaction(tx);
   }

   getPendingTransactions(){
     return this.blockchainInstance.pendingTransactions;
   }

   minePendingTransactions(){
     this.blockchainInstance.minePendingTransactions(this.walletKeys[0].publicKey)
   }

   mineSenseiTransactions(){
    this.blockchainInstance.minePendingTransactions(this.senseiKeys[0].publicKey)
   }

  private generateSenseiKeys(){
    const ec = new EC.ec('secp256k1');
    const key = ec.genKeyPair();

    this.senseiKeys.push({
      keyObj: key,
      publicKey: key.getPublic('hex'),
      privateKey: key.getPrivate('hex'),
    })
  }

   private generateWalletKeys(){
     const ec = new EC.ec('secp256k1');
     const key = ec.genKeyPair();

     this.walletKeys.push({
       keyObj: key,
       publicKey: key.getPublic('hex'),
       privateKey: key.getPrivate('hex'),
     })
   }

}
