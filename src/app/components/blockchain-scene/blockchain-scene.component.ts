import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, NgModule } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Transaction } from 'savjeecoin/src/blockchain'
import * as THREE from "three";
import { Text } from 'troika-three-text'
import ScrollSnap from 'scroll-snap';
import { createSecureContext } from 'tls';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { copyFile } from 'fs';




@Component({
  selector: 'app-blockchain-scene',
  templateUrl: './blockchain-scene.component.html',
  styleUrls: ['./blockchain-scene.component.scss']
})

// @NgModule({
//   imports: [
//     CommonModule]
//   })

export class BlockchainSceneComponent implements OnInit, AfterViewInit {

  public blocks: any[] = [];
  public currentBlock;
  public index = 0;
  public firstPage = true;
  public amountOfBlocks;
  public newTx;
  public walletKey;
  public my_balance;
  public blockchain;
  public senseiKey;
  public pendingTransactions;
  public transactionCreator = false;

  cubes: any[] = [];
  snap_points = [0, 2300, 4300, 6300, 8300, 10300, 12300, 14300];

  meImg = '/assets/mePIC.jpg';
  senseiImg = '/assets/senseiPIC.png';

  title = 'blockchain';

  public transactionStory = [[
    {
      "from_me": false,
      "amount": 10000,
      "text": "Hi, welcome to my Blockchain course. That will be 100 coin up front please"
    },
    {
      "from_me": true,
      "amount": 100,
      "text": "Ok Sure"
    }
  ],
  [
    {
      "from_me": false,
      "amount": 0,
      "text": "Each of the blocks contains a set of transactions. Speaking of transactions, I need some more money"
    },
    {
      "from_me": true,
      "amount": 100,
      "text": "Oh..."
    }
  ],
  [
    {
      "from_me": false,
      "amount": 0,
      "text": "Each of the blocks contains a set of transactions. Speaking of transactions, I need some more money"
    },
    {
      "from_me": true,
      "amount": 100,
      "text": "Oh..."
    }
  ],
  [
    {
      "from_me": false,
      "amount": 0,
      "text": "Each of the blocks contains a set of transactions. Speaking of transactions, I need some more money"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Oh..."
    }
  ]]

  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;


  constructor(private blockchainService: BlockchainService) {
    this.blockchain = blockchainService.blockchainInstance;
    this.blocks = blockchainService.getBlocks();
    this.walletKey = blockchainService.walletKeys[0];
    this.senseiKey = blockchainService.senseiKeys[0];
  }

  ngOnInit(): void {
    let component: BlockchainSceneComponent = this;
    //for each block
    this.transactionStory.forEach(function (item, index) {
      //for each transaction
      item.forEach(function (item, index) {
        component.newTx = new Transaction()
        component.newTx.amount = item.amount;
        component.newTx.text = item.text;
        if (item.from_me) {
          component.newTx.fromAddress = component.walletKey.publicKey;
          component.newTx.toAddress = component.senseiKey.publicKey;
          component.newTx.signTransaction(component.walletKey.keyObj);
          component.newTx.img = component.meImg;
          component.newTx.toImg = component.senseiImg;
        }
        else {
          component.newTx.fromAddress = component.senseiKey.publicKey;
          component.newTx.toAddress = component.walletKey.publicKey;
          component.newTx.signTransaction(component.senseiKey.keyObj);
          component.newTx.img = component.senseiImg;
          component.newTx.toImg = component.meImg;
        }
        component.blockchainService.addTransaction(component.newTx);

        component.newTx = new Transaction();
      }
      )
      component.blockchainService.mineSenseiTransactions();

      console.log(component.blocks[1]['transactions']);
      component.currentBlock = component.blocks[0];
      component.amountOfBlocks = component.blocks.length;
      component.my_balance = component.blockchainService.getBalance(component.walletKey.publicKey)

    })
  }

  createTransaction() {
    this.newTx.fromAddress = this.walletKey.publicKey;
    console.log(this.newTx);
    this.newTx.signTransaction(this.walletKey.keyObj);
    this.blockchainService.addTransaction(this.newTx);
    this.newTx = new Transaction();
    this.pendingTransactions = this.blockchainService.getPendingTransactions();
    this.transactionCreator = false;
  }

  minePendingTransactions() {
    this.blockchainService.minePendingTransactions();
    this.drawBlocks();
    this.amountOfBlocks = this.blocks.length;
    this.pendingTransactions = this.blockchainService.getPendingTransactions();
    this.my_balance = this.blockchainService.getBalance(this.walletKey.publicKey)
  }


  //* Cube Properties

  @Input() public size: number = 200;

  //* Stage Properties

  @Input() public cameraZ: number = 400;

  @Input() public fieldOfView: number = 1;

  @Input('nearClipping') public nearClippingPlane: number = 50;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private selectedMaterial = new THREE.MeshBasicMaterial({ color: '#b7094c' });
  private unselectedMaterial = new THREE.MeshBasicMaterial({ color: '#5c4d7d' });

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;




