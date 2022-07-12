import {CommonModule} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CounterComponent} from "./components/counter/counter.component";
import {LazyComponentCreator} from "@gernsdorfer/async-component-loader";

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AppComponent, {
      set: {
        imports: [CommonModule],
        schemas: [NO_ERRORS_SCHEMA],
      },
    });

    fixture = TestBed.createComponent(AppComponent);


    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  describe('counterComponent', () => {
    const getOutputs = (outputs: AppComponent['counterComponent']['outputs']) => {
      return {
        increment: (_value?: number) => {
          throw 'increment is not defined'
        },
        ...outputs
      };
    }
    it('should return counterComponent', async () => {
      const counterComponent = await app.counterComponent.component();

      expect(counterComponent === CounterComponent).toBe(true);
    });

    it('should set counter', async () => {
      app.counter = 0;
      const outputs = getOutputs(app.counterComponent.outputs);

      outputs.increment(1)

      expect(app.counter).toBe(1);
    });

    it('should reset counter', async () => {
      app.counter = 1;
      const outputs = getOutputs(app.counterComponent.outputs);

      outputs.increment(undefined)

      expect(app.counter).toBe(1);
    });
  });
});
