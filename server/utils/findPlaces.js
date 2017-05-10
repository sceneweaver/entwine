import secrets from '../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({
  key: secrets.googlemaps
});

export default function findPlaces(nounsArr) {
    let placesArr = [];

    nounsArr.forEach(noun => {
      googleMapsClient.geocode({
      address: location
    }, (err, response) => {
      if (!err) {
        placesArr.push({
          name: noun,
          coords: [response.json.results[0].geometry.location.lat, response.json.results[0].geometry.location.lng]
        })
      }
    });
  })

 console.log(placesArr)
 return placesArr;
}


  //   googleMapsClient.geocode({
  //     address: location
  //   }, (err, response) => {
  //     if (!err) {
  //       let results = response.json.results[0]
  //         , coords = results.geometry.location
  //         , style, zoom;

  //       // if location type includes park or natural_feature, use 'outdoors' map
  //       // https://developers.google.com/places/supported_types
  //       if (results.types.includes('natural_feature') || results.types.includes('park')) {
  //         style = 'outdoors';
  //         zoom = 5;
  //       } else {
  //         style = 'light';
  //       }

  //       // if location type includes
  //       if (results.types.includes('country')) zoom = 3;
  //       else if (results.types.includes('administrative_area_level_1')) zoom = 5;
  //       else if (results.types.includes('administrative_area_level_2')) zoom = 7;
  //       else if (results.types.includes('administrative_area_level_3')) zoom = 8;
  //       else zoom = 13;

  //       // google gives an object {lat: x, lng: y} -> reactmapboxgl takes it in the form of [lng, lat]
  //       this.setState({
  //         coords: [coords.lng, coords.lat],
  //         locationAddress: results.formatted_address,
  //         locationTypes: results.types,
  //         mapboxStyle: style,
  //         mapboxZoom: zoom,
  //       });
  //     } else {
  //       return "Not a Location"
  //     }
  //   });
  // }
