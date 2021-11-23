
call plug#begin('~/.vim/plugged')

 " Make sure to use single qoutes !!!

Plug 'junegunn/vim-easy-align'

Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
 " Plug 'vim-airline/lightline.vim'

Plug 'preservim/nerdtree'
Plug 'ap/vim-css-color'
Plug 'vimsence/vimsence'
Plug 'davidhalter/jedi-vim'
Plug 'nvie/vim-flake8'
 " Plug 'edkolev/tmuxline.vim'
Plug 'dag/vim-fish'

Plug 'fladson/vim-kitty'
 " Plug 'https://github.com/sagarrakshe/toggle-bool'

call plug#end()

let g:airline_powerline_fonts = 1

 " noremap <C-a> :ToggleBool<CR>
map <F5> :NERDTreeToggle<CR>

command Sw :w !sudo tee %

syntax on

set ttyfast
set number
set tabstop=4
set formatoptions-=cro
set ttymouse=sgr
set ic
filetype plugin indent on
set tabstop=4
set shiftwidth=4
set expandtab
set smartcase
set noswapfile
set undodir=~/.vim/undodir
set incsearch
