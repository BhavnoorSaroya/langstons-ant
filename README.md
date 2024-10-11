# Langston's ant

steps:
```
wasm-pack new game-of-life
cd game-of-life
cd src

# generate a web pack
# do it in the game-of-life directory, outside of src
wasm-pack build --target=web

python3 -m http.server

# recompile
!w
```

