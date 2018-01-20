/**
 * Contributors Timer module
 * Author: anas.abudayah@gmail.com
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var gitConfig = require('parse-git-config');
var moment = require('moment');

var timerlogfile = 'timerlog.json';

var ContrTimer = function () {
  function ContrTimer(_ref) {
    var _ref$timerLogPath = _ref.timerLogPath,
        timerLogPath = _ref$timerLogPath === undefined ? './' : _ref$timerLogPath,
        _ref$gitPath = _ref.gitPath,
        gitPath = _ref$gitPath === undefined ? '.git/' : _ref$gitPath,
        _ref$autosaveDuration = _ref.autosaveDuration,
        autosaveDuration = _ref$autosaveDuration === undefined ? 60 : _ref$autosaveDuration;

    _classCallCheck(this, ContrTimer);

    this.timerLogPath = timerLogPath;
    this.gitPath = gitPath;
    this.autosaveDuration = autosaveDuration;
    this.timerLogFilePath = this.timerLogPath + timerlogfile;
    this.timerlog;
    this.gitConfigData;
    this.currentBranch;
    this.userBlock;
  }

  _createClass(ContrTimer, [{
    key: 'run',
    value: function run() {
      var _this = this;

      this.getTimerLog().then(function (data) {
        _this.prepareUserBlock(data);
      }).catch(function () {
        return _this.createTimeLogFile().then(function () {
          return _this.prepareUserBlock(null);
        });
      });
    }

    /**
     * Read timerlog.json file
     * @method getTimerLog
     * @return {[JSON]}
     */

  }, {
    key: 'getTimerLog',
    value: function getTimerLog() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.timerLogFilePath;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

      return new Promise(function (resolve, reject) {
        fs.readFile(path, opts, function (error, data) {
          if (error) reject(error);else resolve(data);
        });
      });
    }
  }, {
    key: 'prepareUserBlock',
    value: function prepareUserBlock(data) {
      var _this2 = this;

      this.timerlog = data ? JSON.parse(data) : false;
      this.userBlock = this.getUser();
      this.currentBranch = this.getCurrentBranch();

      this.getCurrentBranch().then(function (result) {
        _this2.currentBranch = result.replace('ref: refs/heads/', '').replace('\n', '');
        _this2.startTimer();
      });
    }

    /**
     * Git current branch from .git/HEAD
     * @method getCurrentBranch
     * @return {[String]}
     */

  }, {
    key: 'getCurrentBranch',
    value: function getCurrentBranch() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gitPath + 'HEAD';
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

      return new Promise(function (resolve, reject) {
        fs.readFile(path, opts, function (error, data) {
          if (error) reject(error);else resolve(data);
        });
      });
    }

    /**
     * Get user block or create one
     * @method getUser
     * @return {[JSON]}
     */

  }, {
    key: 'getUser',
    value: function getUser() {
      this.gitConfigData = this.getGITConfig();

      var userEmail = this.gitConfigData.user.email;
      var userName = this.gitConfigData.user.name;

      if (this.timerlog && this.timerlog.hasOwnProperty(userEmail)) {
        // return user block
        return this.timerlog[userEmail];
      } else {
        this.timerlog = {};
        this.timerlog[userEmail] = {};
        // create user block and return it
        this.timerlog[userEmail]['name'] = userName;
        this.timerlog[userEmail]['email'] = userEmail;
        this.timerlog[userEmail]['total_time'] = 0;
        this.timerlog[userEmail]['branches'] = {};

        return this.timerlog[userEmail];
      }
    }

    /**
     * Get git configration file .git/config
     * @method getGITConfig
     * @return {[JSON]}
     */

  }, {
    key: 'getGITConfig',
    value: function getGITConfig() {
      return gitConfig.sync({ path: this.gitPath + 'config' });
    }
  }, {
    key: 'startTimer',
    value: function startTimer() {
      var _this3 = this;

      var counter = 0;

      if (!this.timerlog[this.userBlock.email].branches[this.currentBranch]) {
        this.timerlog[this.userBlock.email].branches[this.currentBranch] = 0;
      }

      setInterval(function () {
        counter += 1;
        _this3.timerlog[_this3.userBlock.email].branches[_this3.currentBranch] += 1;

        if (counter === _this3.autosaveDuration) {
          _this3.countTotalTime();
          _this3.updateTimerLog();
          counter = 0;
        }
        _this3.log(_this3.timerlog[_this3.userBlock.email].branches[_this3.currentBranch]);
      }, 1000);
    }
  }, {
    key: 'countTotalTime',
    value: function countTotalTime() {
      var branches = Object.values(this.timerlog[this.userBlock.email].branches);
      this.timerlog[this.userBlock.email]['total_time'] = branches.reduce(function (a, b) {
        return a + b;
      }, 0);
    }
  }, {
    key: 'updateTimerLog',
    value: function updateTimerLog() {
      fs.writeFile(this.timerLogFilePath, JSON.stringify(this.timerlog, null, 2), function (error) {
        if (error) return console.log(error); // eslint-disable-line no-console
      });
    }

    /**
     * Print total duration spent on current branch in command line
     */

  }, {
    key: 'log',
    value: function log(timer) {
      var duration = moment.duration(timer, 'seconds');
      var formatted = Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(':mm:ss');
      process.stdout.write('Duration: ' + formatted + '\r');
    }
  }]);

  return ContrTimer;
}();

module.exports = ContrTimer;