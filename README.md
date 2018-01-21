Node apps time logger; it's helpful to count the time you spend in Nodejs project.

## How does this is works ?
- Getting user information form .git/config file
- Getting current appointed branch
- Creates a JSON file in your repo folder "timerlog.json"
- Saving duration time each 60 seconds

## Install
```
yarn add contributors-timer
```
or
```
npm i contributors-timer
```

## Usage
Add email and user name for git
```
git config user.name "Your Name"
git config user.email email@example.com
```

**NodeJs App**:
```
const timer = require('contributors-timer');

const gitPath = './.git/';
const timerlogPath = './';

timer.start(gitPath, timerlogPath);
```

**Gulp**:
```
var timer = require('contributors-timer');

gulp.task('startTimer', function() {
  timer.start();
});

gulp.task('dev', ['startTimer', ...], function() {
	gulp.watch(..);
});

```

## Preview
```
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
  "user2@example.com": {
    ...
  }
}
```

## Any thing else ?
Feel free to open issue [here](https://github.com/abudayah/contributors-timer/issues)
