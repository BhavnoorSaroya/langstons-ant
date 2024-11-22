# Langton's ant

steps:
```
wasm-pack new langstons-ant
cd langstons-ant
cd src

# do it in the langstons-ant directory, outside of src
wasm-pack build --target=web

python3 -m http.server

# recompile
!w
```

