/**
 * Contributors Timer module
 * Author: anas.abudayah@gmail.com
 */
'use strict';

require('babel-polyfill');
var fs = require('fs');
var gitConfig = require('parse-git-config');
var moment = require('moment');

const timerlogfile = 'timerlog.json';

class ContrTimer {
  constructor({
    timerLogPath = './',
    gitPath = '.git/',
    autosaveDuration = 60
  }){
    this.timerLogPath = timerLogPath;
    this.gitPath = gitPath;
    this.autosaveDuration = autosaveDuration;
    this.timerLogFilePath = this.timerLogPath + timerlogfile;
    this.timerlog;
    this.gitConfigData;
    this.currentBranch;
    this.userBlock;
  }
  
  run(){
    this.getTimerLog().then(data => {
      this.prepareUserBlock(data);
    }).catch(() => this.createTimeLogFile().then(() =>
      this.prepareUserBlock(null)
    ));
  }
  
  /**
   * Read timerlog.json file
   * @method getTimerLog
   * @return {[JSON]}
   */
  getTimerLog(path = this.timerLogFilePath, opts = 'utf8'){
    return new Promise(function (resolve, reject){
      fs.readFile(path, opts, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }
  
  createTimeLogFile(path = this.timerLogFilePath){
    return new Promise((resolve, reject) => {
      fs.writeFile(path, '', (error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });
  }
  
  prepareUserBlock(data){
    this.timerlog = (data) ? JSON.parse(data) : false;
    this.userBlock = this.getUser();
    this.currentBranch = this.getCurrentBranch();
    
    this.getCurrentBranch().then(result => {
      this.currentBranch = result.replace('ref: refs/heads/','').replace('\n','');
      this.startTimer();
    });
  }
  
  /**
   * Git current branch from .git/HEAD
   * @method getCurrentBranch
   * @return {[String]}
   */
  getCurrentBranch (path = this.gitPath + 'HEAD', opts = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.readFile(path, opts, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });
  }
  
  /**
   * Get user block or create one
   * @method getUser
   * @return {[JSON]}
   */
  getUser(){
    this.gitConfigData = this.getGITConfig();
    
    let userEmail = this.gitConfigData.user.email;
    let userName = this.gitConfigData.user.name;
    
    if( this.timerlog && this.timerlog.hasOwnProperty(userEmail) ){
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
  getGITConfig(){
    return gitConfig.sync({path: this.gitPath + 'config'});
  }
  
  startTimer() {
    let counter = 0;
    
    if(!this.timerlog[this.userBlock.email].branches[this.currentBranch]){
      this.timerlog[this.userBlock.email].branches[this.currentBranch] = 0;
    }
    
    setInterval(() => {
      counter += 1;
      this.timerlog[this.userBlock.email].branches[this.currentBranch] += 1;

      if(counter === this.autosaveDuration ){
        this.countTotalTime();
        this.updateTimerLog();
        counter = 0;
      }
      this.log(this.timerlog[this.userBlock.email].branches[this.currentBranch]);
    }, 1000);
  }

  countTotalTime (){
    let branches = Object.values(this.timerlog[this.userBlock.email].branches);
    this.timerlog[this.userBlock.email]['total_time'] = branches.reduce((a, b) => a + b, 0);
  }

  updateTimerLog (){
    fs.writeFile(this.timerLogFilePath, JSON.stringify(this.timerlog, null, 2), function(error) {
      if(error)
        return console.log(error); // eslint-disable-line no-console
    });
  }
  
  /**
   * Print total duration spent on current branch in command line
   */
  log (timer){
    let duration = moment.duration(timer, 'seconds');
    let formatted = Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(':mm:ss');
    process.stdout.write(`Duration: ${formatted}\r`);
  }
}

module.exports = ContrTimer;
