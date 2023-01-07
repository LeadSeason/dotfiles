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
	keymap("n", "tt", builtin.find_files, {})
	keymap("n", "tb", builtin.buffers, {})
	keymap("n", "tb", builtin.live_grep, {})
end

-- nvim-tree
local Tree_status_ok, _ = pcall(require, "nvim-tree")
if Tree_status_ok then
	-- nvim-tree keymap
	keymap("n", "<C-B>", "<CMD>NvimTreeToggle<cr>", opts)
end


-- barbar
local barbar_status_ok, _ = pcall(require, "bufferline")
if barbar_status_ok then
	-- Barbar's keymap
	map("n", "W", "<CMD>BufferClose<CR>", opts)
	map("n", "<C-.>", "<CMD>BufferNext<CR>", opts)
	map("n", "<C-,>", "<CMD>BufferPrevious<CR>", opts)
end

local toggleterm_status_ok, _ = pcall(require, "toggleterm")
if toggleterm_status_ok then
	-- Toggle Term bindings

	-- Exit term with esc
	map("t", "<esc>", [[<C-\><C-N>]], opts)
	-- Jump out of term with Ctrl + move
	map("t", "<C-h>", [[<C-\><C-N><C-W>h]], opts)
	map("t", "<C-j>", [[<C-\><C-N><C-W>j]], opts)
	map("t", "<C-k>", [[<C-\><C-N><C-W>k]], opts)
	map("t", "<C-l>", [[<C-\><C-N><C-W>l]], opts)
	map("t", "<C-Down>",	[[<C-\><C-N><C-W>j]], opts)
	map("t", "<C-Up>",		[[<C-\><C-N><C-W>k]], opts)
	map("t", "<C-Right>",	[[<C-\><C-N><C-W>l]], opts)
	map("t", "<C-Left>",	[[<C-\><C-N><C-W>h]], opts)

	map("n", "<C-S-t>", "<cmd>terminal<cr>", opts)
	map("t", "<C-S-t>", "<cmd>terminal<cr>", opts)
	map("n", "<C-S-n>", "<cmd>ToggleTerm<cr>", opts)
	map("t", "<C-S-n>", "<cmd>ToggleTerm<cr>", opts)
end

-- if unix then use xdg-open to open urls
if vim.fn.has("unix") == 1 then
	map("", "gx", '<Cmd>call jobstart(["xdg-open", expand("<cfile>")], {"detach": v:true})<CR>', {})
end

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
