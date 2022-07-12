[![Test, Lint, Build](https://github.com/gernsdorfer/async-component-loader/actions/workflows/ci.yml/badge.svg)]()
[![Publish to NPM](https://github.com/gernsdorfer/async-component-loader/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/gernsdorfer/async-component-loader/actions/workflows/npm-publish.yml)
[![styled with](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![async-component-loader](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/v5fbpd/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/v5fbpd/runs)

# Async Component Loader

> A small Angular Library to load standalone components asynchronously


<hr />

- 👩‍💻 checkout the [sample app](https://github.com/gernsdorfer/async-component-loader/blob/master/apps/sample-app/)

## UI Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/gernsdorfer/async-component-loader/tree/master/apps/stackblitz-ui)

## Install

### Yarn

```bash
yarn add @gernsdorfer/async-component-loader
```

### NPM

```bash
npm install @gernsdorfer/async-component-loader
```

## Usage

1. import the `AsyncComponentLoaderComponent` into your module or component

```ts
import {AsyncComponentLoaderComponent, LazyComponentCreator} from "@gernsdorfer/async-component-loader";

@NgModule({
  // ...
  imports: [AsyncComponentLoaderComponent],
  // ...
})
```

```ts
@Component({
  selector: 'my-component',
  template: `
   <async-component-loader 
                  [lazyComponentCreator]="counterComponent"
                  [inputs]="{counter}">
    <ng-container isLoading>Loading</ng-container>
  </async-component-loader>
  `,
})
class MyComponent {
  counter = 0;
  counterComponent = new LazyComponentCreator<CounterComponent>({
      component: async () => (await import('./components/counter/counter.component')).CounterComponent,
      outputs: {
        increment: (newCount = 0) => this.counter = newCount
      }
    }
  )
}
```

That's it 🥳
