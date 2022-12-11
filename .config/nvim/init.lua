-- load legacy.vim before everything
-- Also loads plugins
vim.cmd([[
	so ~/.config/nvim/legacy.vim
]])

-- Set up nvim-cmp
local cmp = require("cmp")
cmp.setup({
	snippet = {
		expand = function(args)
			vim.fn["vsnip#anonymous"](args.body)
		end,
	},
	window = {
		-- completion = cmp.config.window.bordered(),
		-- documentation = cmp.config.window.bordered(),
	},

	mapping = cmp.mapping.preset.insert({
		["<C-b>"] = cmp.mapping.scroll_docs(-4),
		["<C-f>"] = cmp.mapping.scroll_docs(4),
		["<C-Space>"] = cmp.mapping.complete(),
		["<C-e>"] = cmp.mapping.abort(),
		["<CR>"] = cmp.mapping.confirm({
			select = true,
		}),
		["<Tab>"] = cmp.mapping(function(fallback)
			if cmp.visible() then
				cmp.select_next_item()
			else
				fallback()
			end
		end, { "i", "s" }),
		["<S-Tab>"] = cmp.mapping(function(fallback)
			if cmp.visible() then
				cmp.select_prev_item()
			else
				fallback()
			end
		end, { "i", "s" }),
	}),

	sources = cmp.config.sources({
		{ name = "nvim_lsp" },
		{ name = "vsnip" },
	}, {
		{ name = "buffer" },
	}),
	formating = {
		format = function(entry, vim_item)
			vim_item.menu = ({
				nvim_lsp = "[LSP]",
				look = "[DICT]",
				buffer = "[BUFFER]",
			})[entry.source.name]
			return vim_item
		end,
	},
})
--/end Set up nvim-cmp

-- Set configuration for specific filetype.
cmp.setup.filetype("gitcommit", {
	sources = cmp.config.sources({
		{ name = "cmp_git" },
	}, {
		{ name = "buffer" },
	}),
})

-- Use buffer source for `/` and `?` (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline({ "/", "?" }, {
	mapping = cmp.mapping.preset.cmdline(),
	sources = {
		{ name = "buffer" },
	},
})

-- Use cmdline & path source for ':' (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline(":", {
	mapping = cmp.mapping.preset.cmdline(),
	sources = cmp.config.sources({
		{ name = "path" },
	}, {
		{ name = "cmdline" },
	}),
})

-- Set up lspconfig.
-- Deprecated feature in 1.0.0
-- local capabilities = require('cmp_nvim_lsp').update_capabilities(vim.lsp.protocol.make_client_capabilities())

-- clang
require("lspconfig")["clangd"].setup({
	capabilities = capabilities,
})
--/end clang

-- vim
require("lspconfig")["vimls"].setup({
	capabilities = capabilities,
})
--/end vim

-- json
require("lspconfig")["jsonls"].setup({
	capabilities = capabilities,
})
--/end json

-- css
require("lspconfig")["cssls"].setup({
	capabilities = capabilities,
})
--/end css

-- html
require("lspconfig")["html"].setup({
	capabilities = capabilities,
})
--/end html

-- bash
require("lspconfig")["bashls"].setup({
	capabilities = capabilities,
})
--/end bash

-- pyright
require("lspconfig")["pyright"].setup({
	on_attach = on_attach,
	flags = lsp_flags,
})
--/end pyright

-- lua
require("lspconfig")["sumneko_lua"].setup({
	capabilities = capabilities,
	settings = {
		Lua = {
			runtime = {
				-- Tell the language server which version of Lua you're using (most likely LuaJIT in the case of Neovim)
				version = "LuaJIT",
				path = runtime_path,
			},
			diagnostics = {
				-- Get the language server to recognize the `vim` global
				globals = { "vim" },
			},
			workspace = {
				-- Make the server aware of Neovim runtime files
				library = vim.api.nvim_get_runtime_file("", true),
			},
			-- Do not send telemetry data containing a randomized but unique identifier
			telemetry = {
				enable = false,
			},
		},
	},
	rootUri = null,
})
--/end lua

-- arduino
require("lspconfig").arduino_language_server.setup({
	cmd = {
		"arduino-language-server",
		"-cli-config",
		"~/.arduino15/arduino-cli.yaml",
		"-fqbn",
		"arduino:avr:uno",
		"-cli",
		"arduino-cli",
		"-clangd",
		"clangd",
	},
})
--/end arduino
--/end Nvim_lsp

-- Formatter setup
local util = require("formatter.util")

require("formatter").setup({
	logging = true,
	log_level = vim.log.levels.WARN,
	-- All formatter configurations are opt-in
	-- Formatter configurations for filetype "lua" go here
	filetype = {
		lua = {
			-- "formatter.filetypes.lua" defines default configurations for the
			-- "lua" filetype
			require("formatter.filetypes.lua").stylua,

			function()
				if util.get_current_buffer_file_name() == "special.lua" then
					return nil
				end
				return {
					exe = "stylua",
					args = {
						"--search-parent-directories",
						"--stdin-filepath",
						util.escape_path(util.get_current_buffer_file_path()),
						"--",
						"-",
					},
					stdin = true,
				}
			end,
		},
		c = {
			require("formatter.filetypes.c").clangformat,
			function()
				if util.get_current_buffer_file_name() == "special.lua" then
					return nil
				end
				return {
					exe = "clang-format",
					args = {
						"-style=GNU",
						util.escape_path(util.get_current_buffer_file_name()),
					},
					stdin = true,
				}
			end,
		},
		cpp = {
			require("formatter.filetypes.cpp").clangformat,
			function()
				return {
					exe = "clang-format",
					args = {
						"-assume-filename",
						"-style=GNU",
						util.escape_path(util.get_current_buffer_file_name()),
					},
					stdin = true,
				}
			end,
		},

		-- Default filetype formatter
		["*"] = {
			require("formatter.filetypes.any").remove_trailing_whitespace,
		},
	},
})
--/end Formatter setup

-- Lualine.nvim setup
require("lualine").setup({
	options = {
		icons_enabled = true,
		theme = "auto",
		component_separators = { left = "", right = "" },
		section_separators = { left = "", right = "" },
		disabled_filetypes = {
			statusline = {},
			winbar = {},
		},
		ignore_focus = {},
		always_divide_middle = true,
		globalstatus = false,
		refresh = {
			statusline = 1000,
			tabline = 1000,
			winbar = 1000,
		},
	},
	sections = {
		lualine_a = { "mode" },
		lualine_b = { "branch", "diff", "diagnostics" },
		lualine_c = { "filename" },
		lualine_x = { "encoding", "fileformat", "filetype" },
		lualine_y = { "progress" },
		lualine_z = { "location" },
	},
	inactive_sections = {
		lualine_a = {},
		lualine_b = {},
		lualine_c = { "filename" },
		lualine_x = { "location" },
		lualine_y = {},
		lualine_z = {},
	},
	tabline = {},
	winbar = {},
	inactive_winbar = {},
	extensions = {},
})
--/end Lualine.nvim setup

-- Setup Navigator
-- require 'navigator'.setup()
