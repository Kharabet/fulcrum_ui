#!/bin/bash

cd ./packages/web3-react-6

yarn install
yarn bootstrap
yarn build

cd ./../..
