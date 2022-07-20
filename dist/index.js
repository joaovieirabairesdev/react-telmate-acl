function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var axios = _interopDefault(require('axios'));

var ACLContext = React.createContext({});
var ACLProvider = function ACLProvider(_ref) {
  var children = _ref.children,
      aclService = _ref.aclService;

  var _useState = React.useState(false),
      loading = _useState[0],
      setLoading = _useState[1];

  React.useEffect(function () {
    var load = function load() {
      try {
        setLoading(true);
        return Promise.resolve(aclService.load()).then(function () {
          setLoading(false);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    load();
  }, []);
  return React__default.createElement(ACLContext.Provider, {
    value: {
      loading: loading,
      get: aclService.getAcls,
      clear: aclService.clear
    }
  }, children);
};
var useACL = function useACL() {
  var context = React.useContext(ACLContext);
  return context;
};

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var ACLServiceError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(ACLServiceError, _Error);

  function ACLServiceError(message) {
    var _this;

    _this = _Error.call(this, message) || this;
    _this.name = 'ACLServiceError';
    return _this;
  }

  return ACLServiceError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var LS_ACL_KEY = 'user-acls';
var ACLService = /*#__PURE__*/function () {
  function ACLService(props) {
    this.props = props;
  }

  var _proto = ACLService.prototype;

  _proto.load = function load(force) {
    try {
      var _this3 = this;

      if (!_this3.props.acl_endpoint) {
        throw new ACLServiceError('No endpoint provided');
      }

      if (!_this3.props.jwtToken) {
        throw new ACLServiceError('No token provided');
      }

      var acls = _this3.getAcls();

      if (acls && (acls === null || acls === void 0 ? void 0 : acls.length) > 0 && !force) {
        return Promise.resolve();
      }

      return Promise.resolve(_catch(function () {
        return Promise.resolve(axios.get(_this3.props.acl_endpoint, {
          headers: {
            Authorization: "Bearer " + _this3.props.jwtToken
          }
        })).then(function (_ref) {
          var response = _ref.data;
          var acls = response.acl_effective_controls;
          localStorage.setItem(LS_ACL_KEY, JSON.stringify(acls));
        });
      }, function (e) {
        throw new ACLServiceError("Error when trying to get ACLs " + JSON.stringify(e));
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.clear = function clear() {
    localStorage.removeItem(LS_ACL_KEY);
  };

  _proto.getAcls = function getAcls() {
    var acls = localStorage.getItem(LS_ACL_KEY) || '[]';
    return JSON.parse(acls);
  };

  return ACLService;
}();
ACLService.ACL_INHERIT = 0;
ACLService.ACL_DENY = 1;
ACLService.ACL_READ = 2;
ACLService.ACL_EDIT = 3;

exports.ACLContext = ACLContext;
exports.ACLProvider = ACLProvider;
exports.ACLService = ACLService;
exports.useACL = useACL;
//# sourceMappingURL=index.js.map
