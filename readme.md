cloned from https://github.com/sinclairzx81/esbuild-wasm-resolve
 
## Run sample

```bash
$ npm install
$ npm start
```

Seems like may be dependant on a esbuild-wasm build version (was unable to run in vite app with newer version)
Tried also starting a local server for vite react+devextreme project to bundle main or index, but failed due to module resolution (src/app.tsx)
A good start for spike, but probably will need a significant additional effort for our usecase
Besides, hosting node_modules folder on a server probably would add a huge overtime for bundle process
So ideally we would need to think about the way to store all deps in-memory 