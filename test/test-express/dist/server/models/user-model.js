"use strict";var _odata = require("@themost/data/odata");
var _dataObject = require("@themost/data/data-object");var _dec, _dec2, _class, _class2;function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {var desc = {};Object.keys(descriptor).forEach(function (key) {desc[key] = descriptor[key];});desc.enumerable = !!desc.enumerable;desc.configurable = !!desc.configurable;if ('value' in desc || desc.initializer) {desc.writable = true;}desc = decorators.slice().reverse().reduce(function (desc, decorator) {return decorator(target, property, desc) || desc;}, desc);if (context && desc.initializer !== void 0) {desc.value = desc.initializer ? desc.initializer.call(context) : void 0;desc.initializer = undefined;}if (desc.initializer === void 0) {Object.defineProperty(target, property, desc);desc = null;}return desc;}
let Account = require('./account-model');
/**
                                           * @class
                                          
                                           * @property {Date} lockoutTime
                                           * @property {number} logonCount
                                           * @property {boolean} enabled
                                           * @property {Date} lastLogon
                                           * @property {Array<Group|any>} groups
                                           * @property {number} userFlags
                                           * @property {number} id
                                           * @augments {DataObject}
                                           */let

User = (_dec = _odata.EdmMapping.entityType('User'), _dec2 =












_odata.EdmMapping.func('Me', 'User'), _dec(_class = (_class2 = class User extends Account {/**
                                                                                            * @constructor
                                                                                            */constructor() {super();} /**
                                                                                                                        * Gets the interactive user
                                                                                                                        * @param context
                                                                                                                        * @returns {Promise<User>}
                                                                                                                        */static getMe(context) {return _asyncToGenerator(function* () {return yield context.model('User').where('name').equal(context.user && context.user.name).getTypedItem();})();}}, (_applyDecoratedDescriptor(_class2, "getMe", [_dec2], Object.getOwnPropertyDescriptor(_class2, "getMe"), _class2)), _class2)) || _class);module.exports = User;
//# sourceMappingURL=user-model.js.map