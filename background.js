var gpUrls = [],
  templateIds = [],
  currentTempalteIndex = 0,
  gpId = 0,
  pause = false,
  min = 30,
  max = 60,
  totalNumberOfGroupsToProcess = 0;

MsgListener.addListener(function (d, h, k) {
  d.lf &&
    (Tab.create(
      {
        url: "https://facebook.com",
        active: true,
      },
      function (a) {
        var b = a.id;
        Tab.onUpdated.addListener(function (c, e, f) {
          if ("complete" === e.status && c === b) {
            Tab.sendMessage(b, {
              checkout: true,
            });
          }
        });
      }
    ),
    Tab.create(
      {
        url: "https://linkedin.com",
        active: true,
      },
      function (a) {
        var b = a.id;
        Tab.onUpdated.addListener(function (c, e, f) {
          if ("complete" === e.status && c === b) {
            Tab.sendMessage(b, {
              checkout: true,
            });
          }
        });
      }
    ));

  d.f &&
    Tab.create(
      {
        url: "https://facebook.com",
        active: true,
      },
      function (a) {
        var b = a.id;
        Tab.onUpdated.addListener(function (c, e, f) {
          if ("complete" === e.status && c === b) {
            Tab.sendMessage(b, {
              checkout: true,
            });
          }
        });
      }
    );

  d.l &&
    Tab.create(
      {
        url: "https://linkedin.com",
        active: true,
      },
      function (a) {
        var b = a.id;
        Tab.onUpdated.addListener(function (c, e, f) {
          if ("complete" === e.status && c === b) {
            Tab.sendMessage(b, {
              checkout: true,
            });
          }
        });
      }
    );

  d.updatelinkedin &&
    Store.get(["login"], function (a) {
      if (void 0 !== a.login && a.login) {
        $.ajax({
          method: "POST",
          url: "https://gp.linked-assist.me/api/updatelinkedinidcheck",
          data: {
            linkedinid: d.updatelinkedin,
          },
          beforeSend: function (b) {
            b.setRequestHeader("Authorization", "Bearer " + a.login);
          },
          success: function (b, c, e) {
            if (-2 == b.status) {
              alert(
                "Your linkedin profile is already associated with other email."
              );
              Store.set({
                login: false,
              });
              Store.set({
                groups: [],
              });
              Store.set({
                cats: [],
              });
              Store.set({
                login: false,
              });
            } else if (b.status) {
              Store.set({
                linkedinid: updatelinkedin,
              });
            }
          },
          statusCode: {
            500: function (b) {},
          },
        });
      }
    });

  d.updatefacebookid &&
    Store.get(["login"], function (a) {
      if (void 0 !== a.login && a.login) {
        $.ajax({
          method: "POST",
          url: "https://gp.linked-assist.me/api/updatefacebookidcheck",
          data: {
            facebookid: d.updatefacebookid,
          },
          beforeSend: function (b) {
            b.setRequestHeader("Authorization", "Bearer " + a.login);
          },
          success: function (b, c, e) {
            if (-3 == b.status) {
              alert(
                "Your facebook profile is already associated with other email."
              );
              Store.set({
                login: false,
              });
              Store.set({
                groups: [],
              });
              Store.set({
                cats: [],
              });
              Store.set({
                login: false,
              });
            } else if (b.status) {
              Store.set({
                facebookid: updatefacebookid,
              });
            }
          },
          statusCode: {
            500: function (b) {},
          },
        });
      }
    });

  d.start &&
    ((pause = false),
    Store.get(
      "psubset pm min max multiTemplteIds postlist".split(" "),
      function (a) {
        if (void 0 !== a.psubset && void 0 !== a.pm) {
          gpUrls = a.psubset;
          templateIds = a.multiTemplteIds;
          currentTempalteIndex = 0;
          totalNumberOfGroupsToProcess = gpUrls.length;
          min = parseInt(a.min);
          max = parseInt(a.max);
          Store.set({
            report: [],
          });

          Tab.create(
            {
              url: gpUrls[0].group_url,
              active: true,
            },
            function (b) {
              gpId = b.id;
              Tab.onUpdated.addListener(function (c, e, f) {
                if ("complete" === e.status && c === gpId) {
                  Tab.sendMessage(gpId, {
                    pm: a.pm,
                    total: totalNumberOfGroupsToProcess,
                    index: gpUrls.length,
                  });
                }
              });
            }
          );
        }
      }
    ));

  d["delete"] &&
    (gpUrls.splice(0, 1),
    (processNextTime = parseInt(Math.random() * (max - min) + min)),
    setTimeout(function () {
      if (!pause) {
        gpUrls.length
          ? chrome.tabs.update(
              gpId,
              {
                active: true,
                url: gpUrls[0].group_url,
              },
              function (a) {}
            )
          : (Tab.remove(gpId),
            Store.set({
              pause: false,
              start: false,
            }),
            window.open(window.location.origin + "/src/report.html"));
      }
    }, 1000 * processNextTime));

  d.stop && gpId > 0 && (Tab.remove(gpId), (pause = false));

  d.pause && gpId > 0 && (pause = true);

  d.resume &&
    gpId > 0 &&
    ((pause = false),
    gpUrls.splice(0, 1),
    pause ||
      (gpUrls.length
        ? chrome.tabs.update(
            gpId,
            {
              active: true,
              url: gpUrls[0].group_url,
            },
            function (a) {}
          )
        : Tab.remove(gpId)));
});
