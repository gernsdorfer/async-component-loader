import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

console.log('Counter Component Loaded');

@Component({
  selector: 'my-app-counter',
  template: `
    <h2>Counter Component</h2>
    Counter: <span class="counter">{{counter}}</span>
    <button class="increment" (click)="increment.emit(counter+1)">increment</button>
  `,
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class CounterComponent {
  @Input() counter = 0;
  @Output() increment = new EventEmitter<number>();
}
