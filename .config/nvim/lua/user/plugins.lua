local fn = vim.fn

-- Automatically install packer
local install_path = fn.stdpath("data") .. "/site/pack/packer/start/packer.nvim"
if fn.empty(fn.glob(install_path)) > 0 then
	PACKER_BOOTSTRAP = fn.system({
		"git",
		"clone",
		"--depth",
		"1",
		"https://github.com/wbthomason/packer.nvim",
		install_path,
	})
	print("Installing packer close and reopen Neovim...")
	vim.cmd([[packadd packer.nvim]])
end

-- Autocommand that reloads neovim whenever you save the plugins.lua file
vim.cmd([[
  augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
  augroup end
]])

-- Use a protected call so we don't error out on first use
local status_ok, packer = pcall(require, "packer")
if not status_ok then
	return
end

-- Have packer use a popup window
packer.init({
	display = {
		open_fn = function()
			return require("packer.util").float({ border = "rounded" })
		end,
	},
})

-- Install your plugins here
return packer.startup(function(use)
	-- My plugins here
	use({ "wbthomason/packer.nvim" }) -- Have packer manage itself

	-- Color Scheme
	use({ "catppuccin/nvim", as = "catppuccin" })

	use({ "nvim-tree/nvim-web-devicons" }) -- devIcons used by multiple plugins
	use({ "glepnir/dashboard-nvim" })
	use({ "windwp/nvim-autopairs" })
	use({ "lukas-reineke/indent-blankline.nvim" }) -- indent lines
	use({ "lewis6991/impatient.nvim" }) -- Speed up lua loading
	use({ "andweeb/presence.nvim" }) -- Discord rich presence
	use({ "sQVe/sort.nvim" }) -- :Sort
	use({ "jdhao/whitespace.nvim", event = "VimEnter" })
	use({ "rcarriga/nvim-notify" }) -- Notifications bacily unused
	use({ "norcalli/nvim-colorizer.lua" }) -- Show coolors of variables
	-- use({ "ahmedkhalf/project.nvim" })
	use({ "akinsho/toggleterm.nvim", tag = "*" })
	use({ "Pocco81/auto-save.nvim", })

	-- Tab line
	use({
		"romgrk/barbar.nvim",
		wants = "nvim-web-devicons",
	})
	-- Lualine
	use({
		"nvim-lualine/lualine.nvim",
		requires = { "kyazdani42/nvim-web-devicons", opt = true },
	})

	-- Telescope
	use({
		"nvim-telescope/telescope.nvim",
		tag = "0.1.0",
		requires = { { "nvim-lua/plenary.nvim" } },
	})
	use({ "nvim-telescope/telescope-fzf-native.nvim", run = "make" })

	-- Treesitter
	use({
		"nvim-treesitter/nvim-treesitter",
		run = ":TSUpdate",
	})

	-- cmp
	use({ "hrsh7th/nvim-cmp" }) -- The completion plugin
	use({ "hrsh7th/cmp-nvim-lsp" })
	use({ "hrsh7th/cmp-buffer" }) -- buffer completions
	use({ "hrsh7th/cmp-path" }) -- path completions
	use({ "hrsh7th/cmp-cmdline" })
	use({ "saadparwaiz1/cmp_luasnip" }) -- snippet completions
	use({ "hrsh7th/cmp-nvim-lsp-signature-help" })
	use({ "hrsh7th/cmp-nvim-lua" })

	-- snippets
	use({ "L3MON4D3/LuaSnip" }) --snippet engine
	use({ "rafamadriz/friendly-snippets" }) -- a bunch of snippets to use

	-- LSP
	use({ "neovim/nvim-lspconfig" }) -- enable LSP
	use({ "williamboman/mason.nvim" }) -- simple to use language server installer
	use({ "williamboman/mason-lspconfig.nvim" })
	use({ "mhartington/formatter.nvim" }) -- Formatting can use mason installed formatters.

	-- Git
	use({ "lewis6991/gitsigns.nvim" }) -- Show Modified lines
	use({ "sindrets/diffview.nvim", requires = "nvim-lua/plenary.nvim" })

	-- File manager
	use({
		"nvim-tree/nvim-tree.lua",
		requires = {
			"nvim-tree/nvim-web-devicons", -- optional, for file icons
		},
		tag = "nightly", -- optional, updated every week. (see issue #1193)
	})

	-- Arduino
	use({ "vlelo/arduino-helper.nvim" })

	-- Automatically set up your configuration after cloning packer.nvim
	-- Put this at the end after all plugins
	if PACKER_BOOTSTRAP then
		require("packer").sync()
	end
end)
