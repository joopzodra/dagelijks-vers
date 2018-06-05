# Dagelijks vers

A Vue.js project. It's an app showing list items. 

 * Every minute a few new items are added over a sockets connection.
 * When scrolling to the bottom of the list, new items are loaded.
 * The list is constantly refreshed but the user can store items in the browser storage. 

### Poems
The list items in this project are poems. Randomly 4 lines long fragments are chosen from a database with poems.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```