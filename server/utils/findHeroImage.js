import axios from 'axios';
import { unsplashClientId } from '../../secrets.json';

const findHeroImage = (query) => {
  return axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query
    },
    headers: {
      'Accept-Version': 'v1',
      'Authorization': 'Client-ID ' + process.env.UNSPLASH_ID || unsplashClientId
    }
  })
  .then(res => {
    let randomIndex, image
      , horizontal = false;
    while (!horizontal) {
      randomIndex = Math.floor(Math.random() * (res.data.results.length - 1));
      image = res.data.results[randomIndex];
      horizontal = image.width > image.height;
    }
    return {
      heroURL: image.urls.full,
      heroPhotog: image.user.name,
      heroPhotogURL: image.user.links.html
    };
  });
};

export default findHeroImage;
