import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AsyncComponentLoaderComponent, LazyComponentCreator} from "@gernsdorfer/async-component-loader";
import {CounterComponent} from "./components/counter/counter.component";

@Component({
  selector: 'my-app',
  styles: [],
  standalone: true,
  imports: [CommonModule, AsyncComponentLoaderComponent],
  template: `<h1>Load Components Asynchron</h1>
  <button class="button-load-counter" (click)="showCounterComponent=!showCounterComponent">Toogle Counter Component</button>
  <br/>
  <async-component-loader *ngIf="showCounterComponent"
                  [lazyComponentCreator]="counterComponent"
                  [inputs]="{counter}">
    <ng-container isLoading>Loading</ng-container>
  </async-component-loader>

  `,
})
export class AppComponent {
  showCounterComponent = false;
  counter = 0;

  counterComponent = new LazyComponentCreator<CounterComponent>({
      component: async () => (await import('./components/counter/counter.component')).CounterComponent,
      outputs: {
        increment: (newCount = 0 ) => this.counter = newCount
      }
    }
  )
}
