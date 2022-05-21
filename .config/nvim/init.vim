
 " plugin call
call plug#begin(stdpath('data') . '/plugged')

 " Make sure to use single qoutes !!!

 " better status bar
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

 " python stuff aka autocompleate and syntax
Plug 'dense-analysis/ale'
Plug 'davidhalter/jedi-vim'

 " probobly not needed dont really use kitty splits
Plug 'fladson/vim-kitty'

 " read more easyly hex codes
Plug 'ap/vim-css-color'

 " discord rich pressense
Plug 'vimsence/vimsence'

 " Fish Script syntax
Plug 'dag/vim-fish'

 " Json Syntax
 " Plug 'elzr/vim-json'

 " rust syntax formating etc
 " by rust team
Plug 'rust-lang/rust.vim'

 " plugin call end
call plug#end()


command Sw :w !sudo tee %  " sudo write

 " python stuff
let b:ale_linters = ['flake8']
call ale#Set('python_flake8_options', '--ignore E501')

 " use system clipboard
set clipboard+=unnamedplus

 " Undo dir
set undofile
set undodir=/home/leadseason/.local/share/nvim/undodir/

syntax enable
filetype plugin indent on

set number
set tabstop=4
set shiftwidth=4
set mouse=a
set noswapfile

