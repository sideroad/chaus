# <img src="https://raw.githubusercontent.com/sideroad/chaus/master/static/images/logo.png" width="40px"> chaus
Build RESTful API within 5 min

## Why chaus?
- Easy to create REST API without any development
- Easy to set linking to other resource
- Easy to understand each resource relationship
- Easy to manipulate data
- API document created automatically

## Running chaus
https://chaus.herokuapp.com


# Installation
Deploy your chaus on Heroku  [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sideroad/chaus)

### Manual Installation
You can construct chaus on your local.

##### Mongo URL
Please set variable onto your environment or set `mongoURL` in `src/config.js`.

##### API Host, Port
Please set API host, port in `src/config.js`.

##### Starting application

```
npm i -g pm2
npm i
npm run build
npm start
...
# app-0 ==> ✅  chaus is running, talking to API server.
# app-0 ==> 💻  Open http://localhost:3000 in a browser to view the # app.
# app-0 ### loading lang files
# app-0 ### loading lang files
# app-0 warn: parser plugin 'param' not found in block: 0
# app-0 info: Done.
```
open http://localhost:3000

## Color schema

###### https://coolors.co/app/82ae46-fffffc-aacf53-f6bfbc-def3de
