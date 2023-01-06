local status_ok, mason = pcall(require, "mason")
if not status_ok then
	return
end

local mason_lspconfig_status_ok, mason_lspconfig = pcall(require, "mason-lspconfig")
if not mason_lspconfig_status_ok then
	return
end

mason.setup()
mason_lspconfig.setup()

local status_ok, lspconfig = pcall(require, "lspconfig")
if not status_ok then
	return
end

mason_lspconfig.setup_handlers {
    function (server_name)
    local capabilities = require('cmp_nvim_lsp').default_capabilities()
        lspconfig[server_name].setup {
            capabilities = capabilities
        }
    end
}
