Node apps time logger; it's helpful to count the time you spend in nodejs project.

### How this is works ?
- Getting user information form .git/config file.
- Getting current appointed branch from.
- creates a JSON file in your repo folder "timerlog.json"
- Saving duration time each 5 seconds.

### Install
`yarn add contributors-timer`
or
`npm i contributors-timer`

### Usage
Add email and user name for git

    git config user.name "Your Name"
    git config user.email email@example.com

in your app

    const timer = require('contributors-timer');
    
    const gitPath = './.git/';
    const timerlogPath = './';
    
    timer.start(gitPath, timerlogPath);
    
or in your ternmail
    
    node -e 'require("./index").start("./.git/","./")'

### Preview
    {
      "user1@example.com": {
        "name": "User 1",
        "email": "user1@example.com",
        "total_time": 4669,
        "branches":
        {
          "master": 4435,
          "develop": 234,
        }
      },
      "email@example.com": {
        ...
      }
    }
