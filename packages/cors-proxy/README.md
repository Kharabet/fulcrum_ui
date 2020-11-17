# CORS Proxy

Add cors headers to any request.

See [cors-anywhere](https://www.npmjs.com/package/cors-anywhere).

__Note__: The current code is meant to be deployed on Heroku. You may need to adapt it.

## Config

You can configure it through env vars.

* __ORIGIN_WHITE_LIST__: list of hosts / domains that can use the proxy | eg: `["https://mydomain.com"]`
* __PORT__: server port | `default 8080`
* __HOST__: server ip | `default 0.0.0.0`

It is recommended you use the _white list_, or anyone on Internet will be able to use the proxy.

## Run

You can create `.env` file to setup env vars.

* __Development__: `npm run dev`
* __Production__: `node ./scripts/startServer`
