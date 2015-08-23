'use strict';
module.exports = {
  name: 'dummyAPI',
  baseUrl: 'https://api.spotify.com/v1', //todo:[kj] move to config
  headers: {
    'Content-Type':'application/json',
    ApiKey: 123456,
    Authorization: 'bearer {{token}}'
  },
  searchEndpoint: {
    url: '/search',
    headers: {
      version:"{{version}}"
    },

    requests: {
      searchGetRequest_basic: "q=Stevie%20Wonder&type=artist",
      searchGetRequest_template: "q={{artist}}&type=artist"
    },
    responses: {
      searchGetResponse200 : {

      },
      searchGetResponse400 : {

      },
      searchGetResponse401 : {

      }

    }
  },
  artistsEndpoint : {
    url: '/artists/{{artistId}}/top-tracks',
    headers: {

    },
    requests: {
      artistsGetRequestTopTracks_forGB: '?country=GB',
      artistsGetRequestTopTracks_forCountry: '?country={{countryCode}}'
    },
    responses: {

    }
  },
  otherEndpoint: {
    //url: '/search',
    requests: {
      otherGetRequest_basic: "?someQueryString",
      otherPostRequest_basic: {
        otherName: "",
        otherList: [1,2,3,4],
        otherObject: { some:'deepObject' }
      },
      otherPutRequest_basic: {
        otherName: "",
        otherList: [1,2,3,4],
        otherObject: { some:'deepObject' }
      }
    },
    responses: {
      otherGetResponse200 : {

      },
      otherGetResponse400 : {

      },
      otherGetResponse401 : {

      }

    }
  }


};