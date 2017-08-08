var logger = new Chivy('fooModule/SomeClass')
var logger2 = new Chivy('barModule/AnotherClass')

logger.debug('0000.')
logger.info('1111.')
logger.warn('2222.')
logger.error('3333.')

logger2.debug('0000.')
logger2.info('1111.')
logger2.warn('2222.')
logger2.error('3333.')
