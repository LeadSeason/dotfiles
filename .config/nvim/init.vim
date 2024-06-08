colorscheme vim

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

 " Remove all trailing whitespace by pressing F5
nnoremap <F5> :let \*s=@/<Bar>:%s/\\s+$//e<Bar>:let @/=\*s<Bar><CR>
