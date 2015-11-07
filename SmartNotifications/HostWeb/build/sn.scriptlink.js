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
    var ScriptLinkViewModel = (function () {
        function ScriptLinkViewModel() {
            var _this = this;
            this.grouppedNotifications = ko.observableArray([]);
            setTimeout(function () {
                var notifications = SN.Notification.getStubNotifications();
                var uniqueColors = [];
                for (var i = 0; i < notifications.length; i++) {
                    if (uniqueColors.indexOf(notifications[i].color) === -1) {
                        uniqueColors.push(notifications[i].color);
                    }
                }
                for (var i = 0; i < uniqueColors.length; i++) {
                    var notificationItem = new SN.NotificationItems();
                    notificationItem.notifications = _this.getNotificationsByColor(uniqueColors[i], notifications);
                    notificationItem.key = uniqueColors[i];
                    notificationItem.rgba = _this.hexToRgb(uniqueColors[i]);
                    notificationItem.boxShadow = String.format("0 0 5px {0}", uniqueColors[i]);
                    _this.grouppedNotifications().push(notificationItem);
                }
                _this.grouppedNotifications.valueHasMutated();
            }, 2 * 1000);
        }
        ScriptLinkViewModel.prototype.logMouseOver = function (data) {
            console.log(data);
            console.log("over");
        };
        ScriptLinkViewModel.prototype.getNotificationsByColor = function (color, notifications) {
            return notifications.filter(function (notification) {
                return notification.color === color;
            });
        };
        ScriptLinkViewModel.prototype.hexToRgb = function (hex) {
            var bigint = parseInt(hex.substring(1, hex.length), 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            return String.format("rgba({0},{1},{2},0.7)", r, g, b);
        };
        return ScriptLinkViewModel;
    })();
    SN.ScriptLinkViewModel = ScriptLinkViewModel;
})(SN || (SN = {}));
/// <reference path="_references.ts" />
var SN;
(function (SN) {
    var NotificationItems = (function () {
        function NotificationItems() {
            this.isHovering = ko.observable(false);
        }
        return NotificationItems;
    })();
    SN.NotificationItems = NotificationItems;
})(SN || (SN = {}));
/// <reference path="_references.ts" />
var SN;
(function (SN) {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        ko.bindingHandlers.hover = {
            init: function (element, valueAccessor) {
                var value = valueAccessor();
                ko.applyBindingsToNode(element, {
                    event: {
                        mouseenter: function () { value(true); },
                        mouseleave: function () { value(false); }
                    }
                });
            }
        };
    }, "snknockout");
})(SN || (SN = {}));
/// <reference path="_references.ts" />
var SN;
(function (SN) {
    var Notification = (function () {
        function Notification() {
        }
        Notification.getStubNotifications = function () {
            var notifications = [];
            var n1 = new Notification();
            n1.color = "#FF0E0E";
            n1.text = "Some super important message";
            n1.dismissable = true;
            var n2 = new Notification();
            n2.color = "#0E2EFF";
            n2.text = "Some super important message";
            n2.dismissable = false;
            var n3 = new Notification();
            n3.color = "#059630";
            n3.text = "Some super important message";
            n3.dismissable = true;
            var n4 = new Notification();
            n4.color = "#680EFF";
            n4.text = "Some super important message";
            n4.dismissable = true;
            var n5 = new Notification();
            n5.color = "#680EFF";
            n5.text = "Some super important message";
            n5.dismissable = false;
            notifications.push(n1, n2, n3, n4, n5);
            return notifications;
        };
        return Notification;
    })();
    SN.Notification = Notification;
})(SN || (SN = {}));
/// <reference path="_references.ts" />
var SN;
(function (SN) {
    (function (window) {
        function onkoLoaded() {
            jQuery.get(_spPageContextInfo.webAbsoluteUrl + "/SmartNotificationsAssets/templates.html")
                .then(function (data) {
                jQuery("body").append("<div style=\"display:none\">" + data + "<\/div>");
                jQuery("#RibbonContainer-TabRowRight").prepend("<div class=\"sn-app-bootstrap\" id=\"sn-app-scriptlink\" data-bind=\"template: {name: 'sn-app-scriptlink-tmpl'}\">hello</div>");
                ko.applyBindings(new SN.ScriptLinkViewModel(), document.getElementById("sn-app-scriptlink"));
            });
        }
        function onjQueryLoaded() {
            if (!window.ko) {
                var koLoader = new SN.SPAsyncScript("snknockout", _spPageContextInfo.webAbsoluteUrl + "/SmartNotificationsAssets/knockout.js", onkoLoaded);
                koLoader.load();
            }
            else {
                onkoLoaded();
            }
        }
        var start = function () {
            SP.SOD.executeOrDelayUntilScriptLoaded(function () {
                if (!window.jQuery) {
                    window.registerCssLink(_spPageContextInfo.webAbsoluteUrl + "/SmartNotificationsAssets/bootstrap.css");
                    window.registerCssLink(_spPageContextInfo.webAbsoluteUrl + "/SmartNotificationsAssets/styles.css");
                    var jqLoader = new SN.SPAsyncScript("snjquery", _spPageContextInfo.webAbsoluteUrl + "/SmartNotificationsAssets/jquery.js", onjQueryLoaded);
                    jqLoader.load();
                }
                else {
                    onjQueryLoaded();
                }
            }, "sp.js");
            SP.SOD.loadMultiple(["sp.js"], function () { });
        };
        if (_spBodyOnLoadCalled) {
            start();
        }
        else {
            _spBodyOnLoadFunctions.push(start);
        }
    })(window);
})(SN || (SN = {}));
/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="SPAsyncScript.ts" />
/// <reference path="ScriptLinkViewModel.ts" />
/// <reference path="NotificationItems.ts" />
/// <reference path="HoverBinding.ts" />
/// <reference path="Notification.ts" />
/// <reference path="Loader.ts" /> 

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNQQXN5bmNTY3JpcHQudHMiLCJTY3JpcHRMaW5rVmlld01vZGVsLnRzIiwiTm90aWZpY2F0aW9uSXRlbXMudHMiLCJIb3ZlckJpbmRpbmcudHMiLCJOb3RpZmljYXRpb24udHMiLCJMb2FkZXIudHMiLCJfcmVmZXJlbmNlcy50cyJdLCJuYW1lcyI6WyJTTiIsIlNOLlNQQXN5bmNTY3JpcHQiLCJTTi5TUEFzeW5jU2NyaXB0LmNvbnN0cnVjdG9yIiwiU04uU2NyaXB0TGlua1ZpZXdNb2RlbCIsIlNOLlNjcmlwdExpbmtWaWV3TW9kZWwuY29uc3RydWN0b3IiLCJTTi5TY3JpcHRMaW5rVmlld01vZGVsLmxvZ01vdXNlT3ZlciIsIlNOLlNjcmlwdExpbmtWaWV3TW9kZWwuZ2V0Tm90aWZpY2F0aW9uc0J5Q29sb3IiLCJTTi5TY3JpcHRMaW5rVmlld01vZGVsLmhleFRvUmdiIiwiU04uTm90aWZpY2F0aW9uSXRlbXMiLCJTTi5Ob3RpZmljYXRpb25JdGVtcy5jb25zdHJ1Y3RvciIsIlNOLk5vdGlmaWNhdGlvbiIsIlNOLk5vdGlmaWNhdGlvbi5jb25zdHJ1Y3RvciIsIlNOLk5vdGlmaWNhdGlvbi5nZXRTdHViTm90aWZpY2F0aW9ucyIsIlNOLm9ua29Mb2FkZWQiLCJTTi5vbmpRdWVyeUxvYWRlZCJdLCJtYXBwaW5ncyI6IkFBQUcsdUNBQXVDO0FBRTFDLElBQVUsRUFBRSxDQXlDWDtBQXpDRCxXQUFVLEVBQUUsRUFBQyxDQUFDO0lBRWJBLElBQU9BLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBO0lBUXBCQTtRQUNDQyx1QkFBb0JBLEdBQVdBLEVBQVVBLEdBQVdBLEVBQVVBLE1BQWtCQTtZQURqRkMsaUJBOEJDQTtZQTdCb0JBLFFBQUdBLEdBQUhBLEdBQUdBLENBQVFBO1lBQVVBLFFBQUdBLEdBQUhBLEdBQUdBLENBQVFBO1lBQVVBLFdBQU1BLEdBQU5BLE1BQU1BLENBQVlBO1lBSXhFQSxtQkFBY0EsR0FBR0E7Z0JBQ3hCQSxFQUFFQSxD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QUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO1lBRXRCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUM1QkEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0E7WUFDckJBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLDhCQUE4QkEsQ0FBQ0E7WUFDekNBLEVBQUVBLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO1lBRXZCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUM1QkEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0E7WUFDckJBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLDhCQUE4QkEsQ0FBQ0E7WUFDekNBLEVBQUVBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO1lBRXRCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUM1QkEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0E7WUFDckJBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLDhCQUE4QkEsQ0FBQ0E7WUFDekNBLEVBQUVBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO1lBRXRCQSxJQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUM1QkEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0E7WUFDckJBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLDhCQUE4QkEsQ0FBQ0E7WUFDekNBLEVBQUVBLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO1lBRXZCQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUV2Q0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDdEJBLENBQUNBO1FBQ0ZGLG1CQUFDQTtJQUFEQSxDQXJDQVYsQUFxQ0NVLElBQUFWO0lBckNZQSxlQUFZQSxlQXFDeEJBLENBQUFBO0FBQ0ZBLENBQUNBLEVBdkNTLEVBQUUsS0FBRixFQUFFLFFBdUNYO0FDekNBLHVDQUF1QztBQUV4QyxJQUFVLEVBQUUsQ0EwQ1g7QUExQ0QsV0FBVSxFQUFFLEVBQUMsQ0FBQztJQUNiQSxDQUFDQSxVQUFDQSxNQUFXQTtRQUNaQTtZQUVDYSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxrQkFBa0JBLENBQUNBLGNBQWNBLEdBQUdBLDBDQUEwQ0EsQ0FBQ0E7aUJBQ3hGQSxJQUFJQSxDQUFDQSxVQUFBQSxJQUFJQTtnQkFDVEEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsOEJBQThCQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQTtnQkFDekVBLE1BQU1BLENBQUNBLDhCQUE4QkEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsK0hBQStIQSxDQUFDQSxDQUFDQTtnQkFFaExBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLHNCQUFtQkEsRUFBRUEsRUFBRUEsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzRkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFRGI7WUFDQ2MsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hCQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxnQkFBYUEsQ0FBQ0EsWUFBWUEsRUFBRUEsa0JBQWtCQSxDQUFDQSxjQUFjQSxHQUFHQSx1Q0FBdUNBLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO2dCQUN4SUEsUUFBUUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDakJBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUNkQSxDQUFDQTtRQUNGQSxDQUFDQTtRQUVEZCxJQUFJQSxLQUFLQSxHQUFHQTtZQUNYQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSwrQkFBK0JBLENBQUNBO2dCQUN0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BCQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxrQkFBa0JBLENBQUNBLGNBQWNBLEdBQUdBLHlDQUF5Q0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3RHQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxrQkFBa0JBLENBQUNBLGNBQWNBLEdBQUdBLHNDQUFzQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25HQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxnQkFBYUEsQ0FBQ0EsVUFBVUEsRUFBRUEsa0JBQWtCQSxDQUFDQSxjQUFjQSxHQUFHQSxxQ0FBcUNBLEVBQUVBLGNBQWNBLENBQUNBLENBQUNBO29CQUN4SUEsUUFBUUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLGNBQWNBLEVBQUVBLENBQUNBO2dCQUNsQkEsQ0FBQ0E7WUFDRkEsQ0FBQ0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBRUEsY0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLENBQUNBLENBQUFBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ1RBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLHNCQUFzQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDcENBLENBQUNBO0lBQ0ZBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0FBQ1pBLENBQUNBLEVBMUNTLEVBQUUsS0FBRixFQUFFLFFBMENYO0FDNUNELGtEQUFrRDtBQUdsRCx5Q0FBeUM7QUFDekMsK0NBQStDO0FBQy9DLDZDQUE2QztBQUM3Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLGtDQUFrQyIsImZpbGUiOiJzbi5zY3JpcHRsaW5rLmpzIiwic291cmNlUm9vdCI6Ii4vYXBwL3NjcmlwdGxpbmsifQ==
