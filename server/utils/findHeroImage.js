import axios from 'axios';
import { unsplashClientId } from '../../secrets.json';

let unsplash = process.env.UNSPLASH_ID || unsplashClientId;

const findHeroImage = (query) => {
  return axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query
    },
    headers: {
      'Accept-Version': 'v1',
      'Authorization': 'Client-ID ' + unsplash
    }
  })
  .then(res => {
    const numResults = res.data.results.length;
    if (!numResults) {
      return false;
    } else {
      let randomIndex, image
        , horizontal = false;
      while (!horizontal) {
        randomIndex = Math.floor(Math.random() * (numResults - 1));
        image = res.data.results[randomIndex];
        horizontal = image.width > image.height;
      }
      return {
        heroURL: image.urls.full,
        heroPhotog: image.user.name,
        heroPhotogURL: image.user.links.html
      };
    }
  });
};

export default findHeroImage;
