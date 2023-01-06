local status_ok, telescope = pcall(require, "telescope")

if not status_ok then
    assert(false, "telescope not found setup failed")
end


telescope.setup{
  defaults = {
    -- Default configuration for telescope goes here:
    prompt_prefix = "🔍",
    selection_caret = " ",
    path_display = { "smart" },
    file_ignore_patterns = { ".git/", "node_modules" },
  },
  extensions = {
    -- Your extension configuration goes here:
    -- extension_name = {
    --   extension_config_key = value,
    -- }
    -- please take a look at the readme of the extension you want to configure
    fzf = {
        fuzzy = true,
        override_generic_sorter = true,
        override_file_sorter = true,
        case_mode = "smart_case",
    },
  }
}

telescope.load_extension("fzf")
