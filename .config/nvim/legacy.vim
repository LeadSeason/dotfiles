
call plug#begin(stdpath('data') . '/plugged')

 " Make sure to use single quotes !!!

 " LSP Autocompleate
Plug 'neovim/nvim-lspconfig'
Plug 'hrsh7th/cmp-nvim-lsp'
Plug 'hrsh7th/cmp-buffer'
Plug 'hrsh7th/cmp-path'
Plug 'hrsh7th/cmp-cmdline'
Plug 'hrsh7th/nvim-cmp'

Plug 'hrsh7th/cmp-vsnip'
Plug 'hrsh7th/vim-vsnip'

 " File formatter
Plug 'mhartington/formatter.nvim'

 " Plug 'saadparwaiz1/cmp_luasnip'
 " Plug 'hrsh7th/vim-vsnip-integ'

 " Plug 'ray-x/guihua.lua', {'do': 'cd lua/fzy && make' }
 " Plug 'ray-x/navigator.lua'

 " Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}

Plug 'nvim-lua/plenary.nvim' " Teloescope Depentency
Plug 'nvim-telescope/telescope.nvim', { 'tag': '0.1.0' }

 " File manager
 " Plug 'ms-jpq/chadtree', {'branch': 'chad', 'do': 'python3 -m chadtree deps'}
Plug 'preservim/nerdtree'

 " Python stuff aka autocompleate and syntax
Plug 'davidhalter/jedi-vim'
Plug 'dense-analysis/ale'
 " Plug 'numirias/semshi', { 'do': ':UpdateRemotePlugins' }

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

Plug 'andweeb/presence.nvim' " Discord RichPresence
Plug 'fladson/vim-kitty' " Syntax highlighting for kitty conf file
Plug 'ntpeters/vim-better-whitespace' " Whitespace highlighting
Plug 'jiangmiao/auto-pairs' " Auto pairs

 " Statusline
Plug 'nvim-lualine/lualine.nvim'
Plug 'kyazdani42/nvim-web-devicons'

 " Plug 'vim-airline/vim-airline'
 " Plug 'vim-airline/vim-airline-themes'

 " Theme
Plug 'ray-x/aurora'
Plug 'shaunsingh/moonlight.nvim'
Plug 'catppuccin/nvim', { 'as': 'catppuccin' }

call plug#end()


 " Telescope: Ctrl + T
nnoremap <C-T> <cmd>lua require("telescope.builtin").find_files({hidden=true, layout_config={prompt_prefix="🔍"}})<cr>

 " Nerdtree: Shift + W
nnoremap W <cmd>NERDTree<cr>

 " Terminal Normal Mode: Ctrl + Esc
tnoremap <C-esc> <C-\><C-N>

 " Split Navigation: Ctrl + <Direction>
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>
nnoremap <C-Down> <C-W><C-J>
nnoremap <C-Up> <C-W><C-K>
nnoremap <C-Right> <C-W><C-L>
nnoremap <C-Left> <C-W><C-H>

if exists("g:neovide")
     " set neovide specific mappings
	 " Paste: Ctrl + Shift + V
 	 " nnoremap <C-S-V>
endif


 " python stuff
let b:ale_linters = ['flake8']
call ale#Set('python_flake8_options', '--ignore E501')

augroup FormatAutogroup
  autocmd!
  autocmd BufWritePost * FormatWrite
augroup END

if exists("g:neovide")
    " set neovide specific settings
	set guifont=Iosevka
	let g:neovide_refresh_rate = 165
	let g:neovide_cursor_vfx_mode = "wireframe"
endif

syntax enable
filetype plugin indent on
set completeopt=menu,menuone,noselect
set omnifunc=csscomplete#CompleteCSS

set ft
set autochdir
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
set relativenumber
set scrolloff=5
set termguicolors
set modeline
set tabstop=4
set shiftwidth=4

let g:aurora_italic = 1
let g:aurora_transparent = 1
let g:aurora_bold = 1
let g:aurora_darker = 1

colorscheme aurora
 " colorscheme moonlight
