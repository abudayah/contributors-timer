const ContrTimer = require('./contrTimer.module');

module.exports.start = function(confGitPath = '.git/', confTimerLogPath = './', autosaveDuration = 5){
  let module = new ContrTimer({
    timerLogPath: confTimerLogPath,
    gitPath: confGitPath,
    autosaveDuration: autosaveDuration
  });
  
  module.run();
};
