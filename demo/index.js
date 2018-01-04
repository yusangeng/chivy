
var logger_App_Main = new Chivy('App/Main')
var logger_App_Timeline = new Chivy('App/Timeline')

var logger_UIComponent_Button = new Chivy('UIComponents/Button')
var logger_UIComponent_Select = new Chivy('UIComponents/Select')
var logger_UIComponent_GroupBox = new Chivy('UIComponents/GroupBox')

function run () {
  var args = Array.prototype.slice.call(arguments)

  args.forEach(function (logger) {
    logger.debug('This is a debug log.')
    logger.info('This is a info log.')
    logger.warn('This is a warning log.')
    logger.error('This is a error log.')
  })
}

run(logger_App_Main, logger_App_Timeline,
  logger_UIComponent_Button, logger_UIComponent_Select, logger_UIComponent_GroupBox)
