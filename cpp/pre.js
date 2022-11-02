// Emscripten emits a reference to __dirname to construct a scriptDirectory that it never actually uses
// because our WASM is base-64-encoded into the .js file.
// https://github.com/emscripten-core/emscripten/issues/11792
// For now, just make it compile.
const __dirname = "__dirname";
