# Presentation

---

## What's the Point of This?

Currently we have a setup that requires alteration of the Application in order
to mock out Client and Server calls during Integration testing.

Any time you have to alter something in order to test it, it lowers the
confidence that things will behave the same way when run normally.
For example, there was a case during E2E testing where we were altering URLs to 
prefix them with the Basic-Auth credentials - in the long run, this did not play
well with the `history` API.

Ideally, we want to have our cake and eat it too. What that means in our case
is that we want to be able to run Integration tests against an unaltered
Production version of our App, yet still have the flexibility and performance
of transparently serving mocked request data that matches the payloads of actual
services (without the overhead of manually scraping response data).

---

## The Idea

The idea was to start up the App normally, then start up a Proxy to act as a
Man-In-The-Middle to intercept requests to and from the App and determine
whether or not to record, play-back, or pass-through responses. Then we just
run our Integration tests against the App just as a Client would navigate the
App via a Browser.

```sh
        Tests    # Tests start
          ⮃
        Browser  # Browser opens and requests App
          ⮃
    ┌──⭢ App ⭠──┐    # App splits off into a Client or Server flow and
    │      │      │    # requests data from external APIs.
  Client ⭠┴⭢ Server
    ⮃           ⮃
  Proxy        Proxy  # Proxy records, plays-back, or passes-through responses
    ⭣            ⭣
   APIs         APIs
```

---

## The Solution

In the end, the solution was to use a combination of Docker and Node tools.
- [Docker](https://www.docker.com/) Containers are used to encapsulate the App and Proxy
  - The App is built in Node, but could be built using any Web application languages.
  - The Proxy is utilizing [AnyProxy](http://anyproxy.io/en/), which is Node and
    gives us the familiarity of writing all the proxying logic in a language
    we're familiar with.
- [Puppeteer](https://github.com/GoogleChrome/puppeteer) is used for the Integration tests


<img width="100%" src="https://user-images.githubusercontent.com/344140/57778680-6c643c80-76d9-11e9-8613-04e6cb652262.gif" alt="let-us-eat-cake">
<div style="font-size:0">
  <img width="33%" src="https://user-images.githubusercontent.com/344140/57778677-6c643c80-76d9-11e9-859b-d418f669a3d0.gif" alt="fey-cake">
  <img width="33%" src="https://user-images.githubusercontent.com/344140/57778679-6c643c80-76d9-11e9-8950-2b8d6c58fdc5.gif" alt="gerbal-cake">
  <img width="33%" src="https://user-images.githubusercontent.com/344140/57778681-6cfcd300-76d9-11e9-90a4-7b490adde5e8.gif" alt="murray-cake">
</div>
