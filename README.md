# DataKitchen's front end monorepo
![CI build status](https://github.com/DataKitchen/ngx-toolkit/actions/workflows/main.yml/badge.svg)


Welcome to the DataKitchen `ngx-toolkit` monorepo! This repository houses a collection of libraries developed by our Front End team to address common tasks that Angular developers encounter on a daily basis. These libraries are split into <!-- three --> two npm packages:
  - @datakitchen/ngx-toolkit
  > Provides solutions and best practices for implementing and synchronizing various features, including search inputs, pagination, and persistence using localStorage or query parameters. Also contains mocking utilities, a simplified version of Angular's typed reactive forms, and other small utilities that any Angular developer may need. See [ngx-toolkit's readme](https://github.com/DataKitchen/ngx-toolkit/blob/master/projects/core/README.md)
  - @datakitchen/ngx-monaco-editor
  > A wrapper around [Microsoft's monaco editor](https://microsoft.github.io/monaco-editor/) made specifically for use with Angular's Material form field. See [ngx-monaco-editor](https://github.com/DataKitchen/ngx-toolkit/blob/master/projects/ngx-monaco-editor/README.md)
  - @datakitchen/rxjs-marbles
  > A wrapper around rxjs' TestScheduler which is easier to use in unit tests and play nice with the `rxjs-scheduler` provider in `ngx-toolkit`. See [rxjs-marbles](https://github.com/DataKitchen/ngx-toolkit/blob/master/projects/rxjs-marbles/README.md)
