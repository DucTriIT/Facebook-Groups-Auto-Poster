var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function(d) {
    return d.raw = d
}
;
$jscomp.createTemplateTagFirstArgWithRaw = function(d, f) {
    d.raw = f;
    return d
}
;
$(window).on("load", readyFn);
var token = !1
  , eGid = "0"
  , wpUrl = "https://gp.linked-assist.me/api/"
  , templateId = 0
  , groupRow = ""
  , templateRow = ""
  , templateDelete = "";
function readyFn() {
    document.querySelectorAll(".sub-container").forEach(function(a) {
        return a.style.display = "none"
    });
    document.getElementsByClassName("sub-container")[0].style.display = "block";
    document.querySelectorAll(".gp-a-btn").forEach(function(a) {
        return a.style.display = "none"
    });
    $(".start-posting").show();
    Store.get("login cats groups pm min max start postlist".split(" "), function(a) {
        void 0 !== a.login && a.login ? (token = a.login,
        isactivate(),
        document.querySelectorAll(".sub-container").forEach(function(b) {
            return b.style.display = "none"
        }),
        document.getElementsByClassName("category-list")[0].style.display = "block",
        void 0 !== a.cats && a.cats.length ? ($(".category-list-show").hide(),
        catHtml(a.cats)) : ($(".category-list-show").hide(),
        $(".category-0").show()),
        void 0 !== a.postlist && a.postlist.length ? ($(".template-list-show").hide(),
        templateHtml(a.postlist)) : ($(".template-list-show").hide(),
        $(".template-0").show()),
        void 0 !== a.pm && a.pm.length && $("#poster").val(a.pm),
        void 0 !== a.min && a.min.length && $(".min").val(a.min),
        void 0 !== a.max && a.max.length && $(".max").val(a.max),
        void 0 !== a.start && a.start && setTimeout(function() {
            runningPoster()
        }, 200)) : (document.querySelectorAll(".sub-container").forEach(function(b) {
            return b.style.display = "none"
        }),
        document.getElementsByClassName("sub-container")[0].style.display = "block")
    });
    $(".reporting").on("click", function() {
        Store.get(["report"], function(a) {
            void 0 !== a.report && a.report.length && window.open(window.location.origin + "/src/report.html")
        })
    });
    $(".back-gp-btn").on("click", function() {
        $(".gp-login").show();
        $("#gp-forgot").hide()
    });
    $(".forgot-gp-btn").on("click", function() {
        $(".gp-login").hide();
        $("#gp-forgot").show()
    });
    $(".gp-add-group").on("click", function() {
        $("#add-new-group").show();
        $("#group-url").val("");
        $("#add-new-group").after('<div class="modal-backdrop fade in"></div>')
    });
    $(".import-gp").on("click", function() {
        f = [];
        $("#import-file").val("");
        $("#import-new-group").show();
        $("#import-new-group").after('<div class="modal-backdrop fade in"></div>')
    });
    $(".export-gp").on("click", function() {
        $("#import-file").val("");
        $("#export-new-group").show();
        $("#export-new-group").after('<div class="modal-backdrop fade in"></div>')
    });
    $(".add-template").on("click", function() {
        templateId = 0;
        $("#add-new-template").show();
        $("#add-new-template").after('<div class="modal-backdrop fade in"></div>')
    });
    $(document).on("click", ".edit-template", function() {
        templateId = $(this).closest(".template-row").attr("id");
        $("#template-name").val($(this).closest(".template-row").find(".spacing:eq(0)").text().trim());
        $("#input-post").val($(this).closest(".template-row").find(".spacing:eq(1)").text().trim());
        $("#add-new-template").show();
        $("#add-new-template").after('<div class="modal-backdrop fade in"></div>')
    });
    $(document).on("change", "#template-dropdown", function() {
        var a = this.value
          , b = [];
        $("#template-dropdown option:selected").each(function() {
            b.push($(this).val())
        });
        1 < b.length ? $("#poster").prop("disabled", !0) : $("#poster").prop("disabled", !1);
        Store.get("login cats groups pm min max start postlist".split(" "), function(c) {
            void 0 !== c.login && c.login && void 0 !== c.postlist && c.postlist.length && (pt = c.postlist.filter(function(g) {
                return g.id == a
            }),
            pt.length && $("#poster").val(pt[0].post_content.replace(/\\/g, "")))
        })
    });
    $(".gp-template").on("click", function() {
        document.querySelectorAll(".sub-container").forEach(function(a) {
            return a.style.display = "none"
        });
        document.getElementsByClassName("template-list")[0].style.display = "block"
    });
    $(".gp-change-password-outer").on("click", function() {
        document.querySelectorAll(".sub-container").forEach(function(a) {
            return a.style.display = "none"
        });
        document.getElementsByClassName("change-password")[0].style.display = "block"
    });
    $(document).on("click", ".save-template-btn-ext", function() {
        $(".c-ext-errror").hide();
        var a = document.getElementById("template-name").value.trim()
          , b = document.getElementById("input-post").value.trim();
        if ("" == a)
            return $("#add-new-template .c-ext-errror:eq(0)").show(),
            !1;
        if ("" == b)
            return $("#add-new-template .c-ext-errror:eq(1)").show(),
            !1;
        $(".save-template-btn-ext").prop("disabled", !0);
        $(".save-template-btn-ext").text("Please wait");
        $.ajax({
            method: "POST",
            url: wpUrl + "addpost",
            data: {
                addtemplate: templateId,
                name: a,
                post_content: b
            },
            beforeSend: function(c) {
                c.setRequestHeader("Authorization", "Bearer " + token)
            },
            success: function(c, g, e) {
                $(".save-template-btn-ext").prop("disabled", !1);
                $(".save-template-btn-ext").text("Save");
                "undefined" == typeof c.errors && (Store.set({
                    postlist: c.postlist
                }),
                templateHtml(c.postlist),
                alertMessage(c.message, "green"))
            },
            statusCode: {
                500: function(c) {
                    $(".save-template-btn-ext").prop("disabled", !1)
                }
            }
        })
    });
    $(".gp-poster-post").on("click", function() {
        Store.get(["login", "cats", "groups", "pm"], function(a) {
            void 0 !== a.login && a.login ? (token = a.login,
            document.querySelectorAll(".sub-container").forEach(function(b) {
                return b.style.display = "none"
            }),
            document.getElementsByClassName("category-list")[0].style.display = "block",
            $("#cat-for-run").html(""),
            void 0 !== a.cats && a.cats.length ? a.cats.forEach(function(b) {
                $("#cat-for-run").append('<option class="op" value="' + b.id + '">' + b.cat_name + "</option>")
            }) : alertMessage("No category found", "red"),
            void 0 !== a.pm && a.pm.length ? $("#poster").val(a.pm) : $("#poster").val("")) : (document.querySelectorAll(".sub-container").forEach(function(b) {
                return b.style.display = "none"
            }),
            document.getElementsByClassName("sub-container")[0].style.display = "block");
            document.querySelectorAll(".sub-container").forEach(function(b) {
                return b.style.display = "none"
            });
            document.getElementsByClassName("run-poster")[0].style.display = "block"
        })
    });
    $(".add-cat").on("click", function() {
        h = 0;
        $("#add-new-category").show();
        $(".cat-for-hide").show();
        $("#add-new-category").after('<div class="modal-backdrop fade in"></div>')
    });
    $(".start-posting").on("click", function() {
        if ("" == $("#poster").val())
            return $(".invalid-error.invalid-credentials").show(),
            !1;
        $(".intervals").removeClass("invalid-interval");
        if (parseInt($(".min").val()) > parseInt($(".max").val()))
            return $(".intervals").addClass("invalid-interval"),
            !1;
        var a = $("#cat-for-run option:selected").val();
        Store.get(["groups", "opt", "linkedinid", "facebookid"], function(b) {
            var c = !1;
            void 0 !== b.opt && "mt21" == b.opt && chrome.tabs.query({
                currentWindow: !0,
                active: !0
            }, function(k) {
                null == b.facebookid && -1 < k[0].url.indexOf("facebook.com") ? (c = !0,
                alert("We are opening the facebook for first setup to run."),
                Server.sendMessage({
                    f: !0
                })) : null == b.linkedinid && -1 < k[0].url.indexOf("linkedin.com") && (c = !0,
                alert("We are opening the linkedin for first setup to run."),
                Server.sendMessage({
                    l: !0
                }))
            });
            if (!c)
                if (void 0 !== b.groups && b.groups.length) {
                    var g = b.groups.filter(function(k) {
                        return k.cat_id == a
                    });
                    if (g.length) {
                        $(".start-posting").prop("disabled", !0);
                        var e = [];
                        $("#template-dropdown option:selected").each(function() {
                            e.push($(this).val())
                        });
                        Store.set({
                            start: !0,
                            pause: !1,
                            psubset: g,
                            runId: a,
                            pm: $("#poster").val(),
                            min: parseInt($(".min").val()),
                            max: parseInt($(".max").val()),
                            multiTemplteIds: e
                        });
                        setTimeout(function() {
                            Server.sendMessage({
                                start: !0
                            })
                        }, 400)
                    } else
                        alertMessage("No group found in selected category", "red")
                } else
                    alertMessage("No group found in selected category", "red")
        })
    });
    $(".stop-posting").on("click", function() {
        Store.set({
            pause: !1,
            start: !1
        });
        document.querySelectorAll(".gp-a-btn").forEach(function(a) {
            return a.style.display = "none"
        });
        $(".start-posting").show();
        Server.sendMessage({
            stop: !0
        })
    });
    $(".pause-posting").on("click", function() {
        Store.set({
            pause: !0
        });
        document.querySelectorAll(".gp-a-btn").forEach(function(a) {
            return a.style.display = "none"
        });
        $(".resume-posting").show();
        $(".stop-posting").show();
        Server.sendMessage({
            pause: !0
        })
    });
    $(".resume-posting").on("click", function() {
        Store.set({
            pause: !1
        });
        document.querySelectorAll(".gp-a-btn").forEach(function(a) {
            return a.style.display = "none"
        });
        $(".pause-posting").show();
        $(".stop-posting").show();
        Server.sendMessage({
            resume: !0
        });
        setTimeout(function() {
            window.close()
        }, 200)
    });
    $(document).on("click", ".visit-group", function() {
        window.open($(this).attr("data-href"))
    });
    var d = [];
    $(document).on("keyup", "#search-url", function() {
        var a = $(this).val();
        $(".gp-group-col-1").parent().remove();
        gHT = "";
        d.forEach(function(b) {
            -1 < b.group_url.indexOf(a) && (console.log("hererer"),
            gHT += '<div class="gp-group-row" id="' + b.id + '">\n                    <div class="gp-group-col-1">' + b.group_url + '</div>\n                    <div class="gp-group-col-2"><button type="button" data-href="' + b.group_url + '" class="btn btn-outline-info visit-group">View</button></div>\n                    <div class="gp-group-col-3"><button type="button" class="btn btn-outline-danger delete-group">Delete</button></div>\n      \t\t\t\t\t</div>')
        });
        "" != gHT && $(".group-list-show").append(gHT)
    });
    $(document).on("click", ".view-groups", function() {
        targetCatId = $(this).closest(".gp-row").attr("id");
        Store.get(["groups"], function(a) {
            if (void 0 !== a.groups && a.groups.length)
                if (a = d = a.groups.filter(function(c) {
                    return c.cat_id == targetCatId
                }),
                console.log(a),
                a.length) {
                    var b = '<div class="form-group">\n\t\t\t                <input name="search_url" type="text" class="form-control" id="search-url" placeholder="Search group">\n      \t\t\t        </div>';
                    a.forEach(function(c) {
                        b += '<div class="gp-group-row" id="' + c.id + '">\n\t\t\t\t                    <div class="gp-group-col-1">' + c.group_url + '</div>\n\t\t\t\t                    <div class="gp-group-col-2"><button type="button"  data-href="' + c.group_url + '"  class="btn btn-outline-info visit-group">View</button></div>\n\t\t\t\t                    <div class="gp-group-col-3"><button type="button" class="btn btn-outline-danger delete-group">Delete</button></div>\n              \t\t\t\t\t</div>'
                    });
                    "" != b && ($(".group-list-show").html(b),
                    document.querySelectorAll(".sub-container").forEach(function(c) {
                        return c.style.display = "none"
                    }),
                    document.getElementsByClassName("group-list")[0].style.display = "block")
                } else
                    alertMessage("No group found", "red");
            else
                alertMessage("No group found", "red")
        })
    });
    $(document).on("click", ".view-cat", function() {
        document.querySelectorAll(".sub-container").forEach(function(a) {
            return a.style.display = "none"
        });
        document.getElementsByClassName("category-list")[0].style.display = "block"
    });
    $(document).on("click", ".edit-cat", function() {
        h = $(this).closest(".gp-row").attr("id");
        $("#cat-name").val($(this).attr("cat_name"));
        $("#add-new-category").show();
        $(".cat-for-hide").hide();
        $("#add-new-category").after('<div class="modal-backdrop fade in"></div>')
    });
    $(document).on("click", ".delete-cat", function() {
        catRow = $(this).closest(".gp-row");
        dGatid = $(this).closest(".gp-row").attr("id");
        $("#cat-delete-modal").show();
        $("#cat-delete-modal").after('<div class="modal-backdrop fade in"></div>')
    });
    $(document).on("click", ".delete-template", function() {
        templateRow = $(this).closest(".template-row");
        templateDelete = $(this).closest(".template-row").attr("id");
        $("#template-delete-modal").show();
        $("#template-delete-modal").after('<div class="modal-backdrop fade in"></div>')
    });
    $(document).on("click", ".close-modal", function() {
        $("#add-new-group, #import-new-group, #export-new-group, #template-delete-modal, #add-new-template, #add-new-category, #group-delete-modal, #cat-delete-modal").hide();
        $(".modal-backdrop.fade.in").remove();
        h = eGid = "0"
    });
    $(document).on("click", ".delete-group", function() {
        groupRow = $(this).closest(".gp-group-row");
        del_group_id = $(this).closest(".gp-group-row").attr("id");
        $("#group-delete-modal").show();
        $("#group-delete-modal").after('<div class="modal-backdrop fade in"></div>')
    });
    $(document).on("click", ".group-delete-btn", function() {
        $(".group-delete-btn").text("Please wait").prop("disabled", !0);
        delGroup()
    });
    $(document).on("click", ".template-delete-btn", function() {
        $(".cat-delete-btn").text("Please wait").prop("disabled", !0);
        delTemplate()
    });
    $(document).on("click", ".cat-delete-btn", function() {
        $(".cat-delete-btn").text("Please wait").prop("disabled", !0);
        delCat()
    });
    $(document).on("click", ".change-password-buttons", function() {
        var a = $("#password-c").val().trim();
        if (6 > a.length)
            return alertMessage("Password must be at least 6 characters", "red"),
            !1;
        $(".change-password-buttons").prop("disabled", !0);
        $(".change-password-buttons").text("Please wait");
        $.ajax({
            method: "POST",
            url: wpUrl + "changepassword",
            beforeSend: function(b) {
                b.setRequestHeader("Authorization", "Bearer " + token)
            },
            data: {
                password: a
            },
            success: function(b, c, g) {
                $(".change-password-buttons").prop("disabled", !1);
                $(".change-password-buttons").text("Update");
                0 != b.status && alertMessage(b.message, "green")
            },
            statusCode: {
                500: function(b) {
                    $(".change-password-buttons").prop("disabled", !1)
                }
            }
        })
    });
    $(document).on("click", ".save-group-btn-ext", function() {
        $(".c-ext-errror").hide();
        var a = document.getElementById("group-url").value.trim();
        if ("" == a)
            return $(".c-ext-errror").show(),
            !1;
        var b = document.getElementById("cat-for-group").value;
        Store.get(["groups"], function(c) {
            if (void 0 !== c.groups && c.groups.length) {
                var g = c.groups.filter(function(e) {
                    return e.cat_id == b && e.group_url == a
                });
                if (49 < c.groups.filter(function(e) {
                    return e.cat_id == b
                }).length)
                    return alertMessage("Group limit reached i.e. 50", "red"),
                    !1;
                g.length ? alertMessage("Group already exist in category", "red") : ($(".save-group-btn-ext").prop("disabled", !0),
                $(".save-group-btn-ext").text("Please wait"),
                $.ajax({
                    method: "POST",
                    url: wpUrl + "addgroup",
                    beforeSend: function(e) {
                        e.setRequestHeader("Authorization", "Bearer " + token)
                    },
                    data: {
                        addgroup: eGid,
                        group_url: a,
                        cat_id: b
                    },
                    success: function(e, k, l) {
                        $(".save-group-btn-ext").prop("disabled", !1);
                        $(".save-group-btn-ext").text("Save");
                        0 != e.status && (Store.set({
                            groups: e.groups
                        }),
                        alertMessage(e.message, "green"))
                    },
                    statusCode: {
                        500: function(e) {
                            $(".save-group-btn-ext").prop("disabled", !1)
                        }
                    }
                }))
            } else
                $(".save-group-btn-ext").prop("disabled", !0),
                $(".save-group-btn-ext").text("Please wait"),
                $.ajax({
                    method: "POST",
                    url: wpUrl + "addgroup",
                    beforeSend: function(e) {
                        e.setRequestHeader("Authorization", "Bearer " + token)
                    },
                    data: {
                        addgroup: eGid,
                        group_url: a,
                        token: token,
                        cat_id: b
                    },
                    success: function(e, k, l) {
                        $(".save-group-btn-ext").prop("disabled", !1);
                        $(".save-group-btn-ext").text("Save");
                        0 != e.status && (Store.set({
                            groups: e.groups
                        }),
                        alertMessage(e.message, "green"))
                    },
                    statusCode: {
                        500: function(e) {
                            $(".save-group-btn-ext").prop("disabled", !1)
                        }
                    }
                })
        })
    });
    var f = [];
    $("#import-file").change(function() {
        f = [];
        var a = document.getElementById("import-file");
        if (-1 == a.files[0].name.indexOf(".txt"))
            return alertMessage("Please add text file", "red"),
            $("#import-file").val(""),
            !1;
        var b = new FileReader;
        b.onload = function() {
            f = b.result.split("\n")
        }
        ;
        b.readAsText(a.files[0])
    });
    $(document).on("click", ".export-group-btn-ext", function() {
        $(".c-ext-errror").hide();
        var a = document.getElementById("cat-for-group-export").value;
        console.log(f);
        Store.get(["groups"], function(b) {
            if (void 0 !== b.groups && b.groups.length)
                if (b = b.groups.filter(function(g) {
                    return g.cat_id == a
                }),
                console.log(b),
                b.length) {
                    var c = "";
                    b.forEach(function(g) {
                        c += g.group_url + "\n"
                    });
                    downloadTextFile(c)
                } else
                    alertMessage("No group found", "red")
        })
    });
    $(document).on("click", ".import-group-btn-ext", function() {
        $(".c-ext-errror").hide();
        var a = document.getElementById("cat-for-group-import").value;
        Store.get(["groups"], function(b) {
            if (void 0 !== b.groups && b.groups.length) {
                var c = b.groups.filter(function(e) {
                    return e.cat_id == a
                });
                console.log(c);
                b = c.length;
                var g = [];
                f.forEach(function(e, k) {
                    e.length && !c.filter(function(l) {
                        l = l.group_url.split("/groups/")[1].replace("/", "");
                        var m = e.split("/groups/")[1].replace("/", "");
                        return l == m
                    }).length && g.push(e)
                });
                if (0 == g.length)
                    alertMessage("No group found in file", "red");
                else {
                    if (50 < b + g.length)
                        return alertMessage("Limit reached per category i.e. 50", "red"),
                        !1;
                    $(".import-group-btn-ext").prop("disabled", !0);
                    $(".import-group-btn-ext").text("Please wait");
                    $.ajax({
                        method: "POST",
                        url: wpUrl + "importgroup",
                        beforeSend: function(e) {
                            e.setRequestHeader("Authorization", "Bearer " + token)
                        },
                        data: {
                            addgroupne: eGid,
                            group_url: JSON.stringify(g),
                            cat_id: a
                        },
                        success: function(e, k, l) {
                            $(".close-modal").click();
                            f = [];
                            $(".import-group-btn-ext").prop("disabled", !1);
                            $(".import-group-btn-ext").text("Save");
                            "undefined" == typeof e.errors && (Store.set({
                                groups: e.groups
                            }),
                            alertMessage(e.message, "green"))
                        },
                        statusCode: {
                            500: function(e) {
                                $(".close-modal").click();
                                $(".import-group-btn-ext").prop("disabled", !1)
                            }
                        }
                    })
                }
            } else
                $(".import-group-btn-ext").prop("disabled", !0),
                $(".import-group-btn-ext").text("Please wait"),
                $.ajax({
                    method: "POST",
                    url: wpUrl + "importgroup",
                    beforeSend: function(e) {
                        e.setRequestHeader("Authorization", "Bearer " + token)
                    },
                    data: {
                        addgroupne: eGid,
                        group_url: JSON.stringify(f),
                        cat_id: a
                    },
                    success: function(e, k, l) {
                        $(".close-modal").click();
                        f = [];
                        $(".import-group-btn-ext").prop("disabled", !1);
                        $(".import-group-btn-ext").text("Save");
                        "undefined" == typeof e.errors && (Store.set({
                            groups: e.groups
                        }),
                        alertMessage(e.message, "green"))
                    },
                    statusCode: {
                        500: function(e) {
                            $(".import-group-btn-ext").prop("disabled", !1)
                        }
                    }
                })
        })
    });
    $(document).keyup(function(a) {
        $(".c-ext-errror").hide()
    });
    var h = 0;
    $(document).on("click", ".save-cat-btn-ext", function() {
        $(".c-ext-errror").hide();
        var a = document.getElementById("cat-name").value.trim()
          , b = document.getElementById("cat-for").value;
        "" != a ? ($(".save-cat-btn-ext").prop("disabled", !0),
        $(".save-cat-btn-ext").text("Please wait"),
        $.ajax({
            method: "POST",
            url: wpUrl + "addcat",
            beforeSend: function(c) {
                c.setRequestHeader("Authorization", "Bearer " + token)
            },
            data: {
                addcat: h,
                cat_for: b,
                cat_name: a
            },
            success: function(c, g, e) {
                $(".save-cat-btn-ext").prop("disabled", !1);
                $(".save-cat-btn-ext").text("Save");
                0 != c.status && (alertMessage(c.message, "green"),
                Store.set({
                    cats: c.cat_list
                }),
                catHtml(c.cat_list))
            },
            statusCode: {
                500: function(c) {
                    $(".save-group-btn-ext").prop("disabled", !1)
                }
            }
        })) : $(".c-ext-errror").show()
    });
    $(".gp-logout").on("click", function() {
        Store.set({
            login: !1
        });
        Store.set({
            groups: []
        });
        Store.set({
            cats: []
        });
        Store.set({
            login: !1
        });
        location.reload()
    });
    $('form[name="user_forgot"]').validate({
        rules: {
            user_email: {
                required: !0,
                email: !0
            }
        },
        submitHandler: function(a) {
            a = document.getElementById("user-email-1").value.trim();
            $(".forgot-gp-btn").prop("disabled", !0);
            $(".forgot-gp-btn").text("Sending");
            $.ajax({
                method: "POST",
                url: wpUrl + "sendforgot",
                data: {
                    email: a
                },
                success: function(b, c, g) {
                    $(".forgot-gp-btn").prop("disabled", !1);
                    $(".forgot-gp-btn").text("Forgot");
                    0 == b.status ? alertMessage(b.message, "red") : alertMessage(b.message, "green")
                },
                statusCode: {
                    500: function(b) {}
                }
            })
        }
    });
    $('form[name="user_login"]').validate({
        rules: {
            user_password: "required",
            user_email: {
                required: !0,
                email: !0
            }
        },
        submitHandler: function(a) {
            a = document.getElementById("user-email").value.trim();
            var b = document.getElementById("password").value.trim();
            $(".login-gp-btn").prop("disabled", !0);
            $(".login-gp-btn").text("Please wait");
            $.ajax({
                method: "POST",
                url: wpUrl + "login",
                data: {
                    email: a,
                    password: b,
                    login: ""
                },
                success: function(c, g, e) {
                    $(".login-gp-btn").prop("disabled", !1);
                    $(".login-gp-btn").text("Login");
                    0 == c.status ? (Store.set({
                        login: !1
                    }),
                    alert(c.message)) : (Store.set({
                        opt: c.data.opt
                    }),
                    token = c.token,
                    Store.set({
                        login: c.token
                    }),
                    Store.set({
                        groups: c.groups
                    }),
                    Store.set({
                        cats: c.cat_list
                    }),
                    Store.set({
                        postlist: c.post_list
                    }),
                    templateHtml(c.post_list),
                    catHtml(c.cat_list),
                    document.querySelectorAll(".sub-container").forEach(function(k) {
                        return k.style.display = "none"
                    }),
                    document.getElementsByClassName("category-list")[0].style.display = "block",
                    isactivate())
                },
                statusCode: {
                    500: function(c) {
                        Store.set({
                            login: !1
                        });
                        document.getElementsByClassName("invalid-credentials").style.display = "block";
                        setTimeout(function() {
                            document.getElementsByClassName("invalid-credentials").style.display = "none"
                        }, 3E3)
                    },
                    401: function() {
                        Store.set({
                            login: !1
                        });
                        document.getElementsByClassName("invalid-credentials")[0].style.display = "block";
                        setTimeout(function() {
                            document.getElementsByClassName("invalid-credentials")[0].style.display = "none"
                        }, 3E3)
                    }
                }
            })
        }
    })
}
var templateHtml = function(d) {
    var f = ""
      , h = "";
    d.forEach(function(a) {
        f += '<div id="' + a.id + '" class="row template-row">\n                     <div class="col-2 spacing">' + a.name + '</div>\n                     <div class="col-6 spacing">' + a.post_content.replace(/\\/g, "") + '</div>\n                     <div class="col-2 btn-css">\n                        <button class="btn btn-outline-primary edit-template ">Edit</button>\n                     </div>\n                     <div class="col-2 btn-css">\n                        <button class="btn btn-outline-danger delete-template ">Delete</button>\n                     </div>\n                  </div>';
        h += '<option value="' + a.id + '">' + a.name + "</option>"
    });
    $(".template-0").hide();
    "" != f ? ($(".template-list-show").html(f),
    $(".template-list-show").show(),
    $("#template-dropdown").html(h)) : ($("#template-dropdown").html(""),
    $(".template-list-show").hide(),
    $(".template-0").show());
    $("#template-dropdown").multiselect({
        maxHeight: 200,
        buttonWidth: "320px"
    })
}
  , catHtml = function(d) {
    var f = ""
      , h = "";
    d.forEach(function(a) {
        var b = "facebook" == a.cat_for ? "(FB)" : "(LK)";
        f += '<div class="gp-row" id="' + a.id + '">\n                <div class="gp-col-1">' + a.cat_name + " " + b + '</div>\n                <div class="gp-col-2">  <button type="button" class="btn btn-outline-primary view-groups"> Groups\n        </button></div>\n                <div class="gp-col-3">  <button type="button" class="btn btn-outline-info edit-cat" cat_name="' + a.cat_name + '"> Edit\n        </button></div>\n                <div class="gp-col-4">  <button type="button" class="btn btn-outline-danger delete-cat"> Delete\n        </button></div>\n          </div>';
        h += '<option value="' + a.id + '">' + a.cat_name + " " + b + "</option>"
    });
    $(".category-0").hide();
    "" != f ? ($(".category-list-show").html(f),
    $(".category-list-show").show(),
    $("#cat-for-group").html(h),
    $("#cat-for-group-import").html(h),
    $("#cat-for-group-export").html(h)) : ($(".category-list-show").hide(),
    $(".category-0").show())
};
function alertMessage(d, f) {
    var h = document.getElementById("snackbar");
    document.getElementById("snackbar").innerHTML = d;
    document.getElementById("snackbar").style.background = f;
    h.className = "show";
    setTimeout(function() {
        h.className = h.className.replace("show", "")
    }, 3E3)
}
function runningPoster() {
    $(".gp-poster-post").click();
    setTimeout(function() {
        Store.get(["runId", "pause", "multiTemplteIds"], function(d) {
            console.log(d);
            void 0 !== d.runId && $('#cat-for-run option[value="' + d.runId + '"]').prop("selected", !0);
            void 0 !== d.pause && 1 == d.pause && (document.querySelectorAll(".gp-a-btn").forEach(function(f) {
                return f.style.display = "none"
            }),
            $(".resume-posting").show(),
            $(".stop-posting").show());
            void 0 !== d.pause && 0 == d.pause && (document.querySelectorAll(".gp-a-btn").forEach(function(f) {
                return f.style.display = "none"
            }),
            $(".pause-posting").show(),
            $(".stop-posting").show(),
            d.multiTemplteIds.forEach(function(f) {
                $("#template-dropdown").multiselect("select", f)
            }))
        })
    }, 100)
}
function delGroup() {
    $.ajax({
        method: "POST",
        url: wpUrl + "deletegroup",
        data: {
            id: del_group_id
        },
        beforeSend: function(d) {
            d.setRequestHeader("Authorization", "Bearer " + token)
        },
        success: function(d, f, h) {
            $(".group-delete-btn").text("Delete").prop("disabled", !1);
            $(".close-modal").click();
            0 != d.status && (Store.set({
                groups: d.groups
            }),
            groupRow.remove(),
            alertMessage(d.message, "green"))
        },
        statusCode: {
            500: function(d) {}
        }
    })
}
function delTemplate() {
    $.ajax({
        method: "POST",
        url: wpUrl + "delpost",
        data: {
            deltemplate: "",
            id: templateDelete
        },
        beforeSend: function(d) {
            d.setRequestHeader("Authorization", "Bearer " + token)
        },
        success: function(d, f, h) {
            $(".cat-delete-btn").text("Yes").prop("disabled", !1);
            $(".close-modal").click();
            "undefined" == typeof d.errors && (Store.set({
                postlist: d.post_list
            }),
            templateRow.remove(),
            alertMessage(d.message, "green"))
        },
        statusCode: {
            500: function(d) {}
        }
    })
}
function isactivate() {
    $.ajax({
        method: "POST",
        url: wpUrl + "isactivate",
        data: {},
        beforeSend: function(d) {
            d.setRequestHeader("Authorization", "Bearer " + token)
        },
        success: function(d, f, h) {
            void 0 !== d.status && "logout" == d.status ? (Store.set({
                login: !1
            }),
            Store.set({
                groups: []
            }),
            Store.set({
                cats: []
            }),
            Store.set({
                login: !1
            }),
            location.reload()) : (void 0 !== d.linkedinid && Store.set({
                linkedinid: d.linkedinid
            }),
            void 0 !== d.facebookid && Store.set({
                facebookid: d.facebookid
            }))
        },
        statusCode: {
            500: function(d) {}
        }
    })
}
function delCat() {
    $.ajax({
        method: "POST",
        url: wpUrl + "deletecat",
        data: {
            deletecat: "",
            cat_id: dGatid
        },
        beforeSend: function(d) {
            d.setRequestHeader("Authorization", "Bearer " + token)
        },
        success: function(d, f, h) {
            $(".cat-delete-btn").text("Yes").prop("disabled", !1);
            $(".close-modal").click();
            0 != typeof d["false"] && (Store.set({
                cats: d.cat_list
            }),
            catRow.remove(),
            alertMessage(d.message, "green"))
        },
        statusCode: {
            500: function(d) {}
        }
    })
}
function downloadTextFile(d) {
    d = new Blob([d],{
        type: "text/plain;charset=utf-8"
    });
    saveAs(d, "group-list.txt")
}
;