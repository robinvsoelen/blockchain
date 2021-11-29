import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainSceneComponent } from './blockchain-scene.component';

describe('BlockchainSceneComponent', () => {
  let component: BlockchainSceneComponent;
  let fixture: ComponentFixture<BlockchainSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockchainSceneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
