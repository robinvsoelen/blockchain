import { Component, OnInit, Input } from '@angular/core';
import { BlockchainSceneComponent } from '../blockchain-scene/blockchain-scene.component';
import { BlockchainService } from 'src/app/services/blockchain.service';
import * as THREE from "three";

@Component({
  selector: 'app-block-view',
  templateUrl: './block-view.component.html',
  styleUrls: ['./block-view.component.scss']
})
export class BlockViewComponent implements OnInit {
  @Input() public block; 

  ngOnInit(){
    
  }



}
 