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

| Environment Variables        | Example                          | Default Value | Required | Remark                                                                                      |
|------------------------------|----------------------------------|---------------|----------|---------------------------------------------------------------------------------------------|
| GLOBAL_HOST                  | chaus.herokuapp.com              | localhost     |          | Please specify public domain                                                                |
| GLOBAL_PORT                  | 443                              | 443           |          | Please specify port                                                                         |
| KOIKI_CHAUS_GITHUB_CLIENT_ID | 6ca6fc443f4946d6afe1             |               |          | Please specify github client ID. Github OAuth will be disabled if does not specified        |
| CHAUS_GITHUB_CLIENT_SECRET   | f2cb996249334fef92ab010f9f1779f6 |               |          | Please specify github client secret ID. This values required when KOIKI_CHAUS_GITHUB_CLIENT_ID has specified |
| CHAUS_MONGO_URL              | mongodb://localhost:27017        |               | Required | Please specify MongoDB URL                                                                  |

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

Light background
https://coolors.co/595455-fffffc-8DB530-F98890-9093E0

Dark background
https://coolors.co/fffffc-595455-E1F6B0-F3CCCC-DBD0E6
