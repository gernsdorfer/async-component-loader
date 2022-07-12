import {fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {AsyncComponentLoaderComponent} from './async-component-loader.component';
import {LazyComponentCreator} from "../services/lazy-component-creator.service";

@Component({
  selector: 'async-component-loader-mock',
  template: `template Data`,
  standalone: true,
  imports: [CommonModule],
})
class MockComponent {
  @Input() set inputVal1(input: number) {
    this.inputChanged.emit(input);
  }

  @Output() inputChanged = new EventEmitter<number>();
  @Output() sendOtherMessage = new EventEmitter<string>();
}

describe('AsyncComponentLoaderComponent', () => {
  const getComponent = ({lazyComponentCreator}: { lazyComponentCreator?: LazyComponentCreator<MockComponent> } = {}) => {
    const fixture = TestBed.createComponent(AsyncComponentLoaderComponent);
    fixture.componentInstance.lazyComponentCreator = lazyComponentCreator as LazyComponentCreator<MockComponent>;
    fixture.detectChanges();
    return fixture.componentInstance;
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AsyncComponentLoaderComponent, {
      set: {
        imports: [CommonModule],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });
  }));

  it('should throw error', () => {


    expect(() => getComponent()).toThrow('Input lazyComponentCreator is not defined');
  });

  describe('ngOnInit', () => {
    it('should create component with inputs and outputs', fakeAsync(() => {
      const inputChanged = jasmine.createSpy('inputChanged');
      const mockComponent = MockComponent;
      const component = getComponent({
        lazyComponentCreator: new LazyComponentCreator<MockComponent>({
          component: () => new Promise((resolve) => resolve(mockComponent)),
          outputs: {
            inputChanged,
          },
        })
      });

      component.ngOnInit();
      component.inputs = {inputVal1: 1};

      tick(1);

      expect(inputChanged).toHaveBeenCalledWith(1);
    }));

    it('should create component without inputs and outputs', fakeAsync(() => {
      const mockComponent = MockComponent;
      const component = getComponent({
        lazyComponentCreator: new LazyComponentCreator<MockComponent>({
          component: () => new Promise((resolve) => resolve(mockComponent)),
        })
      });
      expect(() => component.ngOnInit()).not.toThrow();
    }));
  });
});
