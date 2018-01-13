const ContrTimer = require('./contrTimer.module');

/**
 * initiate method
 * Please read this:
 * https://github.com/abudayah/contributors-timer/blob/master/README.md
 * @method start
 * @param  {String} '.git/'   [default git folder]
 * @param  {String} './'      [default root folder]
 * @param  {Number} 60        [default one 60 seconds]
 */
module.exports.start = function(gitPath = '.git/', timerLogPath = './', autosaveDuration = 60){
  const module = new ContrTimer({
    timerLogPath: timerLogPath,
    gitPath: gitPath,
    autosaveDuration: autosaveDuration
  });
  
  module.run();
};
