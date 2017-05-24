# entwine

entwine is a content management system that changes how we create and tell stories on the web. users can easily publish stories on our platform, incorporating interactive maps, chat heads, and hero images. you can find our deployed app at http://entwine.herokuapp.com/

## technology stack: 
### core
* node.js
* express
* react-redux
* postgreSQL database via sequelize

### key additional modules
* mapbox-gl / react-mapbox-gl
* google maps geocoding
* wikijs
* draft-js (rich text editing)
* materialize-css / material-ui 

## sources of inspiration
* https://www.bloomberg.com/graphics/2015-paul-ford-what-is-code/
* http://highline.huffingtonpost.com/miracleindustry/americas-most-admired-lawbreaker/chapter-5.html
* http://www.nytimes.com/projects/2012/snow-fall/#/?part=descent-begins

## local setup instructions
* `npm run build-dev` and `npm run start-dev` for webpack build and server start
* `npm run seed` to seed database
* `npm test` to run all tests (mocha, chai, sinon, enzyme)

