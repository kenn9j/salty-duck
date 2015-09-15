# salty-duck
BDD Test Automation Helper

# Quacks like a duck, must be a salty duck!

This is a helper framework. In my year(s) of working with nodejs test automation I found that setting things up hard. I was drowning in the beautiful flexibility of javascript. Conventions were hard to find. So, after a fair bit of work in setting up thousands of tests for my customers I decided to share some of the basic structures. This made things easy for me and the super QA engineers that I have fun working with. 

The goal of this framework is to get you started with test automation on nodejs as quickly as possible, with no special opinions on frameworks, just helpers to make things as easy as possible for you to take off.

The included frameworks cover.. 
* Cucumber-js with webdriver.js for WebDriver-style testing (selenium or phantomjs)
* Mocha with Chakram for API Tests 

Coming soon..
* Cucumber-js with Chakram for API Tests 
* Mocha with webdriver.js for API Tests 
* Mocha for angularjs tests 
* Sql helpers 
* Reporting helpers 

## Prerequesites

* [Node.js](https://nodejs.org) or [io.js](https://iojs.org)
* [NPM](https://www.npmjs.com)

## Getting Started with a duck
To get a salty-duck going you will need to 

  1. **Install the package** - `npm install salty-duck` - or see below
  2. **Bring the salt** - have a `settings.yml` file in the root folder
  3. **Prep your kitchen** - create a folder called `tests` or whatever
  4. **Setup your bench** - create a spec file as in `myTest.spec.js`
  5. **Add salt** - `var saltyDuck = require('salty-duck').init()`
  6. **Add seasoning** (to your duck) - choose which framework(s) you need in the helper e.g `saltyDuck.addSeasoning('api-driver')` 
  7. **Bake it** Run your tests ... - Follow the conventions see [duck seasonings](seasonings.md)

### 1. Install (or get a duck)

salty-duck.js is available as an npm module.

Install globally with:

``` shell
$ npm install -g salty-duck
```

OR in your project with 


``` shell
$ mkdir myproject
$ cd myproject
$ npm install salty-duck
```

OR if you like to keep your tests with your existing node.js app, you may also define salty-duck as a development dependency of your application by including it in a package.json file.
                                                                      
    ``` json
    // package.json
    
    { "devDependencies" : {
        "salty-duck": "latest"
      }
    }
    ```
    
    Then install with `npm install --dev` 



### 2. Adding Salt (or a settings file)
Add a settings.yml (or settings.json) file to your project root. We recommend YAML as its easier for non-javascript ninjas to manipulate, allows commenting and keeps things simple.

The settings.yml has a conventional structure to follow as here. Copy the structure below. All you need initially is the environments, environments > common, environments > development. What is under them is not as per you chosen test frameworks (webdriver.js, chakram, sql, etc.)


    ``` yaml
    ---
    # some examples here
    # https://github.com/nodeca/js-yaml/blob/master/examples/sample_document.yml
      seasonings: #optional, holds a list of helpers to be loaded
        - wd
        - mssql
      environments:
        common: #these settings used on all envrionments
          dbConfig:
            user: ""
            password: ""
            server: ""
            database: ""
            port: 1433
            options:
              encrypt: false
            pool:
              max: 10
              min: 0
              idleTimeoutMillis: 30000
        development:
          debug: true #tells salty-duck to show or hide your quacks
          tags: [] #wd
          verbose_logging: false #tells salty-duck to do verbose logging
          mochaTimeout: 999999 #provides a default mocha time out
          driverStartupWaitTime: 5000 #wd uses it to wait for browser to startup 
          implicitWaitTimeout: 10000 #wd
          asyncScriptTimeout: 10000 #wd
          caps: #wd
            browserName: "chrome" #wd
          driverConfig: #wd 
            host: "localhost" #wd points to default wd server
            port: 4444 #wd points to default wd port
          driverOptions: #wd
            timeout: 30000 
            retries: 3
            retryDelay: 2000
            #wd custom for SaltyWebDriver
            testFolder: "/results" #wd reports storage location
            thinkTime: 1  #wd slow the tests down
            waitingForPageSleep: 1 
            baseUrl: "http://devop5.io" 
          dbConfig: #sql-helper
            user: ""
            password: ""
            server: ""
            database: ""
            port: 1433
            options:
              encrypt: false
            pool:
              max: 10
              min: 0
              idleTimeoutMillis: 30000 
        ci:
          debug: false
          tags: []
          debug: true
          verbose_logging: false
          mochaTimeout: 999999
          caps:
            browserName: "phantomjs"
          driverConfig:
            ...
          driverOptions:
            ...
        acceptance:
          ...
        release:
          ...
    

    
    ```
You can add the ` debug : true | false ` to turn quacking (logging) on/off

### 3-4. Prep your kitchen and test bench

Now you must..

  * create a folder called `tests` 
  * create an empty spec file e.g. `myTest.spec.js` (assuming you use mocha bdd here)

### 5. Adding Salt
To start, you need to **add salt to the duck**. Salt is your environment configuration. When a saltyDuck is initialised via saltyDuck.init(), it is expected that there is a settings.yml file in the root (see 2.)

   ```
    var saltyDuck = require('salty-duck').init();
   ```
   
   OR 
   
   ```
    var saltyDuck = require('salty-duck').init(null, 'wd', obj.environments['development']);
   ```

### 6. Duck seasonings
You can **season your duck** with a variety of small helpers from different types of tests (UI, API, database, etc)
Salty-duck has several smaller helper extensions which do all the hard work. These are 

  * **wd**: a webdriver.js helper for use with cucumber.js. This allows loading of page objects from file and attaching behaviours to the browser object for simplified test authoring using promise chaining.
  * **mssql**: a sql helper for use with Microsoft Sql Server
  * **api-driver**: a helper for loading api objects like request, response and header templates and binding them with values for use with chakram.
  * **world-factory**: (WIP) a helper to allows the user to build a cucumber world easily and maintain common test logic in a 'type' of world
  
### Api Testing
The 'api-driver' helper seasoning follows a convention to speed up api test authoring and test case management. 

  1. Setting up - Each api must have its own folder eg. *Quote*. 
  2. Add API objects to an api scope file - Within this folder, you must add a javascript file to author your api objects. Name it `*.api.js`, eg. `quote.api.js`. We logically call this api scope.
  3. Structure and author the API object, as you go, based on what is required to test the behaviours. The purpose of this is to store commonly used requests, response, header and schema templates, so if the api changes, you have a common place to change them. Basic structure is.. 

    
  
        ``` javascript - tests/Quote/quote.api.js
        
        'use strict';
        
        module.exports = { 
          name: 'Quote Provider API', 
          url: '/apiService',           
          quoteEndpoint: { 
            url: '/sauce'
            requests: {}, 
            responses: {}, 
            headers: {}, 
            misc: {} } 
          }
          
        ```
  4. As you create request objects for GET, POST, PUT within your tests, they can be placed inside the api scope file and parameterized for reuse. 
  
        GET Requests .. 
        
        ``` javascript - tests/Quote/quote.api.js
        
        'use strict';
        
        module.exports = { 
          name: 'Quote Provider API', 
          url: '/apiService',           
          quoteEndpoint: { 
            url: '/quote'
            
            requests: {
            
              //a simple request that can be reused as is by other tests
              QuoteGetRequestDefault: "q=CarInsurance&type=Caravan",
              
              //a request template that can be bound with parameters
              QuoteGetRequestTemplate: "q={{insuranceType}}&type={{vehicleType}}",
            
            }, 
            
            responses: {}, 
            headers: {}, 
            misc: {} } 
          }
          
        ```
  
  
  
  
  5. To use a behavior-driven approach, set up your api scope file, then start from the test itself and add your api objects into the api scope file. 
  6. Given you have a test spec as follows 
  
        GET Requests .. 
                
                ``` javascript - tests/Quote/quote.api.js
                
                'use strict';
                
                module.exports = { 
                  name: 'Quote Provider API', 
                  url: '/apiService',           
                  quoteEndpoint: { 
                    url: '/quote'
                    
                    requests: {
                    
                      //a simple request that can be reused as is by other tests
                      QuoteGetRequestDefault: "q=CarInsurance&type=Caravan",
                      
                      //a request template that can be bound with parameters
                      QuoteGetRequestTemplate: "q={{insuranceType}}&type={{vehicleType}}",
                      
                      //post request, can be used as is, or bound to new parameters
                      QuotePostRequest: {
                        userId: 'someUser',
                        amount: 1234.00,
                        insuranceType: 'car',
                        vehicleType: 'lmv',
                        expires: '2016-10-12'
                      }
                    
                    }, 
                    
                    responses: {}, 
                    headers: {
                          //header template
                          DefaultOptionsHeader: {
                            'Content-Type':'application/json',
                            OurApiKey: 123456,
                            Authorization: 'bearer {{token}}'
                          }
                    }, 
                    misc: {} 
                    } 
                  }
                  
                ```
                
      You can refer to any api object, or bind them with parameters as below. Note that all objects can be 
      
      * retrieved - using .template()
      * bound - using .bindParams()
      * excepting - schemas as it is expected to be static
      * bonus - endpoint.getUrl() - url will be bound by bubbling up the tree to generate the full url
      * bonus - endpoint.xxxGetRequestxx.getUrl(params) - GetRequest templates can bind and return a full url if params are provided in the getUrl call
    
        ``` .. inside a mocha describe .. it('test..', function(){ 
          
          // ARRANGE =========
          
          var dummyApiScope = saltyDuck.loadApiObjects('/RootRelative/FilePath/to/Quote/quote.api.js');
          var endpoint = dummyApiScope.quoteEndpoint;
          //use chakram to post your request and validate the results
          
          //1. prep url
          var url = endpoint.getUrl(dummyApiScope.quoteEndpoint.requests.QuoteGetRequestDefault);
          
          //for get urls, you can also
          //var url = endpoint.requests.QuoteGetRequestDefault.getUrl();
          //or also bind a GET url placeholders to an object
          //var url = endpoint.requests.QuoteGetRequestTemplate.getUrl( { insuranceType:'car', vehicleType: 'bus' });
          
          //2. prep data (if not a GET request)
          var postdata = endpoint.requests.QuotePostRequest.bindParams( 
            {
              userId: 'differentUser',
              amount: 4567.50,
              insuranceType: 'car',
              vehicleType: 'bus',
              expires: '2017-12-12'
            }
          );
          
          //3. prep headers
          // bind them as necessary with Auth tokens, content-length, etc
          
          // ACT =============
          //4. make the request
          
          var response = chakram.post(url, postdata, headers);
          
          // ASSERT ==========
          //5. get schemas for validation
          //use a JSON schema generator to quickly generate and store schemas
          expect(response).to.be... //see chakram assertions for more
          
          // END =============
          return chakram.wait(); 
          //remember to return from above line or your test will hang

        ```

Read the module's documentation for more details.



## contributing

We __love__ contributions.

salty-duck wouldn't be anything without all the contributors and collaborators who've worked on it.
If you'd like to become a collaborator here's how it's done:

1. fork the repo
2. `git pull https://github.com/(your_username)/salty-duck`
3. `cd salty-duck`
4. `npm install`
5. `npm test`

At this point the tests should pass for you.  If they don't pass please open an issue with the output or you can even send me an email directly.
My email address is on my github profile and also on every commit I contributed in the repo.

Once the tests are passing, modify as you see fit.  _Please_ make sure you write tests to cover your modifications.  Once you're ready, commit your changes and submit a pull request.

__As long as your pull request doesn't have completely off-the-wall changes and it does have tests we will almost always merge it and push it to npm__

If you think your changes are too off-the-wall, open an issue or a pull-request without code so we can discuss them before you begin.

Usually after a few high-quality pull requests and friendly interactions we will gladly share collaboration rights with you.

After all, open source belongs to everyone.

##Why the funky name?

I spent a bit of time (over a year) thinking of a suitable name. Then one evening, sitting 
with a few friends at a Nanjing restaurant, in the Chinese heartland of Burwood, Sydney I received this suggestion. 
And it stuck. 

Also, if you haven't seen my profile, I like cooking. And setting up a test is a bit like that. 
You need to arrange, act and assert. Or prepare, cook and taste.

##Special Thanks
to all the authors and contributors of the open source frameworks I use in salty-duck. Your work gives me and many others I work with a profession they enjoy (and a fair livelihood). On the shoulders of giants as one would say.

##license
MIT