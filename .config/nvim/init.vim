
call plug#begin(stdpath('data') . '/plugged')

 " Make sure to use single qoutes !!!

Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'hrsh7th/cmp-buffer'
Plug 'hrsh7th/cmp-path'
Plug 'hrsh7th/cmp-cmdline'
Plug 'hrsh7th/nvim-cmp'
Plug 'ray-x/guihua.lua', {'do': 'cd lua/fzy && make' }
Plug 'ray-x/navigator.lua'

Plug 'saadparwaiz1/cmp_luasnip'
Plug 'hrsh7th/vim-vsnip-integ'

Plug 'hrsh7th/cmp-vsnip'
Plug 'hrsh7th/vim-vsnip'

Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}

Plug 'nvim-lua/plenary.nvim'
Plug 'nvim-telescope/telescope.nvim', { 'tag': '0.1.0' }

Plug 'preservim/nerdtree'

 " Python stuff aka autocompleate and syntax
Plug 'davidhalter/jedi-vim'
Plug 'dense-analysis/ale'

 " C/C++
Plug 'clangd/clangd'

 " Arduino
Plug 'stevearc/vim-arduino'

 " Fish
Plug 'dag/vim-fish'

 " Bash
Plug 'WolfgangMehner/bash-support'

 " css
Plug 'ap/vim-css-color'

 " Rust
Plug 'rust-lang/rust.vim'

Plug 'andweeb/presence.nvim'
Plug 'fladson/vim-kitty'
Plug 'ntpeters/vim-better-whitespace'
Plug 'jiangmiao/auto-pairs'

 " Theme
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'ray-x/aurora'

call plug#end()

syntax enable
filetype plugin indent on

 " python stuff
let b:ale_linters = ['flake8']
call ale#Set('python_flake8_options', '--ignore E501')

nnoremap <C-T> <cmd>lua require("telescope.builtin").find_files({hidden=true, layout_config={prompt_prefix="🔍"}})<cr>

nnoremap W <cmd>NERDTree<cr>

tnoremap <C-esc> <C-\><C-N>
 " Split navigation
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>
nnoremap <C-Down> <C-W><C-J>
nnoremap <C-Up> <C-W><C-K>
nnoremap <C-Right> <C-W><C-L>
nnoremap <C-Left> <C-W><C-H>

set completeopt=menu,menuone,noselect
set omnifunc=csscomplete#CompleteCSS

set ft
set nowrap
set autoindent
set smartindent
set clipboard+=unnamedplus
set undofile
set undodir=~/.local/share/nvim/undodir/
set noswapfile
set shiftround
set mouse=a
set number
set scrolloff=5
set termguicolors
set modeline

let g:aurora_italic = 1
let g:aurora_transparent = 1
let g:aurora_bold = 1
 " let g:aurora_darker = 1

colorscheme aurora

if (&ft=='c' || &ft=='cpp')
	set tabstop=2
	set shiftwidth=2
else
	set tabstop=4
	set shiftwidth=4
endif

lua <<EOF

 -- Setup Navigator
require'navigator'.setup()

 -- Set up nvim-cmp.
local cmp = require'cmp'
cmp.setup({
	snippet = {
		expand = function(args)
		vim.fn["vsnip#anonymous"](args.body)
		end,
	},
	window = {
		-- completion = cmp.config.window.bordered(),
		-- documentation = cmp.config.window.bordered(),
	},

	mapping = cmp.mapping.preset.insert({
		['<C-b>'] = cmp.mapping.scroll_docs(-4),
		['<C-f>'] = cmp.mapping.scroll_docs(4),
		['<C-Space>'] = cmp.mapping.complete(),
		['<C-e>'] = cmp.mapping.abort(),
		['<CR>'] = cmp.mapping.confirm {
			select = true
		},
		['<Tab>'] = cmp.mapping(function(fallback)
				if cmp.visible() then
					cmp.select_next_item()
				else
					fallback()
				end
			end, { 'i', 's' }),
		['<S-Tab>'] = cmp.mapping(function(fallback)
				if cmp.visible() then
					cmp.select_prev_item()
				else
					fallback()
				end
			end, { 'i', 's' }),
	}),

	sources = cmp.config.sources({
			{ name = 'nvim_lsp' },
			{ name = 'vsnip' },
		}, {
			{ name = 'buffer' },
		})
})

 -- Set configuration for specific filetype.
cmp.setup.filetype('gitcommit', {
	sources = cmp.config.sources({
		{ name = 'cmp_git' },
	}, {
		{ name = 'buffer' },
	})
})

  -- Use buffer source for `/` and `?` (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline({ '/', '?' }, {
	mapping = cmp.mapping.preset.cmdline(),
	sources = {
		{ name = 'buffer' }
	}
})

 -- Use cmdline & path source for ':' (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline(':', {
	mapping = cmp.mapping.preset.cmdline(),
	sources = cmp.config.sources({
		{ name = 'path' }
	}, {
		{ name = 'cmdline' }
	})
})


 -- Set up lspconfig.
 -- local capabilities = require('cmp_nvim_lsp').update_capabilities(vim.lsp.protocol.make_client_capabilities())

 -- C/C++
require('lspconfig')['clangd'].setup {
	cmd = { "clangd" },
	capabilities = capabilities
}

 -- vim script
require('lspconfig')['vimls'].setup {
	cmd = { "vim-language-server" },
	capabilities = capabilities
}

 -- json
require('lspconfig')['jsonls'].setup {
	cmd = { "vscode-json-language-server" },
	capabilities = capabilities
}

 -- css
require('lspconfig')['cssls'].setup {
	cmd = { "vscode-css-language-server" },
	capabilities = capabilities
}

 -- html
require('lspconfig')['html'].setup {
	cmd = { "vscode-html-language-server" },
	capabilities = capabilities
}

 -- bash
require('lspconfig')['bashls'].setup {
	cmd = { "bash-language-server" },
	capabilities = capabilities
}

require('lspconfig')['pyright'].setup{
    on_attach = on_attach,
    flags = lsp_flags,
}

require'lspconfig'.arduino_language_server.setup {
  cmd = {
    "arduino-language-server",
    "-cli-config", "~/.arduino15/arduino-cli.yaml",
    "-fqbn", "arduino:avr:uno",
    "-cli", "arduino-cli",
    "-clangd", "clangd"
  }
}
EOF
