# POC to Proxy Node App Requests

---

## Install

- Install Node deps with `npm i`
- Ensure you have Docker up and running

---

## Run

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

## Troubleshooting

```sh
http_proxy=http://localhost:8001/ curl http://example.com/
https_proxy=http://localhost:8001/ curl -k https://example.com/
```