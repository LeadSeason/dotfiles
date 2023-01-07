local status_ok, catppuccin = pcall(require, "catppuccin")
if not status_ok then
	return
end

-- catppuccin setup
catppuccin.setup({
	flavour = "mocha", -- latte, frappe, macchiato, mocha
	background = { -- :h background
		light = "latte",
		dark = "mocha",
	},
	transparent_background = false,
	term_colors = false,
	dim_inactive = {
		enabled = true,
		shade = "dark",
		percentage = 0.15,
	},
	no_italic = false, -- Force no italic
	no_bold = false, -- Force no bold
	styles = {
		comments = { "italic" },
		conditionals = { "italic" },
		loops = {},
		functions = {},
		keywords = {},
		strings = {},
		variables = {},
		numbers = {},
		booleans = {},
		properties = {},
		types = {},
		operators = {},
	},
	color_overrides = {},
	custom_highlights = {},
	integrations = {
		barbar = true,
		cmp = true,
		dashboard = true,
		gitsigns = true,
		mason = true,
		notify = true,
		nvimtree = true,
		telescope = true,

		-- Specials
		indent_blankline = {
			enabled = true,
			colored_indent_levels = true,
		},
	},
})

vim.cmd.colorscheme("catppuccin")
