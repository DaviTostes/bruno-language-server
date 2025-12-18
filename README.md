# Bruno Language Server

LSP implementation for [Bruno](https://www.usebruno.com/) API client files (`.bru`).

## Features

- ✅ Autocompletion for Bruno blocks (meta, get, post, headers, etc)
- ✅ Snippets with placeholders
- ✅ `bru.*` API completions in scripts
- ✅ `res.*` completions in post-response scripts
- ✅ `req.*` completions in pre-request scripts
- ✅ Diagnostics for syntax errors
- ✅ Header suggestions

## Installation

### Via NPM (Recommended)
```bash
npm install -g bruno-language-server
```

### Via curl
```bash
curl -fsSL https://raw.githubusercontent.com/seu-usuario/bruno-language-server/main/install.sh | bash
```

### Manual
```bash
git clone https://github.com/seu-usuario/bruno-language-server.git
cd bruno-language-server
npm install
npm run compile
```

## Configuration

### Neovim
```lua
vim.filetype.add({
  extension = {
    bru = 'bru',
  },
})

vim.lsp.config("bruno_ls", {
  cmd = { 'bruno-language-server', '--stdio' },
  filetypes = { 'bru' },
})
```

### VS Code

Install the extension from the marketplace (coming soon) or configure manually:
```json
{
  "bruno-lsp.server.path": "/path/to/bruno-language-server"
}
```

## Development
```bash
git clone https://github.com/seu-usuario/bruno-language-server.git
cd bruno-language-server
npm install
npm run compile
npm run watch  # watch mode
```

## License

MIT
