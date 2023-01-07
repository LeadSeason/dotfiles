-- Shorten function name
local keymap = vim.keymap.set
local map = vim.api.nvim_set_keymap

-- Silent keymap option
local opts = { silent = true }

-- Telescope
local Telescope_status_ok, _ = pcall(require, "telescope")
if Telescope_status_ok then
	local builtin = require("telescope.builtin")
	-- Telescope keymap
	keymap("n", "<C-T>", builtin.find_files, {})
end

-- nvim-tree
local Tree_status_ok, _ = pcall(require, "nvim-tree")
if Tree_status_ok then
	-- nvim-tree keymap
	keymap("n", "<C-B>", "<CMD>NvimTreeOpen<cr>", opts)
end


-- barbar
local barbar_status_ok, _ = pcall(require, "bufferline")
if barbar_status_ok then
	-- Barbar's keymap
	map("n", "W", "<CMD>BufferClose<CR>", opts)
	map("n", "<C-.>", "<CMD>BufferNext<CR>", opts)
	map("n", "<C-,>", "<CMD>BufferPrevious<CR>", opts)
end

-- if unix then use xdg-open to open urls
if vim.fn.has("unix") == 1 then
	map("", "gx", '<Cmd>call jobstart(["xdg-open", expand("<cfile>")], {"detach": v:true})<CR>', {})
end

-- Exit Terminal using CTRL + esc
keymap("n", "<C-esc>", "<C-\\><C-N>", opts)

-- CTRL + move to move to a split
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