  /**
   * Create the scene
   *
   * @private
   * @memberof BlockchainSceneComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0091ad');

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 1, 1).normalize();
    this.scene.add(light);
    this.drawBlocks();


    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  drawBlocks() {
    let component: BlockchainSceneComponent = this;

    this.blocks.forEach(function (block, i) {

      var object;
      if (block == component.currentBlock) {
        object = new THREE.Mesh(component.geometry, component.selectedMaterial);
      }
      else {
        object = new THREE.Mesh(component.geometry, component.unselectedMaterial);
      }
      

      object.scale.set(1, 1, 1);
      object.position.x = 0.5;
      object.position.z = -i * 20;
      component.cubes.push(object);
      //this.scene.add(object);

      if (i == 0) {
        var myText = new Text()
        // Set properties to configure:
        myText.text = "Genesis block";
        myText.fontSize = 0.07;
        myText.position.x = 0.25;
        myText.position.y = -0.16;
        myText.position.z = 1 - i * 20;
        myText.color = '#f4f1de'
        // Update the rendering:
        component.scene.add(myText)
        myText.sync()
      }

      var myText = new Text()
      // Set properties to configure:
      myText.text = "Hash: " + block.hash;
      myText.fontSize = 0.02
      myText.position.x = 0;
      myText.position.y = -0.3;
      myText.position.z = 1 - i * 20;
      myText.color = '#f4f1de'
      // Update the rendering:
      component.scene.add(myText)
      myText.sync()

      var myText = new Text()
      // Set properties to configure:
      myText.text = "Previous hash: " + block.previousHash;
      myText.fontSize = 0.02
      myText.position.x = 0;
      myText.position.y = -0.35;
      myText.position.z = 1 - i * 20;
      myText.color = '#f4f1de'
      // Update the rendering:
      component.scene.add(myText)
      myText.sync()

      var myText = new Text()
      // Set properties to configure:
      myText.text = "Time stamp: " + block.timestamp;
      myText.fontSize = 0.02
      myText.position.x = 0;
      myText.position.y = -0.4;
      myText.position.z = 1 - i * 20;
      myText.color = '#f4f1de'
      // Update the rendering:
      component.scene.add(myText)
      myText.sync()

      var myText = new Text()
      // Set properties to configure:
      myText.text = "Nonce: " + block.nonce;
      myText.fontSize = 0.02
      myText.position.x = 0;
      myText.position.y = -0.45;
      myText.position.z = 1 - i * 20;
      myText.color = '#f4f1de'
      // Update the rendering:
      component.scene.add(myText)
      myText.sync()

      i += 1;
    })

    component.cubes.forEach(function (cube, index) {
      component.scene.add(cube);
    })
  }

  changeMaterial(blockIndex, component) {
    component.cubes.forEach(function (cube, index) {
      if (index == blockIndex) {
        cube = new THREE.Mesh(cube.geometry, new THREE.MeshPhongMaterial({ color: '#white' }));
      }
      else {
        cube = new THREE.Mesh(cube.geometry, new THREE.MeshPhongMaterial({ color: '#black' }));
      }
      cube.scale.set(1, 1, 1);
      cube.position.x = 0.5;
      cube.position.z = -index * 20;
      cube.needsUpdate = true;
      //component.scene.add(cube);

      //component.scene.add(cube);
    })
  }

  /**
 * Start the rendering loop
 *
 * @private
 * @memberof BlockchainSceneComponent
 */

  onResized(event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private updateCamera(ev) {
    let div1 = document.getElementById("div1");
    this.camera.position.z = 70 - window.scrollY / 500.0;
    this.camera.position.x = -10 - window.scrollY / 500.0
  }


  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template

    //window.addEventListener("scroll", this.updateCamera);


    this.camera.position.x = -2;
    this.camera.position.y = 0;
    this.camera.position.z = 70;
    this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    let component: BlockchainSceneComponent = this;

    (function render() {
      requestAnimationFrame(render);
      component.camera.position.z = 70 - window.scrollY / 100.0;
      component.camera.position.x = -2 + window.scrollY / 16000.0;
      component.snap_points.forEach(function (position, index) {
        if ((position - window.pageYOffset) < 700 && (position - window.pageYOffset) > -700) {
          // window.scrollTo({
          //   top: position,
          //   left: 0,
          //   behavior: 'smooth'
          // });

          component.index = index;


          if (component.currentBlock != component.blocks[index]) {
            component.currentBlock = component.blocks[index];
            if (index == 0) {
              component.firstPage = true;
            }
            else {
              component.firstPage = false;
            }


            component.scene.traverse(function (node) {
              if (node instanceof THREE.Mesh) {
                if (-node.position.z / 20 == index) {
                  node.material = component.selectedMaterial;
                }
                else {
                  node.material = component.unselectedMaterial;
                }
              }
            });
          }
          //component.camera.position.z = 70 - window.scrollY / 100.0;
          //component.camera.position.x = -2 + window.scrollY / 16000.0;
        }
      })




      component.renderer.render(component.scene, component.camera);
    }());
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

}
