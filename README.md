# salty-duck
BDD Test Automation Helper

# Quacks like a duck, must be a salty duck!

This is a helper framework. In my year(s) of working with nodejs test automation I found that setting things up hard. I was drowning in the beautiful flexibility of javascript. Conventions were hard to find. So, after a fair bit of work in setting up thousands of tests for my customers I decided to share some of the basic structures. This made things easy for me and the super QA engineers that I have had the honour of working with. 

The goal of this framework is to get you started with test automation on nodejs as quickly as possible, with no special opinions on frameworks, just helpers to make things as easy as possible for you to take off.

The included frameworks cover.. 
* Cucumber-js with wd.js for WebDriver-style testing (selenium or phantomjs)
* Mocha with Chakram for API Tests 

Coming soon..
* Cucumber-js with Chakram for API Tests 
* Mocha with wd.js for API Tests 
* Mocha for angularjs tests 
* Sql helpers 
* Reporting helpers 

Read the module's documentation for more details.

## contributing

We __love__ contributions.

node-sql wouldn't be anything without all the contributors and collaborators who've worked on it.
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

##Special Thanks
to all the authors and contributors of the open source frameworks I use in salty-duck. Your work gives me and many others I work with a profession they enjoy (and a fair livelihood).  

##license
MIT