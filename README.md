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

    npm run watch:android

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
