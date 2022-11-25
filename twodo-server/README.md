# TWODO-SERVER

Backend for the vulnerable twodo-app.

## Instructions to run

**NOTE**: These instructions have been tested to work with Debian GNU/Linux (Intel), Windows 10 (Intel) and MacOS Monterey (Apple M1). With Windows, Git Bash was used as terminal when testing. No guarantees that all the commands listed here will work with cmd, PowerShell and the like.

### Option 1: Docker

Running the application from a ready-built container gets rid of the need to install any application-specific dependencies locally. You only need the docker container runtime for your platform. Instructions how to install can be found at the [docker website](https://docs.docker.com/get-docker/).

Steps:
1) Install docker as instructed at the website, check that it works.
2) Run the following spell in your terminal.

`docker run -p 127.0.0.1:8088:3001/tcp juhanir/twodo-app:1.0.1`

This will first pull the twodo-app image from docker hub registry, then run a container from the image with port 3001 inside the container bound to port 8088 on the host. The host port can be anything that's in the available range, change it if needed. The app is then accessible from the browser at `http://localhost:8088`, the port being 8088 in the example case.

If this feels distasteful then check option 2.

### Option 2: Node.js

Steps:
1) Install the current LTS version of [Node.js](https://nodejs.org/en/) for your platform.
2) Install [yarn](https://classic.yarnpkg.com/en/) package manager.
3) Clone the twodo-app repository, `cd` to twodo-server in your terminal.
4) Run `yarn install`.
5) Run `yarn initdb`.
6) Run `yarn start:withUi`.

The `start:withUi` script will package the browser-side of the application from the adjacent twodo-ui project and start the server. It will download all the needed dependencies for a create-react-app, which is quite a lot, so it might take some time. Once the javascript tooling has done its thing, the app should be accessible from `http://localhost:3001`.
