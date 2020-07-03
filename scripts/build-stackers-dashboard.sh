#!/bin/bash
chmod a+x ./scripts/build-alchemy-web3.sh
./scripts/build-alchemy-web3.sh

cd ./packages/stackers-dashboard
yarn run build
cd ./../..
