
import Logger from './Logger'
import LogContext from './LogContext'
import LogPath from './LogPath'
import logFilter from './filter'
import './globalCommands'

Logger.injector.LogContext = LogContext
Logger.injector.LogPath = LogPath
Logger.injector.logFilter = logFilter

export default Logger
