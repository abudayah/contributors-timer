'use strict';

var ContrTimer = require('./contrTimer.module');

/**
 * Please read this:
 * https://github.com/abudayah/contributors-timer/blob/master/README.md
 *
 * initiate method
 * @method start
 * @param  {String} '.git/'   [default git folder]
 * @param  {String} './'      [default root folder]
 * @param  {Number} 60        [default one 60 seconds]
 */
module.exports.start = function () {
  var gitPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.git/';
  var timerLogPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './';
  var autosaveDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;

  var module = new ContrTimer({
    timerLogPath: timerLogPath,
    gitPath: gitPath,
    autosaveDuration: autosaveDuration
  });

  module.run();
};