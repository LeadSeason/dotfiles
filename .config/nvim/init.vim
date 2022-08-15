
call plug#begin(stdpath('data') . '/plugged')

 " Make sure to use single qoutes !!!

Plug 'ms-jpq/chadtree'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

 " python stuff aka autocompleate and syntax
 " Plug 'ms-jpq/coq_nvim', {'branch': 'coq'}
 " Plug 'ms-jpq/coq.artifacts', {'branch': 'artifacts'}
 " Plug 'ms-jpq/coq.thirdparty', {'branch': '3p'}
Plug 'davidhalter/jedi-vim'
Plug 'numirias/semshi', { 'do': ':UpdateRemotePlugins' }
Plug 'dense-analysis/ale'

Plug 'andweeb/presence.nvim'
Plug 'dag/vim-fish'
Plug 'ap/vim-css-color'
Plug 'fladson/vim-kitty'
Plug 'rust-lang/rust.vim'
Plug 'WolfgangMehner/bash-support'
Plug 'ntpeters/vim-better-whitespace'

call plug#end()


command Sw :w !sudo tee %  " sudo write

 " python stuff
let b:ale_linters = ['flake8']
call ale#Set('python_flake8_options', '--ignore E501')

 " Chad tree bind
nnoremap W <cmd>CHADopen<cr>
 " inoremap <expr> j ((pumvisible())?("\<C-n>"):("j"))
 " inoremap <expr> k ((pumvisible())?("\<C-p>"):("k"))

syntax enable
filetype plugin indent on

set autoindent
set smartindent

set clipboard+=unnamedplus

set undofile
set undodir=~/.local/share/nvim/undodir/
set noswapfile

set tabstop=4
set shiftwidth=4

set mouse=a
set omnifunc=csscomplete#CompleteCSS
set number

