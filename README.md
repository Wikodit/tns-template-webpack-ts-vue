# Project Name

## Description

## Get Started

#### Prerequite

    npm install -g nativescript typescript webpack


#### Create a new app

    tns create app-name --template tns-template-webpack-ts-vue
    cd app-name
    npm install

#### Launch the app

    npm run ns-bundle --ios --run-app --emulator --clean

## Technical Stack

### Introduction

### NativeScript

NativeScript is a way to build Cross-Platform application.

* The rendering part is binded to native element for Android and iOS platforms. It means everytime something is rendered, it does render a native element within a native view on the device, there is no webview involved.
* The applicative part is JavaScript run by a VM (v8 on Android, and JavaScriptCore on iOS )

### Webpack

Webpack is the module Bundler which preprocess everything and bundle within few files the whole application. It improves performance of application by removing unecessary file loads.

### Preprocessors

#### TypeScript

TypeScript is a typed superset of JavaScript.

#### Pug

PUG (former Jade) is a XML preprocessor using indentation to structure elements

#### SCSS

SCSS is a style preprocessor adding support for variables, mixins, etc...

## Components

### Warnings

* When using `@Component`, the `mounted` hook will not work, it is replaced by an `afterMount` instead

### Template and Style Loading

* A `style: string` property may be given to the `@Component`, it contains CSS directives that will be applied ONLY to this Component (no need to have CSS class top selectors)
* A `template: string | function` property should be given : if it's a string, it will be used as template, if it is a function, it will be applied with the options of components in parameters, and can add some render functions to the options.

In our case, you usualy want to have something like :

    @Component({
      template: require('./my.pug'),
      style: require('./my.scss'),
    })
    export default class MyComponent extends Vue {
      
    }
