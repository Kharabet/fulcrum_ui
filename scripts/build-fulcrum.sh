#!/bin/bash

chmod a+x ./scripts/build-alchemy-web3.sh
./scripts/build-alchemy-web3.sh

chmod a+x ./scripts/build-web3-react.sh
./scripts/build-web3-react.sh

cd ./packages/fulcrum
yarn run build
cd ./../..
