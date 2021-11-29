import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockchainSceneComponent } from './components/blockchain-scene/blockchain-scene.component';




const routes: Routes = [
  {path: '', component: BlockchainSceneComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
