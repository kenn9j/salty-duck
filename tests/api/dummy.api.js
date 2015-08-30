'use strict';
module.exports = {
  name: 'dummyAPI',
  url: '/v1', //todo:[kj] move to config
  searchEndpoint: {
    url: '/search',
    headers: {
      DefaultOptionsHeader: {
        'Content-Type':'application/json',
        ApiKey: 123456,
        Authorization: 'bearer {{token}}'
      }
    },

    requests: {
      searchGetRequest_basic: "q=Stevie%20Wonder&type=artist",
      searchGetRequest_template: "q={{artist}}&type=artist",
      searchGetRequest_template_withTwoPlaceholders: "q={{artist1}},{{artist2}}&type=artist",
      searchGetRequest_template_withMultiplePlaceholders: "q={{artist1}}{{artist2}}&{{artist3}}type=artist"
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
        otherList: [],
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
        Id: '',
        Name: 'Bond, James'
      },
      otherGetResponse400 : {

      },
      otherGetResponse401 : {

      },
      otherGetResponse404 : {

      }

    },
    misc: {
      someSimpleText:"Some Simple Text",
      someTextTemplate:"Some placeholder was changed to '{{bindableText}}'",
      someDeepObject:{
        level: {
          one: {
            two: {
              three: {
                fourString: "some string on level 4",
                fourStringToBeBound: "some string on level {{four}}",
                fourObject: {some:1, thing: 2}
              }
            }
          }
        }
      }
    }
  }
};