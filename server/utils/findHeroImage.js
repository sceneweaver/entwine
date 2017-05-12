import axios from 'axios';
import { unsplashClientId } from '../../secrets.json';

const findHeroImage = (query) => {
  return axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query
    },
    headers: {
      'Accept-Version': 'v1',
      'Authorization': 'Client-ID ' + unsplashClientId
    }
  })
  .then(res => {
    return {
      heroURL: res.data.results[0].urls.full,
      heroPhotog: res.data.results[0].user.name,
      heroPhotogURL: res.data.results[0].user.links.html
    };
  });
};

export default findHeroImage;
