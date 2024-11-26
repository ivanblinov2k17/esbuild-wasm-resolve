import { Compiler, Resolver } from '@sinclair/esbuild-wasm-resolve'

// ----------------------------------------------------------
// FileSystem
// ----------------------------------------------------------

const filesystem = new Map<string, string>()
filesystem.set(
  '/some-module.ts',
  `
    export const text = 'I am text from another module';
  `,
)
filesystem.set(
  '/index.ts',
  `
    import {text} from './some-module.ts'
    const textarea = document.getElementById('textarea')
    textarea.value = text;
  `,
)

// ----------------------------------------------------------
// Resolver
// ----------------------------------------------------------

export class MemoryResolver implements Resolver {
  constructor(private readonly filesystem: Map<string, string>) {}
  public resolve(path: string) {
    if (!this.filesystem.has(path)) throw Error(`${path} not found`)
    return this.filesystem.get(path)!
  }
}

// ----------------------------------------------------------
// Compiler
// ----------------------------------------------------------

const resolver = new MemoryResolver(filesystem)
const compiler = new Compiler(resolver, { wasmURL: 'esbuild.wasm' })
const code = await compiler.compile('/index.ts', { format: 'esm' });
bindIframe(code)

console.log(code)


// ----------------------------------------------------------
// failed attempt to bundle react + devextreme from vite app
// ----------------------------------------------------------
// const compiler = new Compiler({
    
//     resolve: path => fetch('http://192.168.10.191:3145' + path).then(res => res.text())

// }, { wasmURL: 'esbuild.wasm' })
// const code = await compiler.compile('/src/App.tsx', { format: 'esm' });

const textarea1 = document.getElementById('module1')
const textarea2 = document.getElementById('module2')

function initializeTextArea() {
  // @ts-expect-error
  textarea1!.value = filesystem.get('/index.ts')
  // @ts-expect-error
  textarea2!.value = filesystem.get('/some-module.ts')

}
initializeTextArea();


function bindIframe(code: string) {
  // @ts-expect-error
  const doc = document.getElementById('iframe').contentWindow.document;
  doc.open();
  doc.write( `
  <html>
    <head>
      
    </head>
    <body>
      <textarea id="textarea" style="width: 500px; height: 300px;"></textarea>
      <script>
        ${code}
      </script>
    </body>
  </html>
  `);
  doc.close();
}

function trackChanges(element: any, name: string) {
  element!.addEventListener('input', async function() {
    filesystem.set(
      name,
      element!.value
    )
    const code = await compiler.compile('/index.ts', { format: 'esm' });

    console.log(code)
    bindIframe(code)
  }, false);
}
trackChanges(textarea1, '/index.ts');
trackChanges(textarea2, '/some-module.ts');

