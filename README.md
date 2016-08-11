<!-- $theme: gaia -->

# <div class="lead" ><img src=https://raw.githubusercontent.com/sideroad/chaus/master/static/images/logo.png width="55px" /> chaus</div>

### Build RESTful API within 5 min

---

## Running chaus

### https://chaus.herokuapp.com

---

## Why chaus?
- Easy to create RESTful API
- Easy to set linking to other resource
- Easy to manipulate data
- API document created automatically

---

## Deploy your chaus on Heroku

##### if you want to create own dashboard

##### [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sideroad/chaus)

---

## Manual Installation
You can construct chaus on your local.

### Mongo URL
Please set variable onto your environment or set `mongoURL` in `src/config.js`.

### API Host, Port
Please set API host, port in `src/config.js`.

---

### Starting application

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

---

## Color schema

###### https://coolors.co/app/82ae46-fffffc-aacf53-f6bfbc-def3de

<link href="https://raw.githubusercontent.com/sideroad/chaus/master/readme.css" rel="stylesheet" ></link>
