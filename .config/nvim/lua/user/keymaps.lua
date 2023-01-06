-- Shorten function name
local keymap = vim.keymap.set

-- Silent keymap option
local opts = { silent = true }

-- Telescope 
local Telescope_status_ok, _ = pcall(require, "telescope")

if Telescope_status_ok then
    local builtin = require('telescope.builtin')
    keymap('n', '<C-T>', builtin.find_files, {})
end

-- nvim-tree
local status_ok, _ = pcall(require, "nvim-tree")

if status_ok then
    keymap("n", "<C-B>", "<CMD>NvimTreeOpen<cr>", opts)
end


keymap("n", "<C-esc>", "<C-\\><C-N>", opts)

keymap("n", "<C-J>", "<C-W><C-J>", opts)
keymap("n", "<C-K>", "<C-W><C-K>", opts)
keymap("n", "<C-L>", "<C-W><C-L>", opts)
keymap("n", "<C-H>", "<C-W><C-H>", opts)
keymap("n", "<C-Down>", "<C-W><C-J>", opts)
keymap("n", "<C-Up>", "<C-W><C-K>", opts)
keymap("n", "<C-Right>", "<C-W><C-L>", opts)
keymap("n", "<C-Left>", "<C-W><C-H>", opts)

-- Stay in indent mode
keymap("v", "<", "<gv", opts)
keymap("v", ">", ">gv", opts)
