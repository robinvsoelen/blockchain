import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, NgModule } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Transaction } from 'savjeecoin/src/blockchain'
import * as THREE from "three";
import { Text } from 'troika-three-text'
import { createSecureContext } from 'tls';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { copyFile } from 'fs';
import { timeStamp } from 'console';


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

  //the points that determine which block is selected
  public snap_points: any[] = [];
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
  intro_animation = 2000;


  cubes: any[] = [];

  meImg = '/assets/mePIC.svg';
  senseiImg = '/assets/senseiPIC.svg';

  title = 'blockchain';



  //Blocks that are created when opening the page
  public transactionStory = [[
    {
      "from_me": false,
      "amount": 0,
      "text": "Hi there! My name is Brock Chane instructor of Blockchain"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Oh... wow... hi... Where did you just come from? I'm Steve..."
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "We are talking through transactions inside a Blockchain! Isn't that magnificent!?"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "I guess..."
    }
  ],
  [
    {
      "from_me": false,
      "amount": 0,
      "text": "For your first lesson you will learn about transactions."
    },
    {
      "from_me": false,
      "amount": 100,
      "text": "Cryptocurrencies, like Bitcoin, are used as a safe, anonymous and decentralised alternative for making transactions and are the most popular application of Blockchains. Allow me to demonstrate a transaction of money"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Oh thanks! But what makes these transactions so safe?"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "To be able to create a transaction you need a digital signature. This signature can only be made using a private/public key pair. You can see my public key by hovering over my face, but I will never give you my private key!"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "bummer..."
    },
  ],
  [
    {
      "from_me": true,
      "amount": 0,
      "text": "But what makes blockchain so decentralized?"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "Good question! Blockchain makes use of something called a peer to peer network. Everyone who uses the blockchain gets a copy of that chain. When they add a transaction they broadcast this transaction to all others who use the blockchain. This way there is no central authority like a bank in charge."
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "...by the way, I am going to need that money back"
    },
    {
      "from_me": true,
      "amount": 100,
      "text": "..."
    }
  ],
  [
    {
      "from_me": true,
      "amount": 0,
      "text": "Why do you get something called a block reward and I don't?"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "That is my reward for performing a proof of work, also known as mining a block"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "I am slightly more confused"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "Lists of transactions (messages) are stored in blocks. Proof of work is a method that ensures that the contents of a block cannot be changed."
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "So how does that work?"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "To create a block, the contents of that block are turned into a hash that has to start with a specific amount of zeros, this amount of zeros is called the difficulty. A hash that fullfills this requirement of zeros can only be found through randomly trying different inputs. This requires computers to work for a long time until a valid hash is found."
    },
  ],
  [
    {
      "from_me": true,
      "amount": 0,
      "text": "I still don't get how this makes it more secure..."
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "This way whenever the contents of the block are changed, the hash changes as well. This means that a new hash needs to be found that fulfills the requirements, which will take a long time"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Yeah it might take a bit longer but I don't see how this solves anything"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "This is where the chain part of the blockchain becomes relevant. Each block that is created links to the hash of the previous block. This way, when one of the hashes of the blocks changes, the chain breaks and the blockchain is no longer valid."
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Ah.. that makes sense. But why should it take so long to find a hash?"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "Without the proof of work it would be possible to easily find hashes of the next blocks as well, which would make the chain valid anyways. With proof of work this will become impossible. This is because the longest blockchain is always seen as the correct one. It would be virtually impossible to recalculate all of the hashes yourself and maintain a blockchain that is longer than the actual one"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Ah.."
    }
  ],
  [
    {
      "from_me": true,
      "amount": 0,
      "text": "I am glad I now know how cryptocurrencies work, but I am not a criminal and I have no money to spend anyways. So this all still seems a bit useless to me."
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "While cryptocurrencies are the most popular applications of blockchains. They are by far not the only one! Blockchains are simply a very secure, decentralized and anonymous way of storing chronological data."
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Rad! Can you give me some examples?"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "There are countless! You can for example use blockchains to keep track of the supply chain in your company, use it as a secure voting mechanism or use it for signing smart contracts"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Cool beans!"
    }
  ],
  [
    {
      "from_me": false,
      "amount": 0,
      "text": "Now that I have trained you in the ways of the blockchain. I would like to have my payment please. Because you were such a quick student, that will be 100 coin."
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "Wait I don't have any money"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "Try mining some of the pending transactions"
    },
    {
      "from_me": true,
      "amount": 0,
      "text": "I'll try..."
    },

  ],]

  public pendingTransactionStory = [
    {
      "from_me": false,
      "amount": 0,
      "text": "I knew you could do it!!!"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "I am such a proud teacher"
    },
    {
      "from_me": false,
      "amount": 0,
      "text": "Now can you please transfer this money to me?"
    }
  ]

  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private blockchainService: BlockchainService) {
    this.blockchain = blockchainService.blockchainInstance;
    this.blocks = blockchainService.getBlocks();
    this.walletKey = blockchainService.walletKeys[0];
    this.senseiKey = blockchainService.senseiKeys[0];
  }

  ngOnInit(): void {
    this.createTransactionStory();
    this.createPendingTransactions();
  }


  //Creating the transaction at the beginning of the page that still need to be mined
  createPendingTransactions() {
    let component: BlockchainSceneComponent = this;
    //for each transaction
    this.pendingTransactionStory.forEach(function (item, index) {
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
    })
    this.pendingTransactions = this.blockchainService.getPendingTransactions();

  }

  //Creating the blocks at when the page is loaded
  createTransactionStory() {
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
      component.currentBlock = component.blocks[0];
      component.amountOfBlocks = component.blocks.length;
      component.my_balance = component.blockchainService.getBalance(component.walletKey.publicKey)
      component.snap_points = component.getSnapPoints();
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
    this.my_balance = this.blockchainService.getBalance(this.walletKey.publicKey);
    this.snap_points = this.getSnapPoints();
    console.log(this.my_balance)
  }


  //get the points that determine which block is selected
  getSnapPoints() {
    var snap_points: any[] = [];
    let component: BlockchainSceneComponent = this;
    this.blocks.forEach(function (block, index) {
      var point = (index * 2000) + component.intro_animation;
      snap_points.push(point);
    })
    return snap_points;
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
  private selectedMaterial = new THREE.MeshBasicMaterial({ color: '#E63946' });
  private unselectedMaterial = new THREE.MeshBasicMaterial({ color: '#457B9D' });
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;



  //Create the scene
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#F1FAEE');

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

      const amount_of_lines = 4;
      for (let j = 0; j < amount_of_lines; j++) {
        var myText = new Text()
        // Set properties to configure:
        if (j ==0){
          myText.text = "Hash: " + block.hash;
        }
        if (j ==1){
          myText.text = "Previous hash: " + block.previousHash;
        }
        if (j ==2){
          myText.text = "Time stamp: " + block.timestamp;
        }
        if (j ==3){
          myText.text = "nonce: " + block.nonce;
        }
        myText.fontSize = 0.02
        myText.position.x = 0;
        myText.position.y = -0.3 - j*0.05;
        myText.position.z = 1 - i * 20;
        myText.color = '#f4f1de'
        // Update the rendering:
        component.scene.add(myText)
        myText.sync()
      }
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
    })
  }


  onResized(event) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }


  private startRenderingLoop() {
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

      //if at start of page move down
      if (window.pageYOffset < component.intro_animation) {
        component.camera.position.y = 2 - window.scrollY / 1000;
        component.camera.position.z = 90 - window.scrollY / 100.0;

      }
      //afterwards move through blocks
      else {
        component.camera.position.z = 90 - window.scrollY / 100.0;
        component.camera.position.x = -2 + window.scrollY / 16000.0;
      }

      //determine which block is selected
      component.snap_points.forEach(function (position, index) {
        if ((position - window.pageYOffset) < 700 && (position - window.pageYOffset) > -700) {
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
