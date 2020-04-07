'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var abstractConnector = require('@web3-react/abstract-connector');
var Web3ProviderEngine = _interopDefault(require('web3-provider-engine'));
var CacheSubprovider = _interopDefault(require('web3-provider-engine/subproviders/cache.js'));
var rpc_subprovider = require('@0x/subproviders/lib/src/subproviders/rpc_subprovider');
var invariant = _interopDefault(require('tiny-invariant'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var NetworkConnector = /*#__PURE__*/function (_AbstractConnector) {
  _inheritsLoose(NetworkConnector, _AbstractConnector);

  function NetworkConnector(_ref) {
    var _this;

    var urls = _ref.urls,
        defaultChainId = _ref.defaultChainId,
        pollingInterval = _ref.pollingInterval,
        requestTimeoutMs = _ref.requestTimeoutMs;
    !(defaultChainId || Object.keys(urls).length === 1) ?  invariant(false, 'defaultChainId is a required argument with >1 url')  : void 0;
    _this = _AbstractConnector.call(this, {
      supportedChainIds: Object.keys(urls).map(function (k) {
        return Number(k);
      })
    }) || this;
    _this.currentChainId = defaultChainId || Number(Object.keys(urls)[0]);
    _this.pollingInterval = pollingInterval;
    _this.requestTimeoutMs = requestTimeoutMs;
    _this.providers = Object.keys(urls).reduce(function (accumulator, chainId) {
      var _Object$assign;

      var engine = new Web3ProviderEngine({
        pollingInterval: _this.pollingInterval
      });
      engine.addProvider(new CacheSubprovider());
      engine.addProvider(new rpc_subprovider.RPCSubprovider(urls[Number(chainId)], _this.requestTimeoutMs));
      return Object.assign(accumulator, (_Object$assign = {}, _Object$assign[Number(chainId)] = engine, _Object$assign));
    }, {});
    _this.active = false;
    return _this;
  }

  var _proto = NetworkConnector.prototype;

  _proto.activate = function activate() {
    try {
      var _this3 = this;

      _this3.providers[_this3.currentChainId].start();

      _this3.active = true;
      return Promise.resolve({
        provider: _this3.providers[_this3.currentChainId],
        chainId: _this3.currentChainId,
        account: null
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getProvider = function getProvider() {
    try {
      var _this5 = this;

      return Promise.resolve(_this5.providers[_this5.currentChainId]);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getChainId = function getChainId() {
    try {
      var _this7 = this;

      return Promise.resolve(_this7.currentChainId);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.getAccount = function getAccount() {
    return Promise.resolve(null);
  };

  _proto.deactivate = function deactivate() {
    this.providers[this.currentChainId].stop();
    this.active = false;
  };

  _proto.changeChainId = function changeChainId(chainId) {
    !Object.keys(this.providers).includes(chainId.toString()) ?  invariant(false, "No url found for chainId " + chainId)  : void 0;

    if (this.active) {
      this.providers[this.currentChainId].stop();
      this.currentChainId = chainId;
      this.providers[this.currentChainId].start();
      this.emitUpdate({
        provider: this.providers[this.currentChainId],
        chainId: chainId
      });
    } else {
      this.currentChainId = chainId;
    }
  };

  return NetworkConnector;
}(abstractConnector.AbstractConnector);

exports.NetworkConnector = NetworkConnector;
//# sourceMappingURL=network-connector.cjs.development.js.map
