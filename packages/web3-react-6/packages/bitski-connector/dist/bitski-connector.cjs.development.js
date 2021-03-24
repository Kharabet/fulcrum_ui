'use strict';

var abstractConnector = require('@web3-react/abstract-connector');
var bitski = require('bitski');

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var chainIdToNetwork = {
  1: 'mainnet',
  42: 'kovan'
};
var BitskiConnector = /*#__PURE__*/function (_AbstractConnector) {
  _inheritsLoose(BitskiConnector, _AbstractConnector);

  function BitskiConnector(_ref) {
    var _this;

    var clientId = _ref.clientId,
        network = _ref.network,
        redirectUri = _ref.redirectUri,
        additionalScopes = _ref.additionalScopes,
        options = _ref.options;
    _this = _AbstractConnector.call(this) || this;
    _this.bitski = new bitski.Bitski(clientId, redirectUri, additionalScopes, options);
    _this.chainId = network;
    _this.networkName = chainIdToNetwork[network];
    return _this;
  }

  var _proto = BitskiConnector.prototype;

  _proto.activate = function activate() {
    try {
      var _this3 = this;

      return Promise.resolve(_this3.getProvider()).then(function (provider) {
        return Promise.resolve(_this3.bitski.signIn().then(function (user) {
          return user.accounts[0];
        })).then(function (account) {
          return {
            provider: provider,
            account: account
          };
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getProvider = function getProvider() {
    try {
      var _this5 = this;

      return Promise.resolve(_this5.bitski.getProvider(_this5.networkName));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getChainId = function getChainId() {
    try {
      var _this7 = this;

      return Promise.resolve(_this7.chainId);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getAccount = function getAccount() {
    try {
      var _this9 = this;

      return Promise.resolve(_this9.bitski.getUser()).then(function (_this8$bitski$getUser) {
        return _this8$bitski$getUser.accounts[0] || null;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.deactivate = function deactivate() {
    try {
      var _this11 = this;

      return Promise.resolve(_this11.bitski.signOut()).then(function () {});
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return BitskiConnector;
}(abstractConnector.AbstractConnector);

exports.BitskiConnector = BitskiConnector;
//# sourceMappingURL=bitski-connector.cjs.development.js.map
