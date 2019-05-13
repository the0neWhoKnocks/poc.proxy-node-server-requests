# POC to Proxy Node App Requests

What I'm trying to accomplish:
- Allow an application to run as it normally would on the Client & Server with
  no requirement to add extra code to proxy requests.
- Proxy all Client & Server calls through a middleman to allow for capturing
  responses for future playback for consistent Integration testing.
  - If external requests from the Server can be recorded and played back, it
    would give us a more accurate representation of the App's functionality
    since we'd still be flowing through the actual Server request stream to get
    data, but just the data would be mocked out, not the call/response to the
    Server.

---

## Install

- Install Node deps with `npm i`
- Ensure you have Docker up and running
- Install `.anyproxy/certificates/rootCA.crt`
  - **Windows**
    - Double-Click on the cert
    - Click **Install Certificate**
    - Choose **Current User**
    - **Place all certificates in the following store** > Choose `Trusted Root Certification Authorities`
  - **OSX**
    - Double-Click on the cert
    - When Keychain pops up, you should see `AnyProxy` in the **Categories** > **Certificates** section
    - Double-click `AnyProxy` and in the new window, expand **Trust** and set
      **When using this certificate** to `Always Trust`.
    - Close the new window, and you'll be prompted to Update cert settings,
      and most likely enter your password.

---

## Run App & Proxy

Once the App and Proxy are up and running you can reach them at these addresses.
- App `http://localhost:3000`
- Proxy `http://localhost:8001`
- Proxy Web GUI `http://localhost:8002`

In reference to the commands being run.
- `d` equals `docker`
- `dc` equals `docker-compose`

```sh
## Foreground (good for seeing output in terminal)
# start
dc up
# CTRL+C to stop
dc down # clean up

## Background
# start
dc up -d
# stop
dc down
```

If you need to rebuild one of the services.
```sh
# build all
dc build

# build individually
dc build app
# or
dc build proxy
```

If you need to generate a new cert from the proxy.
```sh
d exec -it poc-proxy sh
```

---

## Run Integration Tests

**NOTE** - You should have the App and Proxy running first.

In reference to the commands being run.
- `nr` equals `npm run`

```sh
nr test
```

---

## Troubleshooting

### Tests aren't loading or taking a looooong time to load

In `proxy/Dockerfile` remove the `--silent` flag, the Proxy may be logging an
error.

### Simple CURL validation

```sh
http_proxy=http://localhost:8001/ curl http://example.com/
https_proxy=http://localhost:8001/ curl -k https://example.com/
```

### WSL & Puppeteer

Install Chrome deps
```sh
sudo apt-get install libxss1 libasound2
```
In the `launch` options for `puppeteer` I had to specify
```js
args: [
  '--disable-setuid-sandbox',
  '--no-sandbox',
],
```
to get around [sandbox issues](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox).

---

## What I Tried

### Proxying

#### MitmProxy

Pros:
- Nice CLI and Web interface, like a sparse (free) Charles Proxy.
- Can pause requests and manipulate responses within the Web GUI.

Cons:
- Addons are written in Python

### Recording/Playback Tools

#### Bokor

Pros:
- Simple setup
- Good for API testing

Cons:
- Requires all calls to go directly into the Bokor Server. So it can only target
  calls targeting the Bokor Server's domain, meaning that Client or Server
  calls to external API's would have to be manipulated in some way to record
  data.
