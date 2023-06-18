local status_ok, barbar = pcall(require, "barbar")
if not status_ok then
	return
end

barbar.setup {
  icons = {
    button = '',
    gitsigns = {
      added = {enabled = true, icon = '+'},
      changed = {enabled = true, icon = '~'},
      deleted = {enabled = true, icon = '-'},
    },
    pinned = {button = '', filename = true, separator = {right = ''}},
  },
}
-- better intigration with nvim-tree
local nvim_tree_status_ok, nvim_tree_events = pcall(require, "nvim-tree.events")
if not nvim_tree_status_ok then
	return
end

local bufferline_api_status_ok, bufferline_api = pcall(require, "bufferline.api")
if not bufferline_api_status_ok then
	return
end

local function get_tree_size()
	return require("nvim-tree.view").View.width
end

nvim_tree_events.subscribe("TreeOpen", function()
	bufferline_api.set_offset(get_tree_size())
end)

nvim_tree_events.subscribe("Resize", function()
	bufferline_api.set_offset(get_tree_size())
end)

nvim_tree_events.subscribe("TreeClose", function()
	bufferline_api.set_offset(0)
end)
