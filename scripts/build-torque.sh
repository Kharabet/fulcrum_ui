#!/bin/bash

./scripts/build-alchemy-web3.sh

cd ./packages/torque
yarn run build
cd ./../..
