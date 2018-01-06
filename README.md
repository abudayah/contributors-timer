Node apps time logger

### Requirments
- nodejs v8.9.3 and up

### Usage
git config user.name "Your Name"
git config user.email email@example.com


    const timer = require('contributors-timer');
    const gitPath = '../.git/';
    const timerlogPath = './';
    timer.start(gitPath, timerlogPath);

### Preview
    {
      "email@example.com": {
        "name":"Your Name",
        "email":"email@example.com",
        "total_time":45,
        "branches":
        {
          "master":45
        }
      }
    }