#!/bin/bash

chmod a+x ./scripts/build-alchemy-web3.sh
./scripts/build-alchemy-web3.sh

cd ./packages/fulcrum
yarn run build
cd ./../..
