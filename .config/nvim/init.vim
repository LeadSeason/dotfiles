 " nvim v0.10.x only
colorscheme base16

syntax on
set modeline
set nospell
set number
set relativenumber
set tabstop=4
set shiftwidth=4
set autoindent
set expandtab
set noswapfile
set scrolloff=7

 " System
set clipboard+=unnamedplus
set t_Co=256
set termguicolors

 " Stay in visual mode when indenting
:vnoremap < <gv
:vnoremap > >gv

autocmd FileType named setlocal syntax=named
