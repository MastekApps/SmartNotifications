/// <reference path="_references.ts" />
var SN;
(function (SN) {
    var sod = SP.SOD;
    var SPAsyncScript = (function () {
        function SPAsyncScript(key, src, onLoad) {
            var _this = this;
            this.key = key;
            this.src = src;
            this.onLoad = onLoad;
            this.onLoadFunction = function () {
                if (typeof sod.notifyScriptLoadedAndExecuteWaitingJobs === "function") {
                    sod.notifyScriptLoadedAndExecuteWaitingJobs(_this.key);
                }
                if (_this.onLoad && typeof _this.onLoad === "function") {
                    _this.onLoad();
                }
            };
            this.load = function (sync) {
                if (sync === void 0) { sync = false; }
                sod.loadMultiple([_this.key], _this.onLoadFunction, sync);
            };
            this.registerDependency = function (asyncScripts) {
                asyncScripts.forEach(function (asyncScript) {
                    sod.registerSodDep(_this.key, asyncScript.key);
                });
            };
            this.registerDependencyByName = function (kies) {
                kies.forEach(function (key) {
                    sod.registerSodDep(_this.key, key);
                });
            };
            sod.registerSod(this.key, this.src);
        }
        return SPAsyncScript;
    })();
    SN.SPAsyncScript = SPAsyncScript;
})(SN || (SN = {}));
/// <reference path="_references.ts" />
var SN;
(function (SN) {
    var ManageAppViewModel = (function () {
        function ManageAppViewModel() {
            var _this = this;
            this.hasPermissions = ko.observable(false);
            this.loaded = ko.observable(false);
            this.snEnabled = ko.observable(false);
            this.customActionKey = "sn.app";
            var context = SP.ClientContext.get_current();
            context.load(context.get_web(), "EffectiveBasePermissions");
            var hostActions = context.get_web().get_userCustomActions();
            context.load(hostActions);
            context.executeQueryAsync(function () {
                var enumerator = hostActions.getEnumerator();
                var resolved = false;
                while (enumerator.moveNext()) {
                    var action = enumerator.get_current();
                    if (action.get_name() === _this.customActionKey) {
                        resolved = true;
                    }
                }
                _this.snEnabled(resolved);
                _this.loaded(true);
                _this.hasPermissions(context.get_web().get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb));
            }, function (s, e) {
                alert(e.get_message());
            });
        }
        ManageAppViewModel.prototype.toggleState = function () {
            this.snEnabled() ? this.addScriptLink() : this.removeScriptLink();
            return true;
        };
        ManageAppViewModel.prototype.removeScriptLink = function () {
            var _this = this;
            var context = SP.ClientContext.get_current();
            var hostActions = context.get_web().get_userCustomActions();
            context.load(hostActions);
            context.executeQueryAsync(function () {
                var enumerator = hostActions.getEnumerator();
                var actionToDelete = null;
                while (enumerator.moveNext()) {
                    var action = enumerator.get_current();
                    if (action.get_name() === _this.customActionKey) {
                        actionToDelete = action;
                        break;
                    }
                }
                if (actionToDelete != null) {
                    actionToDelete.deleteObject();
                }
                context.executeQueryAsync(function () {
                    var notify = SP.UI.Notify.addNotification("Smart Notifications are switched OFF", true);
                    setTimeout(function () {
                        SP.UI.Notify.removeNotification(notify);
                    }, 2 * 1000);
                }, function (s, e) {
                    alert(e.get_message());
                });
            }, function (s, e) {
                alert(e.get_message());
            });
        };
        ManageAppViewModel.prototype.addScriptLink = function () {
            var context = SP.ClientContext.get_current();
            var userCustomAction = context.get_web().get_userCustomActions().add();
            userCustomAction.set_location("ScriptLink");
            userCustomAction.set_scriptSrc("~Site/SmartNotificationsAssets/sn.scriptlink.js");
            userCustomAction.set_sequence(9);
            userCustomAction.set_title("Smart Notifications");
            userCustomAction.set_description("Smart Notifications App");
            userCustomAction.set_name(this.customActionKey);
            userCustomAction.update();
            context.executeQueryAsync(function () {
                var notify = SP.UI.Notify.addNotification("Smart Notifications are switched ON", true);
                setTimeout(function () {
                    SP.UI.Notify.removeNotification(notify);
                }, 2 * 1000);
            }, function (s, e) {
                alert(e.get_message());
            });
        };
        return ManageAppViewModel;
    })();
    SN.ManageAppViewModel = ManageAppViewModel;
})(SN || (SN = {}));
/// <reference path="_references.ts" />
var SN;
(function (SN) {
    (function (window) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            function onkoLoaded() {
                jQuery.get("../templates.html")
                    .then(function (data) {
                    jQuery("body").append("<div style=\"display:none\">" + data + "<\/div>");
                    ko.applyBindings(new SN.ManageAppViewModel(), document.getElementById("sn-manage-app"));
                });
            }
            function onjQueryLoaded() {
                if (!window.ko) {
                    var koLoader = new SN.SPAsyncScript("snknockout", "../knockout.js", onkoLoaded);
                    koLoader.load();
                }
                else {
                    onkoLoaded();
                }
            }
            var start = function () {
                SP.SOD.executeOrDelayUntilScriptLoaded(function () {
                    if (!window.jQuery) {
                        window.registerCssLink("../bootstrap.css");
                        window.registerCssLink("../styles.css");
                        var jqLoader = new SN.SPAsyncScript("snjquery", "../jquery.js", onjQueryLoaded);
                        jqLoader.load();
                    }
                    else {
                        onjQueryLoaded();
                    }
                }, "sp.js");
            };
            if (_spBodyOnLoadCalled) {
                start();
            }
            else {
                _spBodyOnLoadFunctions.push(start);
            }
        }, "sp.js");
    })(window);
})(SN || (SN = {}));
/// <reference path="../../../typings/tsd.d.ts" />
///<reference path="SPAsyncScript.ts" />
///<reference path="ManageAppViewModel.ts" />
///<reference path="Loader.ts" />

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNQQXN5bmNTY3JpcHQudHMiLCJNYW5hZ2VBcHBWaWV3TW9kZWwudHMiLCJMb2FkZXIudHMiLCJfcmVmZXJlbmNlcy50cyJdLCJuYW1lcyI6WyJTTiIsIlNOLlNQQXN5bmNTY3JpcHQiLCJTTi5TUEFzeW5jU2NyaXB0LmNvbnN0cnVjdG9yIiwiU04uTWFuYWdlQXBwVmlld01vZGVsIiwiU04uTWFuYWdlQXBwVmlld01vZGVsLmNvbnN0cnVjdG9yIiwiU04uTWFuYWdlQXBwVmlld01vZGVsLnRvZ2dsZVN0YXRlIiwiU04uTWFuYWdlQXBwVmlld01vZGVsLnJlbW92ZVNjcmlwdExpbmsiLCJTTi5NYW5hZ2VBcHBWaWV3TW9kZWwuYWRkU2NyaXB0TGluayIsIlNOLm9ua29Mb2FkZWQiLCJTTi5vbmpRdWVyeUxvYWRlZCJdLCJtYXBwaW5ncyI6IkFBQUcsdUNBQXVDO0FBRTFDLElBQVUsRUFBRSxDQXlDWDtBQXpDRCxXQUFVLEVBQUUsRUFBQyxDQUFDO0lBRWJBLElBQU9BLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBO0lBUXBCQTtRQUNDQyx1QkFBb0JBLEdBQVdBLEVBQVVBLEdBQVdBLEVBQVVBLE1BQWtCQTtZQURqRkMsaUJBOEJDQTtZQTdCb0JBLFFBQUdBLEdBQUhBLEdBQUdBLENBQVFBO1lBQVVBLFFBQUdBLEdBQUhBLEdBQUdBLENBQVFBO1lBQVVBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVlBO1lBSXhFQSxtQkFBY0EsR0FBR0E7Z0JBQ3hCQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSx1Q0FBdUNBLEtBQUtBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUN2RUEsR0FBR0EsQ0FBQ0EsdUNBQXVDQSxDQUFDQSxLQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDdkRBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxPQUFPQSxLQUFJQSxDQUFDQSxN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
