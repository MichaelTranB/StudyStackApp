import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BaseComponent } from './base.component';

// Create a Test Component that extends BaseComponent
@Component({
  selector: 'app-test-base',
  template: '<div></div>'
})
class TestBaseComponent extends BaseComponent {}

describe('BaseComponent', () => {
  let component: TestBaseComponent;
  let fixture: ComponentFixture<TestBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestBaseComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
