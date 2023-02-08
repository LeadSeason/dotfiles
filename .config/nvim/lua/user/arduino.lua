local status_ok, arduinoHelper = pcall(require, "arduino-helper")
if not status_ok then
	return
end

arduinoHelper.setup{
	ui = "telescope",
}
