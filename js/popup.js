// Create a namespace for JavaScript Compiler
const $jscomp = {};
$jscomp.scope = {};

// Function to set the raw property of a template tag's first argument
$jscomp.createTemplateTagFirstArg = function (templateArray) {
  return (templateArray.raw = templateArray);
};

// Function to set the raw property of a template tag's first argument with a given raw value
$jscomp.createTemplateTagFirstArgWithRaw = function (templateArray, rawArray) {
  templateArray.raw = rawArray;
  return templateArray;
};

// Wait for the window to load before executing the readyFn
$(window).on("load", readyFn);

// Initializations
let token = false;
let eGid = "0";
const wpUrl = "https://gp.linked-assist.me/api/";
let templateId = 0;
let groupRow = "";
let templateRow = "";
let templateDelete = "";
function readyFn() {
  document.querySelectorAll(".sub-container").forEach(function (a) {
    return (a.style.display = "none");
  });
  document.getElementsByClassName("sub-container")[0].style.display = "block";
  document.querySelectorAll(".gp-a-btn").forEach(function (a) {
    return (a.style.display = "none");
  });
  $(".start-posting").show();
  Store.get(
    ["cats", "groups", "pm", "min", "max", "start", "postlist"],
    function (data) {
      document.querySelectorAll(".sub-container").forEach(function (element) {
        element.style.display = "none";
      });

      document.getElementsByClassName("category-list")[0].style.display =
        "block";

      if (data.groups != undefined && data.groups.length) {
        var exportContent = "";
        data.groups.forEach(function (group) {
          exportContent += group.group_url + "\n";
        });
        $("#groupfb").val(exportContent);
      }
      if (data.files != undefined && data.files) {
        $("#file_upload").val(data.files.length + "file selected");
      } else $("#file_upload").val("No file selected");

      if (data.pm !== undefined && data.pm.length) {
        $("#poster").val(data.pm);
      }

      if (data.min !== undefined && data.min.length) {
        $(".min").val(data.min);
      }

      if (data.max !== undefined && data.max.length) {
        $(".max").val(data.max);
      }
      $(".gp-poster-post").click();
      if (data.start && data.start !== undefined) {
        setTimeout(function () {
          runningPoster();
        }, 200);
      }
    }
  );
  $(".reporting").on("click", function () {
    Store.get(["report"], function (data) {
      if (data.report !== undefined && data.report.length) {
        window.open(window.location.origin + "/src/report.html");
      }
    });
  });

  $(".back-gp-btn").on("click", function () {
    $(".gp-login").show();
    $("#gp-forgot").hide();
  });

  $(".forgot-gp-btn").on("click", function () {
    $(".gp-login").hide();
    $("#gp-forgot").show();
  });

  $(".gp-add-group").on("click", function () {
    $("#add-new-group").show();
    $("#group-url").val("");
    $("#add-new-group").after('<div class="modal-backdrop fade in"></div>');
  });

  $(".import-gp").on("click", function () {
    f = [];
    $("#import-file").val("");
    $("#import-new-group").show();
    $("#import-new-group").after('<div class="modal-backdrop fade in"></div>');
  });

  $(".export-gp").on("click", function () {
    $("#import-file").val("");
    $("#export-new-group").show();
    $("#export-new-group").after('<div class="modal-backdrop fade in"></div>');
  });
  $(".add-template").on("click", function () {
    templateId = 0;
    $("#add-new-template").show();
    $("#add-new-template").after('<div class="modal-backdrop fade in"></div>');
  });

  $(document).on("click", ".edit-template", function () {
    templateId = $(this).closest(".template-row").attr("id");
    $("#template-name").val(
      $(this).closest(".template-row").find(".spacing:eq(0)").text().trim()
    );
    $("#input-post").val(
      $(this).closest(".template-row").find(".spacing:eq(1)").text().trim()
    );
    $("#add-new-template").show();
    $("#add-new-template").after('<div class="modal-backdrop fade in"></div>');
  });

  $(document).on("change", "#template-dropdown", function () {
    var selectedValue = this.value;
    var selectedOptions = [];

    $("#template-dropdown option:selected").each(function () {
      selectedOptions.push($(this).val());
    });

    if (selectedOptions.length > 1) {
      $("#poster").prop("disabled", true);
    } else {
      $("#poster").prop("disabled", false);
    }

    Store.get(
      ["login", "cats", "groups", "pm", "min", "max", "start", "postlist"],
      function (data) {
        if (
          data.login !== undefined &&
          data.login &&
          data.postlist !== undefined &&
          data.postlist.length
        ) {
          var filteredTemplates = data.postlist.filter(function (template) {
            return template.id == selectedValue;
          });

          if (filteredTemplates.length) {
            $("#poster").val(
              filteredTemplates[0].post_content.replace(/\\/g, "")
            );
          }
        }
      }
    );
  });

  $(".gp-template").on("click", function () {
    document.querySelectorAll(".sub-container").forEach(function (element) {
      element.style.display = "none";
    });
    document.getElementsByClassName("template-list")[0].style.display = "block";
  });

  $(".gp-change-password-outer").on("click", function () {
    document.querySelectorAll(".sub-container").forEach(function (element) {
      element.style.display = "none";
    });
    document.getElementsByClassName("change-password")[0].style.display =
      "block";
  });

  $(".gp-poster-post").on("click", function () {
    Store.get(["login", "cats", "groups", "pm"], function (data) {
      if (data.login !== undefined && data.login) {
        token = data.login;
        document.querySelectorAll(".sub-container").forEach(function (element) {
          element.style.display = "none";
        });
        document.getElementsByClassName("category-list")[0].style.display =
          "block";

        if (data.pm !== undefined && data.pm.length) {
          $("#poster").val(data.pm);
        } else {
          $("#poster").val("");
        }
      } else {
        document.querySelectorAll(".sub-container").forEach(function (element) {
          element.style.display = "none";
        });
        document.getElementsByClassName("sub-container")[0].style.display =
          "block";
      }

      document.querySelectorAll(".sub-container").forEach(function (element) {
        element.style.display = "none";
      });
      document.getElementsByClassName("run-poster")[0].style.display = "block";
    });
  });

  $(".add-cat").on("click", function () {
    h = 0;
    $("#add-new-category").show();
    $(".cat-for-hide").show();
    $("#add-new-category").after('<div class="modal-backdrop fade in"></div>');
  });
  $(".start-posting").on("click", function () {
    if ($("#groupfb").val() === "") {
      $(".invalid-error.invalid-credentials").show();
      return false;
    }
    var groupurls = $("#groupfb").val().split("\n");
    if (groupurls.length > 0) {
      var groupObjs = [];
      groupurls.forEach(function (group) {
        var lastChar = group.substr(group.length - 1);
        if (lastChar == "/") {
          group = group.slice(0, -1);
        }
        if (group != "") {
          let groupid = group.substring(
            group.lastIndexOf("/") + 1,
            group.length
          );
          var data = {
            id: groupid,
            group_url: group,
          };
          groupObjs.push(data);
        }
      });
      Store.set({
        groups: groupObjs,
      });
    }

    if ($("#poster").val() === "") {
      $(".invalid-error.invalid-credentials").show();
      return false;
    }
    Store.set({
      pm: $("#poster").val(),
    });
    $(".intervals").removeClass("invalid-interval");

    if (parseInt($(".min").val()) > parseInt($(".max").val())) {
      $(".intervals").addClass("invalid-interval");
      return false;
    }

    var selectedCategoryId = $("#cat-for-run option:selected").val();

    Store.get(["groups", "opt", "linkedinid", "facebookid"], function (data) {
      var isSetupRequired = false;

      if (data.opt !== undefined && data.opt === "mt21") {
        chrome.tabs.query(
          {
            currentWindow: true,
            active: true,
          },
          function (tabs) {
            if (
              data.facebookid === null &&
              tabs[0].url.includes("facebook.com")
            ) {
              isSetupRequired = true;
              alert("We are opening Facebook for the first setup to run.");
              Server.sendMessage({ f: true });
            } else if (
              data.linkedinid === null &&
              tabs[0].url.includes("linkedin.com")
            ) {
              isSetupRequired = true;
              alert("We are opening LinkedIn for the first setup to run.");
              Server.sendMessage({ l: true });
            }
          }
        );
      }

      if (!isSetupRequired) {
        if (data.groups !== undefined && data.groups.length) {
          if (data.groups.length) {
            $(".start-posting").prop("disabled", true);
            Store.set({
              start: true,
              pause: false,
              psubset: data.groups,
              runId: selectedCategoryId,
              pm: $("#poster").val(),
              min: parseInt($(".min").val()),
              max: parseInt($(".max").val()),
            });

            setTimeout(function () {
              Server.sendMessage({ start: true });
            }, 400);
          } else {
            alertMessage("No group found in the selected category", "red");
          }
        } else {
          alertMessage("No group found in the selected category", "red");
        }
      }
    });
  });

  $(".stop-posting").on("click", function () {
    Store.set({
      pause: false,
      start: false,
    });

    document.querySelectorAll(".gp-a-btn").forEach(function (element) {
      element.style.display = "none";
    });

    $(".start-posting").show();

    Server.sendMessage({
      stop: true,
    });
  });

  $(".pause-posting").on("click", function () {
    Store.set({
      pause: true,
    });

    document.querySelectorAll(".gp-a-btn").forEach(function (element) {
      element.style.display = "none";
    });

    $(".resume-posting").show();
    $(".stop-posting").show();

    Server.sendMessage({
      pause: true,
    });
  });

  $(".resume-posting").on("click", function () {
    Store.set({
      pause: false,
    });

    document.querySelectorAll(".gp-a-btn").forEach(function (element) {
      element.style.display = "none";
    });

    $(".pause-posting").show();
    $(".stop-posting").show();

    Server.sendMessage({
      resume: true,
    });

    setTimeout(function () {
      window.close();
    }, 200);
  });
  $(document).on("click", ".visit-group", function () {
    window.open($(this).attr("data-href"));
  });

  var groupsData = [];

  $(document).on("keyup", "#search-url", function () {
    var searchTerm = $(this).val();
    $(".gp-group-col-1").parent().remove();
    var groupHtml = "";

    groupsData.forEach(function (group) {
      if (group.group_url.indexOf(searchTerm) !== -1) {
        console.log("here");
        groupHtml +=
          '<div class="gp-group-row" id="' +
          group.id +
          '">\n' +
          '   <div class="gp-group-col-1">' +
          group.group_url +
          "</div>\n" +
          '   <div class="gp-group-col-2"><button type="button" data-href="' +
          group.group_url +
          '" class="btn btn-outline-info visit-group">View</button></div>\n' +
          '   <div class="gp-group-col-3"><button type="button" class="btn btn-outline-danger delete-group">Delete</button></div>\n' +
          "</div>";
      }
    });

    if (groupHtml !== "") {
      $(".group-list-show").append(groupHtml);
    }
  });
  const getBase64 = async (file) =>
    new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  $(document).on("click", ".view-groups", function () {
    var targetCatId = $(this).closest(".gp-row").attr("id");

    Store.get(["groups"], function (data) {
      if (data.groups !== undefined && data.groups.length) {
        groupsData = data.groups.filter(function (group) {
          return group.cat_id == targetCatId;
        });

        console.log(groupsData);

        if (groupsData.length) {
          var html =
            '<div class="form-group">\n' +
            '               <input name="search_url" type="text" class="form-control" id="search-url" placeholder="Search group">\n' +
            "           </div>";

          groupsData.forEach(function (group) {
            html +=
              '<div class="gp-group-row" id="' +
              group.id +
              '">\n' +
              '               <div class="gp-group-col-1">' +
              group.group_url +
              "</div>\n" +
              '               <div class="gp-group-col-2"><button type="button"  data-href="' +
              group.group_url +
              '"  class="btn btn-outline-info visit-group">View</button></div>\n' +
              '               <div class="gp-group-col-3"><button type="button" class="btn btn-outline-danger delete-group">Delete</button></div>\n' +
              "           </div>";
          });

          if (html !== "") {
            $(".group-list-show").html(html);
            document
              .querySelectorAll(".sub-container")
              .forEach(function (element) {
                element.style.display = "none";
              });
            document.getElementsByClassName("group-list")[0].style.display =
              "block";
          }
        } else {
          alertMessage("No group found", "red");
        }
      } else {
        alertMessage("No group found", "red");
      }
    });
  });

  $(document).on("click", ".view-cat", function () {
    document.querySelectorAll(".sub-container").forEach(function (element) {
      element.style.display = "none";
    });
    document.getElementsByClassName("category-list")[0].style.display = "block";
  });

  $(document).on("click", ".edit-cat", function () {
    h = $(this).closest(".gp-row").attr("id");
    $("#cat-name").val($(this).attr("cat_name"));
    $("#add-new-category").show();
    $(".cat-for-hide").hide();
    $("#add-new-category").after('<div class="modal-backdrop fade in"></div>');
  });

  $(document).on("click", ".delete-cat", function () {
    catRow = $(this).closest(".gp-row");
    dGatid = $(this).closest(".gp-row").attr("id");
    $("#cat-delete-modal").show();
    $("#cat-delete-modal").after('<div class="modal-backdrop fade in"></div>');
  });

  $(document).on("click", ".delete-template", function () {
    templateRow = $(this).closest(".template-row");
    templateDelete = $(this).closest(".template-row").attr("id");
    $("#template-delete-modal").show();
    $("#template-delete-modal").after(
      '<div class="modal-backdrop fade in"></div>'
    );
  });

  $(document).on("click", ".close-modal", function () {
    $(
      "#add-new-group, #import-new-group, #export-new-group, #template-delete-modal, #add-new-template, #add-new-category, #group-delete-modal, #cat-delete-modal"
    ).hide();
    $(".modal-backdrop.fade.in").remove();
    h = eGid = "0";
  });

  $(document).on("click", ".delete-group", function () {
    groupRow = $(this).closest(".gp-group-row");
    del_group_id = $(this).closest(".gp-group-row").attr("id");
    $("#group-delete-modal").show();
    $("#group-delete-modal").after(
      '<div class="modal-backdrop fade in"></div>'
    );
  });

  $(document).on("click", ".group-delete-btn", function () {
    $(".group-delete-btn").text("Please wait").prop("disabled", true);
    delGroup();
  });

  $(document).on("click", ".template-delete-btn", function () {
    $(".cat-delete-btn").text("Please wait").prop("disabled", true);
    delTemplate();
  });
  $(document).on("click", ".cat-delete-btn", function () {
    $(".cat-delete-btn").text("Please wait").prop("disabled", true);
    delCat();
  });

  $(document).on("click", ".change-password-buttons", function () {
    var newPassword = $("#password-c").val().trim();
    if (newPassword.length < 6) {
      alertMessage("Password must be at least 6 characters", "red");
      return false;
    }

    $(".change-password-buttons").prop("disabled", true);
    $(".change-password-buttons").text("Please wait");

    $.ajax({
      method: "POST",
      url: wpUrl + "changepassword",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      data: {
        password: newPassword,
      },
      success: function (response, status, xhr) {
        $(".change-password-buttons").prop("disabled", false);
        $(".change-password-buttons").text("Update");

        if (response.status !== 0) {
          alertMessage(response.message, "green");
        }
      },
      statusCode: {
        500: function (xhr) {
          $(".change-password-buttons").prop("disabled", false);
        },
      },
    });
  });

  $(document).on("click", ".save-group-btn-ext", function () {
    $(".c-ext-errror").hide();
    var groupUrl = document.getElementById("group-url").value.trim();
    if (groupUrl === "") {
      $(".c-ext-errror").show();
      return false;
    }

    var categoryId = document.getElementById("cat-for-group").value;
    Store.get(["groups"], function (storedData) {
      if (storedData.groups && storedData.groups.length) {
        var existingGroups = storedData.groups.filter(function (group) {
          return group.cat_id == categoryId && group.group_url == groupUrl;
        });

        if (existingGroups.length > 0) {
          alertMessage("Group already exists in the category", "red");
        } else if (
          storedData.groups.filter(function (group) {
            return group.cat_id == categoryId;
          }).length > 49
        ) {
          alertMessage("Group limit reached i.e. 50", "red");
        } else {
          $(".save-group-btn-ext").prop("disabled", true);
          $(".save-group-btn-ext").text("Please wait");

          $.ajax({
            method: "POST",
            url: wpUrl + "addgroup",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            data: {
              addgroup: eGid,
              group_url: groupUrl,
              cat_id: categoryId,
            },
            success: function (response, status, xhr) {
              $(".save-group-btn-ext").prop("disabled", false);
              $(".save-group-btn-ext").text("Save");

              if (response.status !== 0) {
                Store.set({
                  groups: response.groups,
                });
                alertMessage(response.message, "green");
              }
            },
            statusCode: {
              500: function (xhr) {
                $(".save-group-btn-ext").prop("disabled", false);
              },
            },
          });
        }
      } else {
        $(".save-group-btn-ext").prop("disabled", true);
        $(".save-group-btn-ext").text("Please wait");

        $.ajax({
          method: "POST",
          url: wpUrl + "addgroup",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          data: {
            addgroup: eGid,
            group_url: groupUrl,
            cat_id: categoryId,
            token: token,
          },
          success: function (response, status, xhr) {
            $(".save-group-btn-ext").prop("disabled", false);
            $(".save-group-btn-ext").text("Save");

            if (response.status !== 0) {
              Store.set({
                groups: response.groups,
              });
              alertMessage(response.message, "green");
            }
          },
          statusCode: {
            500: function (xhr) {
              $(".save-group-btn-ext").prop("disabled", false);
            },
          },
        });
      }
    });
  });

  var f = [];

  $("#import-file").change(function () {
    f = [];
    var fileInput = document.getElementById("import-file");
    if (fileInput.files[0].name.indexOf(".txt") === -1) {
      alertMessage("Please add a text file", "red");
      $("#import-file").val("");
      return false;
    }

    var fileReader = new FileReader();
    fileReader.onload = function () {
      f = fileReader.result.split("\n");
    };
    fileReader.readAsText(fileInput.files[0]);
  });

  $(document).on("click", ".export-group-btn-ext", function () {
    $(".c-ext-errror").hide();
    var selectedCategory = document.getElementById(
      "cat-for-group-export"
    ).value;

    Store.get(["groups"], function (storedData) {
      if (storedData.groups && storedData.groups.length) {
        var filteredGroups = storedData.groups;

        if (filteredGroups.length > 0) {
          var exportContent = "";
          filteredGroups.forEach(function (group) {
            exportContent += group.group_url + "\n";
          });
          downloadTextFile(exportContent);
        } else {
          alertMessage("No group found", "red");
        }
      }
    });
  });

  $(document).on("click", ".import-group-btn-ext", function () {
    $(".c-ext-errror").hide();
    var selectedCategoryImport = document.getElementById(
      "cat-for-group-import"
    ).value;

    Store.get(["groups"], function (storedData) {
      if (storedData.groups && storedData.groups.length) {
        var currentGroups = storedData.groups.filter(function (group) {
          return group.cat_id == selectedCategoryImport;
        });

        var currentGroupsCount = currentGroups.length;
        var newGroups = [];
        f.forEach(function (groupUrl, index) {
          if (
            groupUrl.length &&
            !currentGroups.filter(function (existingGroup) {
              var existingGroupId = existingGroup.group_url
                .split("/groups/")[1]
                .replace("/", "");
              var newGroupId = groupUrl.split("/groups/")[1].replace("/", "");
              return existingGroupId == newGroupId;
            }).length
          ) {
            newGroups.push(groupUrl);
          }
        });

        if (newGroups.length === 0) {
          alertMessage("No new group found in the file", "red");
        } else {
          if (currentGroupsCount + newGroups.length > 50) {
            alertMessage("Limit reached per category i.e. 50", "red");
            return false;
          }

          $(".import-group-btn-ext").prop("disabled", true);
          $(".import-group-btn-ext").text("Please wait");

          $.ajax({
            method: "POST",
            url: wpUrl + "importgroup",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            data: {
              addgroupne: eGid,
              group_url: JSON.stringify(newGroups),
              cat_id: selectedCategoryImport,
            },
            success: function (response, status, xhr) {
              $(".close-modal").click();
              f = [];
              $(".import-group-btn-ext").prop("disabled", false);
              $(".import-group-btn-ext").text("Save");

              if (typeof response.errors === "undefined") {
                Store.set({
                  groups: response.groups,
                });
                alertMessage(response.message, "green");
              }
            },
            statusCode: {
              500: function (xhr) {
                $(".close-modal").click();
                $(".import-group-btn-ext").prop("disabled", false);
              },
            },
          });
        }
      } else {
        $(".import-group-btn-ext").prop("disabled", true);
        $(".import-group-btn-ext").text("Please wait");

        $.ajax({
          method: "POST",
          url: wpUrl + "importgroup",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          data: {
            addgroupne: eGid,
            group_url: JSON.stringify(f),
            cat_id: selectedCategoryImport,
          },
          success: function (response, status, xhr) {
            $(".close-modal").click();
            f = [];
            $(".import-group-btn-ext").prop("disabled", false);
            $(".import-group-btn-ext").text("Save");

            if (typeof response.errors === "undefined") {
              Store.set({
                groups: response.groups,
              });
              alertMessage(response.message, "green");
            }
          },
          statusCode: {
            500: function (xhr) {
              $(".import-group-btn-ext").prop("disabled", false);
            },
          },
        });
      }
    });
  });

  $(document).keyup(function () {
    $(".c-ext-errror").hide();
  });

  var h = 0;

  $(document).on("click", ".save-cat-btn-ext", function () {
    $(".c-ext-errror").hide();
    var catName = document.getElementById("cat-name").value.trim();
    var catFor = document.getElementById("cat-for").value;

    if (catName !== "") {
      $(".save-cat-btn-ext").prop("disabled", true);
      $(".save-cat-btn-ext").text("Please wait");

      $.ajax({
        method: "POST",
        url: wpUrl + "addcat",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        data: {
          addcat: h,
          cat_for: catFor,
          cat_name: catName,
        },
        success: function (response) {
          $(".save-cat-btn-ext").prop("disabled", false);
          $(".save-cat-btn-ext").text("Save");

          if (response.status !== 0) {
            alertMessage(response.message, "green");
            Store.set({
              cats: response.cat_list,
            });
            catHtml(response.cat_list);
          }
        },
        statusCode: {
          500: function () {
            $(".save-cat-btn-ext").prop("disabled", false);
          },
        },
      });
    } else {
      $(".c-ext-errror").show();
    }
  });

  $(".gp-logout").on("click", function () {
    Store.set({
      login: false,
      groups: [],
      cats: [],
    });
    location.reload();
  });
  $("#file_upload").on("click", function () {
    $("#files").trigger("click");
  });
  $("#files").on("input", async function ($event) {
    const {
      target: { files },
    } = $event;
    if (files.length <= 0) return;
    var filedatas = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const { name, type, size } = file;

      var filedata = {
        name,
        type,
        size,
        value: await getBase64(file),
      };
      filedatas.push(filedata);
    }
    $("#file_upload").val(filedatas.length + " file selected");
    Store.set({
      files: filedatas,
    });
  });
  $('form[name="user_forgot"]').validate({
    rules: {
      user_email: {
        required: true,
        email: true,
      },
    },
    submitHandler: function () {
      var userEmail = document.getElementById("user-email-1").value.trim();
      $(".forgot-gp-btn").prop("disabled", true);
      $(".forgot-gp-btn").text("Sending");

      $.ajax({
        method: "POST",
        url: wpUrl + "sendforgot",
        data: {
          email: userEmail,
        },
        success: function (response) {
          $(".forgot-gp-btn").prop("disabled", false);
          $(".forgot-gp-btn").text("Forgot");

          if (response.status === 0) {
            alertMessage(response.message, "red");
          } else {
            alertMessage(response.message, "green");
          }
        },
        statusCode: {
          500: function () {},
        },
      });
    },
  });
  function uploadFiles(ev) {
    console.log(ev);
  }
  var catHtml = function (data) {
    var categoryList = "",
      catDropdownOptions = "";

    data.forEach(function (item) {
      var catFor = item.cat_for === "facebook" ? "(FB)" : "(LK)";
      categoryList +=
        '<div class="gp-row" id="' +
        item.id +
        '">\n' +
        '   <div class="gp-col-1">' +
        item.cat_name +
        " " +
        catFor +
        "</div>\n" +
        '   <div class="gp-col-2">  <button type="button" class="btn btn-outline-primary view-groups"> Groups\n</button></div>\n' +
        '   <div class="gp-col-3">  <button type="button" class="btn btn-outline-info edit-cat" cat_name="' +
        item.cat_name +
        '"> Edit\n</button></div>\n' +
        '   <div class="gp-col-4">  <button type="button" class="btn btn-outline-danger delete-cat"> Delete\n</button></div>\n' +
        "</div>";
      catDropdownOptions +=
        '<option value="' +
        item.id +
        '">' +
        item.cat_name +
        " " +
        catFor +
        "</option>";
    });

    $(".category-0").hide();
    if (categoryList !== "") {
      $(".category-list-show").html(categoryList);
      $(".category-list-show").show();
      $("#cat-for-group").html(catDropdownOptions);
      $("#cat-for-group-import").html(catDropdownOptions);
      $("#cat-for-group-export").html(catDropdownOptions);
    } else {
      $(".category-list-show").hide();
      $(".category-0").show();
    }
  };

  function alertMessage(message, color) {
    var snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.style.background = color;
    snackbar.className = "show";
    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
  }

  function runningPoster() {
    $(".gp-poster-post").click();
    setTimeout(function () {
      Store.get(["runId", "pause", "multiTemplteIds"], function (data) {
        console.log(data);
        if (data.runId !== undefined) {
          $('#cat-for-run option[value="' + data.runId + '"]').prop(
            "selected",
            true
          );
        }

        if (data.pause !== undefined) {
          if (data.pause === 1) {
            document.querySelectorAll(".gp-a-btn").forEach(function (btn) {
              btn.style.display = "none";
            });
            $(".resume-posting").show();
            $(".stop-posting").show();
          } else if (data.pause === 0) {
            document.querySelectorAll(".gp-a-btn").forEach(function (btn) {
              btn.style.display = "none";
            });
            $(".pause-posting").show();
            $(".stop-posting").show();
            data.multiTemplteIds.forEach(function (templateId) {
              $("#template-dropdown").multiselect("select", templateId);
            });
          }
        }
      });
    }, 100);
  }

  function delGroup() {
    $.ajax({
      method: "POST",
      url: wpUrl + "deletegroup",
      data: {
        id: del_group_id,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function (data, textStatus, jqXHR) {
        $(".group-delete-btn").text("Delete").prop("disabled", false);
        $(".close-modal").click();
        if (data.status !== 0) {
          Store.set({
            groups: data.groups,
          });
          groupRow.remove();
          alertMessage(data.message, "green");
        }
      },
      statusCode: {
        500: function (xhr) {},
      },
    });
  }

  function delTemplate() {
    $.ajax({
      method: "POST",
      url: wpUrl + "delpost",
      data: {
        deltemplate: "",
        id: templateDelete,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function (data, textStatus, jqXHR) {
        $(".cat-delete-btn").text("Yes").prop("disabled", false);
        $(".close-modal").click();
        if (typeof data.errors === "undefined") {
          Store.set({
            postlist: data.post_list,
          });
          templateRow.remove();
          alertMessage(data.message, "green");
        }
      },
      statusCode: {
        500: function (xhr) {},
      },
    });
  }

  function delCat() {
    $.ajax({
      method: "POST",
      url: wpUrl + "deletecat",
      data: {
        deletecat: "",
        cat_id: dGatid,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function (data, textStatus, jqXHR) {
        $(".cat-delete-btn").text("Yes").prop("disabled", false);
        $(".close-modal").click();
        if (data["false"] !== undefined && data["false"] !== 0) {
          Store.set({
            cats: data.cat_list,
          });
          catRow.remove();
          alertMessage(data.message, "green");
        }
      },
      statusCode: {
        500: function (xhr) {},
      },
    });
  }

  function downloadTextFile(content) {
    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "group-list.txt");
  }
}
