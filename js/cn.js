let isFirstTime = true;
let canSend = true;
let messageText = "";

MsgListener.addListener(function (message, context, event) {
  if (message.checkout) {
    checkUsername();
  }

  if (message.pm && isFirstTime) {
    const privateMessage = message.pm;
    isFirstTime = false;
    displayCounters();

    setTimeout(function () {
      Server.sendMessage({ total: message.total, index: message.index });
    }, 500);

    if (location.origin.includes("facebook")) {
      handleFacebook(privateMessage);
    } else {
      handleOtherPlatforms(privateMessage);
    }
  }
});

function handleFacebook(privateMessage) {
  setTimeout(function () {
    checkUsername();
    let isClicked = false;

    const elements = [
      "s on your mind",
      "Create a public post",
      "Create your first post",
      "Write something...",
    ];

    elements.forEach((element) => {
      const matches = contains("span", element);
      if (typeof matches !== "undefined" && matches.length) {
        matches[0].click();
        isClicked = true;
      }
    });

    if (!isClicked) {
      if (
        $("span:contains('This content isn')").length &&
        $("span:contains('t available right now')").length
      ) {
        addItemToReport(false);
        sendNext();
        return false;
      }

      addItemToReport(false);
      isClicked = false;
    }

    const interval = setInterval(function () {
      const gotItButton = contains('div[aria-label="Got It"] span', "Got It");

      if (typeof gotItButton !== "undefined" && gotItButton.length) {
        clearInterval(interval);
        setTimeout(function () {
          gotItButton[0].click();
        }, 2000);
      }
    }, 200);

    isClicked || findIsNotJoinedFBgroup();

    setTimeout(function () {
      messageText = privateMessage;
      replaceText();
      setTimeout(function () {
        navigator.clipboard.writeText(messageText).then(
          function () {
            console.log("Async: Copying to clipboard was successful!");
            setTimeout(function () {
              document.execCommand("paste");
              setTimeout(function () {
                document.querySelectorAll('div[aria-label="Post"]')[0].click();
                addItemToReport(true);
                setTimeout(function () {
                  sendNext();
                }, 6000);
              }, 4000);
            }, 2000);
          },
          function (error) {
            console.error("Async: Could not copy text: ", error);
            addItemToReport(false);
            sendNext();
          }
        );
      }, 2000);
    }, 15000);
  }, 15000);
}

function handleOtherPlatforms(privateMessage) {
  setTimeout(function () {
    let isClicked = false;
    const startConversation = contains(
      "span",
      "Start a conversation in this group"
    );

    if (typeof startConversation !== "undefined" && startConversation.length) {
      isClicked = true;
      startConversation[0].click();
    } else {
      const startPost = contains("span", "Start a post in this group");

      if (typeof startPost !== "undefined" && startPost.length) {
        isClicked = true;
        startPost[0].click();
      } else {
        addItemToReport(false);
        sendNext();
      }
    }

    if (!isClicked) {
      findIsNotJoinedFBgroup();
    }

    setTimeout(function () {
      checkUsername();
      messageText = privateMessage;
      replaceText();

      setTimeout(function () {
        navigator.clipboard.writeText(messageText).then(
          function () {
            setTimeout(function () {
              document.execCommand("paste");
              setTimeout(function () {
                document
                  .querySelectorAll("button.share-actions__primary-action")[0]
                  .click();
                addItemToReport(true);
                setTimeout(function () {
                  sendNext();
                }, 6000);
              }, 4000);
            }, 2000);
          },
          function (error) {
            console.error("Async: Could not copy text: ", error);
            addItemToReport(false);
            sendNext();
          }
        );
      }, 2000);
    }, 5000);
  }, 5000);
}

function findIsNotJoinedFBgroup() {
  const interval = setInterval(function () {
    if (
      $('div[aria-label="Join Group"]').length ||
      $('.groups-header__container:contains("Request to join")').length
    ) {
      clearInterval(interval);
      addItemToReport(false);
      sendNext();
    }
  }, 500);
}

