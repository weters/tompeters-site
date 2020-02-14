# taproom

TAP/room is the personal site of Tom Peters.

## Basic Project Details

* Basic HTML with Vanilla JS
* Compiled using webpack
* Containerized into a small nginx application
* Continuous delivery using GitHub Actions
* Deployed into a Kubernetes cluster

### Setup

```
$ npm install
```

### Compiles and hot-reloads for development

```
$ npm run serve
```

### Compiles and minifies for production

```
$ npm run build
```

Note: when compiling in Docker, two environment variables are set: `COMMIT_HASH` and `BUILD_DATE`. Those values are used in the footer of the site.
