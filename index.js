// I don't know how!, but this shit is working and it needs to be revamped
// run node -e 'require("./index").start({})'

var fs = require('fs'), gitConfig = require('parse-git-config'), moment = require('moment');
var timerlog, gitConfigData, gitCurrentBranch, userBlock;

// configs
const autosaveDuration = 5;
const timerlogfile = 'timerlog.json';
var gitPath, timerLogPath, timerLogFilePath;

module.exports.start = function(confGitPath = '.git/', confTimerLogPath = './'){
  gitPath = confGitPath;
  timerLogFilePath = confTimerLogPath + timerlogfile;
  
  getTimerLog().then(data => {
    preperUserBlock(data);
  }).catch(error => createTimeLogFile().then(result => preperUserBlock(null) ));
}

const getTimerLog = (path = timerLogFilePath, opts = 'utf8') =>
    new Promise((resolve, reject) => {
      fs.readFile(path, opts, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    });
    
const createTimeLogFile = (path = timerLogFilePath, opts = 'utf8') =>
    new Promise((resolve, reject) => {
      fs.writeFile(path, '', (err) => {
        if (err) reject(err)
        else resolve(true)
      });
    });

const getGITCurrentBranch = (path = gitPath + 'HEAD', opts = 'utf8') =>
    new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    });
    
function getGITConfig(){
  return gitConfig.sync({path: gitPath + 'config'});
}

function getUser(){
  gitConfigData = getGITConfig();
  
  let userEmail = gitConfigData.user.email;
  let userName = gitConfigData.user.name;
  if( timerlog && timerlog.hasOwnProperty(userEmail) ){
    // return user block
    return timerlog[userEmail];
  } else {
    timerlog = {};
    timerlog[userEmail] = {};
    // create user block and return it
    timerlog[userEmail]['name'] = userName;
    timerlog[userEmail]['email'] = userEmail;
    timerlog[userEmail]['total_time'] = 0;
    timerlog[userEmail]['branches'] = {};
    
    return timerlog[userEmail];
  }
}

function preperUserBlock(data){
  timerlog = (data) ? JSON.parse(data) : false;
  userBlock = getUser();
  gitCurrentBranch = getGITCurrentBranch();
  
  getGITCurrentBranch().then(result => {
    gitCurrentBranch = result.replace('ref: refs/heads/','').replace('\n','');
    count();
  });
}

function count() {
  let counter = 0;
  if(!timerlog[userBlock.email].branches[gitCurrentBranch]){
    timerlog[userBlock.email].branches[gitCurrentBranch] = 0
  }
  setInterval(function(){
    counter += 1;
    timer = timerlog[userBlock.email].branches[gitCurrentBranch] += 1;

    if(counter === autosaveDuration ){
      countTotalTime();
      updateTimerLog();
      counter = 0;
    }
    log(timer);
  }, 1000);
}

function countTotalTime(){
  let branches = Object.values(timerlog[userBlock.email].branches);
  timerlog[userBlock.email]['total_time'] = branches.reduce((a, b) => a + b, 0);
}

function log(timer){
  let duration = moment.duration(timer, 'seconds');
  let formatted = Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss")
  process.stdout.write(`Duration: ${formatted}\r`);
}

function updateTimerLog () {
  fs.writeFile(timerLogFilePath, JSON.stringify(timerlog), function(err) {
    if(err) {
      return console.log(err);
    }
  });
}
