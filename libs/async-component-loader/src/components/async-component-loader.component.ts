import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IComponent, LazyComponentCreator, OutputKeys} from "../services/lazy-component-creator.service";
import {Subject, takeUntil} from "rxjs";


@Component({
  selector: 'async-component-loader',
  template: `
    <ng-template #component></ng-template>
    <ng-container *ngIf="isLoading">
      <ng-content select="[isLoading]"></ng-content>
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class AsyncComponentLoaderComponent<LAZY_COMPONENT extends IComponent> implements OnInit, OnDestroy {
  @Input() lazyComponentCreator!: LazyComponentCreator<LAZY_COMPONENT>;

  @Input() set inputs(props: Partial<LAZY_COMPONENT>) {
    this._inputs = props;
    this.setInputs();
  }

  isLoading = false;
  component!: Type<LAZY_COMPONENT>;

  @ViewChild('component', {read: ViewContainerRef})
  private viewContainerRef!: ViewContainerRef;
  private componentRef?: ComponentRef<LAZY_COMPONENT>;
  private _inputs!: Partial<LAZY_COMPONENT>;
  notifier = new Subject<void>()


  ngOnInit() {
    if (!this.lazyComponentCreator) throw 'Input lazyComponentCreator is not defined';
    this.isLoading = true
    this.createComponent().then(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.notifier.next()
    this.notifier.complete()
  }

  private async createComponent() {
    const componentRef = await this.loadComponent();
    this.getAllOutputs(componentRef).forEach((output) => this.listenOnOutput(output));
    this.setInputs(componentRef);
    this.componentRef = componentRef;
  }

  private async loadComponent() {
    const component = await this.lazyComponentCreator.component();
    this.viewContainerRef.clear();
    return this.viewContainerRef.createComponent(component);
  }

  private getAllOutputs(componentRef: ComponentRef<LAZY_COMPONENT>) {
    return Object.keys(componentRef.instance)
      .filter((property) => componentRef.instance[property] instanceof EventEmitter)
      .map((property) => ({
        componentRef: componentRef,
        property: property as OutputKeys<LAZY_COMPONENT>,
        output: this.lazyComponentCreator.outputs?.[property as OutputKeys<LAZY_COMPONENT>]
      }))
      .filter(({output}) => output);
  }

  private listenOnOutput({
                           output,
                           property,
                           componentRef
                         }: { componentRef: ComponentRef<LAZY_COMPONENT>, property: OutputKeys<LAZY_COMPONENT>, output: LAZY_COMPONENT[typeof property]['emit'] }): void {
    componentRef.instance[property].pipe(
      takeUntil(this.notifier)
    ).subscribe(
      (value: ThisParameterType<LAZY_COMPONENT[typeof property]['emit']>) => output(value));
  }

  private setInputs(componentRef: ComponentRef<LAZY_COMPONENT> | undefined = this.componentRef) {
    if(!this._inputs) return;
    Object.keys(this._inputs).forEach((key) => {
      if (!componentRef?.instance) return;
      (componentRef.instance[key] as LAZY_COMPONENT[typeof key]) = this._inputs[key] as LAZY_COMPONENT[typeof key];
    });
  }
}
