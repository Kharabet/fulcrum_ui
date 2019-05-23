#!/bin/bash

./build-alchemy-web3.sh

cd ./packages/fulcrum
yarn run build
cd ./../..
