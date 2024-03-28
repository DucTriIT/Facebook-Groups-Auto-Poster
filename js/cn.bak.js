var s = !0,
  send = !0,
  text = "";
MsgListener.addListener(function (a, c, e) {
  a.checkout && checkUsername();
  if (a.pm && s) {
    var d = a.pm;
    s = !1;
    displayCounters();
    setTimeout(function () {
      Server.sendMessage({ total: a.total, index: a.index });
    }, 500);
    -1 != location.origin.indexOf("facebook")
      ? setTimeout(function () {
          checkUsername();
          var b = !1;
          b = contains("span", "s on your mind");
          if ("undefined" != typeof b && b.length) b[0].click(), (b = !0);
          else if (
            ((b = contains("span", "Create a public post")),
            "undefined" != typeof b && b.length)
          )
            b[0].click(), (b = !0);
          else if (
            ((b = contains("span", "Create your first post")),
            "undefined" != typeof b && b.length)
          )
            b[0].click(), (b = !0);
          else if (
            ((b = contains("span", "Write something...")),
            "undefined" != typeof b && b.length)
          )
            b[0].click(), (b = !0);
          else {
            if (
              $("span:contains('This content isn')").length &&
              $("span:contains('t available right now')").length
            )
              return addItemToReport(!1), sendNext(), !1;
            addItemToReport(!1);
            b = !1;
          }
          var f = setInterval(function () {
            var g = contains('div[aria-label="Got It"] span', "Got It");
            "undefined" != typeof g &&
              g.length &&
              (clearInterval(f),
              setTimeout(function () {
                g[0].click();
              }, 2e3));
          }, 200);
          b || findIsNotJoinedFBgroup();
          setTimeout(function () {
            text = d;
            replaceTT();
            setTimeout(function () {
              navigator.clipboard.writeText(text).then(
                function () {
                  console.log("Async: Copying to clipboard was successful!");
                  setTimeout(function () {
                    document.execCommand("paste");
                    setTimeout(function () {
                      document
                        .querySelectorAll('div[aria-label="Post"]')[0]
                        .click();
                      addItemToReport(!0);
                      setTimeout(function () {
                        sendNext();
                      }, 6e3);
                    }, 4e3);
                  }, 2e3);
                },
                function (g) {
                  console.error("Async: Could not copy text: ", g);
                  addItemToReport(!1);
                  sendNext();
                }
              );
            }, 2e3);
          }, 15e3);
        }, 15e3)
      : setTimeout(function () {
          var b = !1,
            f = contains("span", "Start a conversation in this group");
          "undefined" != typeof f && f.length
            ? ((b = !0), f[0].click())
            : ((f = contains("span", "Start a post in this group")),
              "undefined" != typeof f && f.length
                ? ((b = !0), f[0].click())
                : (addItemToReport(!1), sendNext()));
          b || findIsNotJoinedFBgroup();
          setTimeout(function () {
            checkUsername();
            text = d;
            replaceTT();
            setTimeout(function () {
              navigator.clipboard.writeText(text).then(
                function () {
                  setTimeout(function () {
                    document.execCommand("paste");
                    setTimeout(function () {
                      document
                        .querySelectorAll(
                          "button.share-actions__primary-action"
                        )[0]
                        .click();
                      addItemToReport(!0);
                      setTimeout(function () {
                        sendNext();
                      }, 6e3);
                    }, 4e3);
                  }, 2e3);
                },
                function (g) {
                  console.error("Async: Could not copy text: ", g);
                  addItemToReport(!1);
                  sendNext();
                }
              );
            }, 2e3);
          }, 5e3);
        }, 5e3);
  }
});
function findIsNotJoinedFBgroup() {
  var a = setInterval(function () {
    if (
      0 < $('div[aria-label="Join Group"]').length ||
      0 < $('.groups-header__container:contains("Request to join")').length
    )
      clearInterval(a), addItemToReport(!1), sendNext();
  }, 500);
}
function displayCounters() {
  0 == $("#gp-counters-can").length &&
    ((leftCss = "right:0;"),
    -1 < window.location.href.indexOf("linkedin") && (leftCss = ""),
    $("body")
      .eq(0)
      .append(
        '<iframe style="z-index:99999; ' +
          leftCss +
          ' height:70px; background-color: #902e2e;position: fixed;bottom: 0; display:block;" id="gp-counters-can" src="' +
          chrome.runtime.getURL("src/counter.html") +
          '"></iframe>'
      ));
}
var isPushed = !1;
function addItemToReport(a) {
  a = void 0 === a ? !1 : a;
  Store.get(["report"], function (c) {
    void 0 !== c.report &&
      (c.report.push({ g: window.location.href, s: a }),
      isPushed || ((isPushed = !0), Store.set({ report: c.report })));
  });
}
function contains(a, c) {
  var e = document.querySelectorAll(a);
  return Array.prototype.filter.call(e, function (d) {
    return RegExp(c).test(d.textContent);
  });
}
function checkUsername() {
  if (-1 < window.location.hostname.indexOf("linkedin")) {
    var a = $("code")
      .text()
      .match(/"publicIdentifier":"\S+",/gi);
    a &&
      ((a = a[0].split(",")[0].split(":")),
      1 < a.length &&
        ((a = a[1].replace(/"/gi, "")),
        Store.get(["login", "linkedinid"], function (d) {
          void 0 !== d.login &&
            d.login &&
            void 0 !== d.linkedinid &&
            (null == d.linkedinid
              ? Server.sendMessage({ updatelinkedin: a })
              : d.linkedinid != a &&
                (alert("Group poster Only works in one linkedin account"),
                window.location.reload()));
        })));
  } else if (-1 < window.location.hostname.indexOf("facebook")) {
    var c,
      e =
        (null == (c = document.cookie.match("(^|;)\\s*c_user\\s*=\\s*([^;]+)"))
          ? void 0
          : c.pop()) || "";
    "" != e &&
      Store.get(["login", "facebookid"], function (d) {
        void 0 !== d.login &&
          d.login &&
          void 0 !== d.facebookid &&
          (null == d.facebookid
            ? Server.sendMessage({ updatefacebookid: e })
            : d.facebookid != e &&
              (alert("Group poster Only works in one facebook account"),
              window.location.reload()));
      });
  }
}
var breakLoop = !0;
function getSubstitute(a) {
  a = a.replace("{", "").replace("}", "");
  return -1 < a.indexOf("|")
    ? ((a = a.split("|")), a[Math.floor(Math.random() * a.length)])
    : a;
}
function replaceTT() {
  var a = [],
    c = 0,
    e = 0;
  for (i = 0; i < text.length; i++)
    (eachChar = text.charAt(i)),
      "{" == eachChar && breakLoop
        ? ((c = i), a.push(i))
        : "}" == eachChar &&
          breakLoop &&
          ((breakLoop = !1), (e = i), a.push(i));
  a = text.slice(c, e + 1);
  text = text.substr(0, c) + text.substr(e + 1);
  e = getSubstitute(a);
  text = insert(text, c, e);
  -1 < text.indexOf("{") && ((breakLoop = !0), replaceTT());
}
function sendNext() {
  send && ((send = !1), Server.sendMessage({ delete: !0 }));
}
function insert(a, c, e) {
  return a.substr(0, c) + e + a.substr(c);
}
