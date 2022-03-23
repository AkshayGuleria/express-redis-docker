# Express Redis Docker app

#### Requirements: [Docker Community Edition](https://www.docker.com/community-edition)
#### Default Expiry time: 
 30 seconds
#### To start the app:
 `docker-compose up`. Access via `locahost:3000`.
#### GUI:
 rediscommander is included. Access via `localhost:8081` after startup.
#### Modus operandi:
 A new session can be create in Redis using POST request. Header `ttl` takes integer value to set the expiry time. Tokens are sent as json in message body. {session-key} in uri is the unique identifier of each session. It can be used to GET and DELETE the session from Redis.
#### DO NOT:
 Take this into production use. This is a very small POC for helping development and should not be used in production as is. There is a lot of stuff like error handling, proper loggin etc are missing.

# Endpoints
## Health
```sh
GET localhost:3000
```

## Storing Data (ex: new user login)
```sh
POST localhost:3000/store/{session-key} --header "ttl:50" --data '<tokens as json>'
```

## Fetching Data (ex: session refresh check)
```sh
GET localhost:3000/store/{session-key}
```

## Delete Data (ex: session logout)
```sh
DELETE localhost:3000/store/{session-key}
```