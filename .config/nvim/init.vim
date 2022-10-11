
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
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

 " Python stuff aka autocompleate and syntax
Plug 'davidhalter/jedi-vim'
Plug 'dense-analysis/ale'

 " C/C++
Plug 'clangd/clangd'

Plug 'andweeb/presence.nvim'
Plug 'dag/vim-fish'
Plug 'ap/vim-css-color'
Plug 'fladson/vim-kitty'
Plug 'rust-lang/rust.vim'
Plug 'WolfgangMehner/bash-support'
Plug 'ntpeters/vim-better-whitespace'

Plug 'ray-x/aurora'

call plug#end()

syntax enable
filetype plugin indent on

 " python stuff
let b:ale_linters = ['flake8']
call ale#Set('python_flake8_options', '--ignore E501')

nnoremap <C-T> <cmd>Telescope find_files find_command=rg,--ignore,--hidden,--files prompt_prefix=🔍<cr>

nnoremap W <cmd>NERDTree<cr>
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

set completeopt=menu,menuone,noselect
set omnifunc=csscomplete#CompleteCSS

set nowrap
set autoindent
set smartindent
set clipboard+=unnamedplus
set undofile
set undodir=~/.local/share/nvim/undodir/
set noswapfile
set tabstop=4
set shiftwidth=4
set mouse=a
set number
set termguicolors

let g:aurora_italic = 1
let g:aurora_transparent = 1
let g:aurora_bold = 1
let g:aurora_darker = 1

colorscheme aurora
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
local capabilities = require('cmp_nvim_lsp').update_capabilities(vim.lsp.protocol.make_client_capabilities())
require('lspconfig')['clangd'].setup {
	cmd = { "clangd" },
	capabilities = capabilities
}
EOF