function displayCounters() {
  if ($("#gp-counters-can").length === 0) {
    let leftCss = "right:0;";
    if (window.location.href.includes("linkedin")) {
      leftCss = "";
    }

    $("body")
      .eq(0)
      .append(
        '<iframe style="z-index:99999; ' +
          leftCss +
          ' height:70px; background-color: #902e2e;position: fixed;bottom: 0; display:block;" id="gp-counters-can" src="' +
          chrome.runtime.getURL("src/counter.html") +
          '"></iframe>'
      );
  }
}

let isPushed = false;

function addItemToReport(isSuccessful) {
  isSuccessful = typeof isSuccessful === "undefined" ? false : isSuccessful;

  Store.get(["report"], function (data) {
    if (typeof data.report !== "undefined") {
      data.report.push({ g: window.location.href, s: isSuccessful });
      if (!isPushed) {
        isPushed = true;
        Store.set({ report: data.report });
      }
    }
  });
}

function contains(selector, text) {
  const elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

function checkUsername() {
  if (window.location.hostname.includes("linkedin")) {
    const publicIdentifier = $("code")
      .text()
      .match(/"publicIdentifier":"\S+",/gi);

    if (publicIdentifier) {
      const identifier = publicIdentifier[0].split(",")[0].split(":");
      if (identifier.length > 1) {
        const linkedinId = identifier[1].replace(/"/gi, "");
        Store.get(["login", "linkedinid"], function (data) {
          if (
            typeof data.login !== "undefined" &&
            data.login &&
            typeof data.linkedinid !== "undefined"
          ) {
            if (data.linkedinid === null) {
              Server.sendMessage({ updatelinkedin: linkedinId });
            } else if (data.linkedinid !== linkedinId) {
              alert("Group poster Only works in one linkedin account");
              window.location.reload();
            }
          }
        });
      }
    }
  } else if (window.location.hostname.includes("facebook")) {
    const cookieMatch = document.cookie.match(
      "(^|;)\\s*c_user\\s*=\\s*([^;]+)"
    );
    const facebookId = (cookieMatch ? cookieMatch.pop() : "") || "";

    if (facebookId !== "") {
      Store.get(["login", "facebookid"], function (data) {
        if (
          typeof data.login !== "undefined" &&
          data.login &&
          typeof data.facebookid !== "undefined"
        ) {
          if (data.facebookid === null) {
            Server.sendMessage({ updatefacebookid: facebookId });
          } else if (data.facebookid !== facebookId) {
            alert("Group poster Only works in one facebook account");
            window.location.reload();
          }
        }
      });
    }
  }
}

let breakLoop = true;

function getSubstitute(value) {
  value = value.replace("{", "").replace("}", "");
  return value.includes("|")
    ? value.split("|")[Math.floor(Math.random() * value.length)]
    : value;
}

function replaceText() {
  let braces = [];
  let start = 0;
  let end = 0;

  for (let i = 0; i < messageText.length; i++) {
    const currentChar = messageText.charAt(i);

    if (currentChar === "{" && breakLoop) {
      start = i;
      braces.push(i);
    } else if (currentChar === "}" && breakLoop) {
      breakLoop = false;
      end = i;
      braces.push(i);
    }
  }

  const substring = messageText.slice(start, end + 1);
  messageText = messageText.substr(0, start) + messageText.substr(end + 1);
  endSubstitute = getSubstitute(substring);
  messageText = insert(messageText, start, endSubstitute);

  if (messageText.includes("{")) {
    breakLoop = true;
    replaceText();
  }
}

function sendNext() {
  if (canSend) {
    canSend = false;
    Server.sendMessage({ delete: true });
  }
}

function insert(text, index, value) {
  return text.substr(0, index) + value + text.substr(index);
}
