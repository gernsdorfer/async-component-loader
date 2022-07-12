import {TestBed} from '@angular/core/testing';
import {CounterComponent} from './counter.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('BasicExampleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  const getComponent = (): CounterComponent => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  it('should be defined', () => {
    expect(getComponent()).toBeDefined();
  });

});
