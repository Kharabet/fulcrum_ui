import { AbstractConnector } from '@web3-react/abstract-connector';
import invariant from 'tiny-invariant';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var chainIdToNetwork = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  56: 'bsc',
  100: 'xdai'
};
var SquarelinkConnector = /*#__PURE__*/function (_AbstractConnector) {
  _inheritsLoose(SquarelinkConnector, _AbstractConnector);

  function SquarelinkConnector(_ref) {
    var _this;

    var clientId = _ref.clientId,
        networks = _ref.networks,
        _ref$options = _ref.options,
        options = _ref$options === void 0 ? {} : _ref$options;
    var chainIds = networks.map(function (n) {
      return typeof n === 'number' ? n : n.chainId;
    });
    !chainIds.every(function (c) {
      return !!chainIdToNetwork[c];
    }) ? process.env.NODE_ENV !== "production" ? invariant(false, "One or more unsupported networks " + networks) : invariant(false) : void 0;
    _this = _AbstractConnector.call(this, {
      supportedChainIds: chainIds
    }) || this;
    _this.clientId = clientId;
    _this.networks = networks;
    _this.options = options;
    return _this;
  }

  var _proto = SquarelinkConnector.prototype;

  _proto.activate = function activate() {
    try {
      var _temp3 = function _temp3() {
        return Promise.resolve(_this3.squarelink.getProvider()).then(function (provider) {
          return Promise.resolve(provider.enable().then(function (accounts) {
            return accounts[0];
          })).then(function (account) {
            return Promise.resolve(provider.send('eth_chainId')).then(function (chainId) {
              return {
                provider: provider,
                account: account,
                chainId: chainId
              };
            });
          });
        });
      };

      var _this3 = this;

      var _temp4 = function () {
        if (!_this3.squarelink) {
          return Promise.resolve(import('squarelink')).then(function (_ref2) {
            var Squarelink = _ref2["default"];
            _this3.squarelink = new Squarelink(_this3.clientId, typeof _this3.networks[0] === 'number' ? chainIdToNetwork[_this3.networks[0]] : _this3.networks[0], _this3.options);
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getProvider = function getProvider() {
    try {
      var _this5 = this;

      return Promise.resolve(_this5.squarelink.getProvider());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getChainId = function getChainId() {
    try {
      var _this7 = this;

      return Promise.resolve(_this7.squarelink.getProvider()).then(function (provider) {
        return Promise.resolve(provider.send('eth_chainId'));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getAccount = function getAccount() {
    try {
      var _this9 = this;

      return Promise.resolve(_this9.squarelink.getProvider()).then(function (provider) {
        return Promise.resolve(provider.send('eth_accounts').then(function (accounts) {
          return accounts[0];
        }));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.deactivate = function deactivate() {};

  return SquarelinkConnector;
}(AbstractConnector);

export { SquarelinkConnector };
//# sourceMappingURL=squarelink-connector.esm.js.map
