# POC to Proxy Node App Requests

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
