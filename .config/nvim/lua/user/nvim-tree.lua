local status_ok, nvimtree = pcall(require, "nvim-tree")

if not status_ok then
    assert(false, "nvim-tree not found setup failed")
end

nvimtree.setup()
