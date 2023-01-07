local status_ok, dashboard = pcall(require, "dashboard")
if not status_ok then
	return
end

dashboard.custom_header = {
	"",
	"███╗   ██╗ ███████╗ ██████╗  ██╗   ██╗ ██╗ ███╗   ███╗",
	"████╗  ██║ ██╔════╝██╔═══██╗ ██║   ██║ ██║ ████╗ ████║",
	"██╔██╗ ██║ █████╗  ██║   ██║ ██║   ██║ ██║ ██╔████╔██║",
	"██║╚██╗██║ ██╔══╝  ██║   ██║ ╚██╗ ██╔╝ ██║ ██║╚██╔╝██║",
	"██║ ╚████║ ███████╗╚██████╔╝  ╚████╔╝  ██║ ██║ ╚═╝ ██║",
	"╚═╝  ╚═══╝ ╚══════╝ ╚═════╝    ╚═══╝   ╚═╝ ╚═╝     ╚═╝",
}

dashboard.custom_center = {
	{ icon = "  ", desc = "Find files", action = "Telescope find_files" },
	{ icon = "  ", desc = "New file", action = "enew" },
	{ icon = "  ", desc = "Recent files", action = "Telescope oldfiles" },
	{ icon = "  ", desc = "File browser", action = "Telescope file_browser" },
	{ icon = "  ", desc = "Open config", action = "e ~/.config/nvim/" },
	{ icon = "  ", desc = "Quit", action = "q" },
}

dashboard.custom_footer = { "   Happy Hacking!   " }
dashboard.hide_statusline = false

vim.api.nvim_create_autocmd("FileType", {
	pattern = "dashboard",
	group = vim.api.nvim_create_augroup("dashboard_enter", { clear = true }),
	callback = function()
		vim.keymap.set("n", "q", ":qa<CR>", { buffer = true, silent = true })
		vim.keymap.set("n", "e", ":enew<CR>", { buffer = true, silent = true })
	end,
})
