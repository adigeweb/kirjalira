import contextMenuFunctions from "./contextMenuFunctions.js";
import controlModal from "./controlModal.js";
import googleBooksFetcher from "./googleBooksFetcher.js";
import loadBooks from "./loadBooks.js";
import loadShelves from "./loadShelves.js";
import navbarConfig from "./navbarConfig.js";
import publish from "./download.js";
import searchBook from "./searchBook.js";
import download from "./download.js";
import { auth, onAuthStateChanged, signOut, update, ref, db, set, get, remove, child, increment, push, deleteUser } from "./firebase.js";
import { signIn } from "./login.js";
import displayCode from "./displayCode.js";
import iconToName from "./iconToName.js";
import submitFunctions from "./submitFunctions.js";
import { pack, unpack } from "./pack-unpack.js";
import { dark, setTheme } from "./theme.js";

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#delete-account-verify").addEventListener("change", () => {
        if (document.querySelector("#delete-account-verify").value === "EMİNİM") {
            document.querySelector("button#delete-account").removeAttribute("disabled");
            document.querySelector("button#delete-account").addEventListener("click", () => {
                let uid = auth.currentUser.uid;
                if (!uid) {
                    alert("Hesabınızı silmek için önce o hesaba giriş yapmalısınız.");
                    return;
                }
                get(child(ref(db), `/users/${uid}`))
                    .then(snapshot => {
                        if (snapshot.val().save) {
                            remove(ref(db, `/saves/${snapshot.val().save}`));
                        }
                    }).then(() => {
                        remove(ref(db, `/users/${uid}`))
                            .then(() => {
                                alert("Kitaplık kaydınız silindi.");
                                deleteUser(auth.currentUser)
                                    .then(() => {
                                        alert("Hesabınız silindi.");
                                        controlModal("delete-account", "hide");
                                    }).catch(errHandler);
                                signOut(auth);
                            }).catch(errHandler);
                    });
            });
        }
        else {
            document.querySelector("button#delete-account").disabled = true;
        }
    });
    if (!localStorage.getItem("kvkk-kabul")) { controlModal("kvkk", "show") };
    document.querySelector("#kvkk-kabul").addEventListener("change", () => {
        if (document.querySelector("#kvkk-kabul").checked) {
            document.querySelector("button#tamam-kvkk").style.visibility = "visible";
        }
        else document.querySelector("button#tamam-kvkk").style.visibility = "hidden";
    });
    document.querySelector("button#tamam-kvkk").addEventListener("click", () => {
        if (!document.querySelector("#kvkk-kabul").checked) return;
        localStorage.setItem("kvkk-kabul", "true");
        controlModal("kvkk", "hide");
    })
    var authState = false;
    if (!localStorage.getItem("visited-before")) localStorage.setItem("visited-before", Date.parse(new Date()));
    if (localStorage.getItem("backup-mackup-dinlemem") === "tab2") localStorage.setItem("changes-and-loads-without-backup", "0");
    document.querySelector(":root").style.setProperty("--screen-h", screen.height);
    document.querySelector(":root").style.setProperty("--screen-w", screen.width);
    window.addEventListener("resize", () => {
        document.querySelector(":root").style.setProperty("--screen-h", screen.height);
        document.querySelector(":root").style.setProperty("--screen-w", screen.width);
    });
    document.querySelector(".add-shelf").addEventListener("click", () => {
        controlModal("add-shelf", "show");
    });
    document.querySelector("#add-book").addEventListener("click", () => {
        controlModal("add-book", "show");
    });
    document.querySelectorAll(".modal .close").forEach(item => {
        item.addEventListener("click", () => {
            controlModal(item.parentElement.id, "hide");
        });
    });
    document.querySelectorAll(".modal .content #submit").forEach(item => {
        item.addEventListener("click", () => {
            controlModal(item.parentElement.parentElement.id, "submit");
        });
    });
    document.querySelector(".header .title #edit").addEventListener("click", () => {
        if (document.querySelector(".header .title span").getAttribute("contenteditable")) {
            document.querySelector(".header .title span").innerText = document.querySelector(".header .title span").innerText.replaceAll("\n", "") || "Kitaplığım";
            document.querySelector(".header .title span").removeAttribute("contenteditable");
            document.querySelector(".header .title #edit").classList.remove("fa-check");
            document.querySelector(".header .title #edit").classList.add("fa-pencil");
            document.querySelector(".header .title #edit").setAttribute("data-title", "Düzenle");
            localStorage.setItem("library-name", document.querySelector(".header .title span").innerText);
        }
        else {
            document.querySelector(".header .title span").setAttribute("contenteditable", "true");
            document.querySelector(".header .title span").focus();
            document.querySelector(".header .title #edit").classList.remove("fa-pencil");
            document.querySelector(".header .title #edit").classList.add("fa-check");
            document.querySelector(".header .title #edit").setAttribute("data-title", "Kaydet");
        }
    });
    Array.from(document.querySelector(".shelves").childNodes).filter(n => n.nodeType == 1 && !n.classList.contains("add-shelf")).forEach(item => item.remove());
    loadShelves().forEach(item => {
        document.querySelector(".shelves").appendChild(item);
    });
    afterLoadShelves();
    document.querySelector(".header .title span").innerText = localStorage.getItem("library-name") || "Kitaplığım";
    if (!localStorage.getItem("library-name")) {
        localStorage.setItem("library-name", "Kitaplığım");
    }
    document.querySelectorAll(".shelf i.fa").forEach(item => {
        item.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            document.querySelectorAll("[data-ask-insurance]").forEach(deletable => {
                deletable.removeAttribute("data-ask-insurance");
            });
            document.querySelector(".context-menu#shelf").setAttribute("data-target", event.target.parentElement.getAttribute("data-key"));
            document.querySelector(".context-menu#shelf").style.left = `${event.clientX}px`;
            document.querySelector(".context-menu#shelf").style.top = `${event.clientY}px`;
            document.querySelector(".context-menu#shelf").style.display = "block";
        });
    });
    document.querySelector("#add-book input#thumbnail").addEventListener("input", (event) => {
        document.querySelector("#add-book img#preview").src = event.target.value;
    });
    document.querySelector("#edit-book input#thumbnail").addEventListener("input", (event) => {
        document.querySelector("#edit-book img#preview").src = event.target.value;
    });
    document.querySelector("#add-book button#google-books-search").addEventListener("click", async () => {
        if (!document.querySelector("#add-book input#name").value) return;
        const data = await googleBooksFetcher(document.querySelector("#add-book input#name").value);
        if (data.ok == 0) {
            alert("Bir sorun oluştu. Bilgileri elle girebilirsiniz.");
            return
        }
        var i = 0;
        document.querySelector("#add-book button#previous-result").removeAttribute("disabled");
        document.querySelector("#add-book button#next-result").removeAttribute("disabled");
        if (data.data.length == 1) document.querySelector("#add-book button#next-result").disabled = "true";
        const refill = () => {
            document.querySelector("#add-book input#name").value = data.data[i].title || document.querySelector("#add-book input#name").value;
            document.querySelector("#add-book input#authors").value = data.data[i].authors.join(", ") || "Bulunamadı.";
            document.querySelector("#add-book input#publisher").value = data.data[i].publisher || "Bulunamadı.";
            document.querySelector("#add-book input#publishedOn").value = data.data[i].publishedOn || "Bulunamadı.";
            document.querySelector("#add-book input#thumbnail").value = data.data[i].thumbnail || "https://placehold.co/150x150";
            document.querySelector("#add-book img#preview").src = document.querySelector("#add-book input#thumbnail").value;
        }
        refill();
        document.querySelector("#add-book button#previous-result").addEventListener("click", () => {
            if (i > 0) i--;
            document.querySelector("#add-book button#next-result").removeAttribute("disabled");
            document.querySelector("#add-book button#previous-result").removeAttribute("disabled");
            if (i == 0) {
                document.querySelector("#add-book button#previous-result").disabled = "true";
            }
            refill();
        });
        document.querySelector("#add-book button#next-result").addEventListener("click", () => {
            if (i < data.data.length - 1) i++;
            document.querySelector("#add-book button#previous-result").removeAttribute("disabled");
            document.querySelector("#add-book button#next-result").removeAttribute("disabled");
            if (i == data.data.length - 1) document.querySelector("#add-book button#next-result").disabled = "true";
            refill();
        });
    });
    const src = () => {
        if (!document.querySelector(".search #src-term").value) return;
        var results = searchBook(document.querySelector(".search #src-term").value, document.querySelector(".search select#criterion").value);
        document.querySelector(".empty").style.display = "none";
        if (results.length == 0) {
            document.querySelector(".empty").style.display = "block";
        }
        document.querySelector(".results").innerHTML = "";
        results.forEach(item => {
            var box = document.createElement("div");
            box.className = "box";
            var name = document.createElement("p");
            name.className = "name";
            name.innerText = `${item.book[0]}, ${item.book[1]}, ${item.book[2]}`;
            box.appendChild(name);
            var loc = document.createElement("p");
            loc.className = "location";
            loc.innerText = `"${item.shelf}", ${item.index + 1}`;
            box.appendChild(loc);
            document.querySelector(".results").appendChild(box);
        });
    }
    document.querySelector(".search #ok").addEventListener("click", src);
    document.querySelector(".search #src-term").addEventListener("input", src);
    navbarConfig(document.querySelector(".navbar"));
    document.querySelectorAll(".sections .label").forEach(item => {
        item.addEventListener("click", () => {
            if (document.querySelector(`.sections .label#${item.id}+.section`)?.getAttribute("data-active")) {
                document.querySelector(".sections .section[data-active]")?.removeAttribute("data-active");
                return;
            }
            document.querySelector(".sections .section[data-active]")?.removeAttribute("data-active");
            document.querySelector(`.sections .label#${item.id}+.section`)?.setAttribute("data-active", "true");
        });
    });
    document.querySelector("button#login-1").addEventListener("click", () => {
        if (!authState) signIn();
    });
    document.querySelector("button#download-file").addEventListener("click", () => {
        let data = pack();
        download(data, `${location.origin.split("://")[1] || location.origin}-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}.txt`);
    });
    document.querySelector(".label#paylas").addEventListener("click", () => {
        let data = pack();
        document.querySelector("span#file-size").innerText = (new TextEncoder().encode(pack).length / 1000).toFixed(1).toString();
    });
    document.querySelector(".label#ayarlar").addEventListener("click", () => {
        document.querySelector("meter#quota").min = "0";
        document.querySelector("meter#quota").max = "2000000";
        document.querySelector("meter#quota").value = JSON.stringify(localStorage).length;
        document.querySelector("span#quota-display").innerText = `${document.querySelector("meter#quota").value}/${document.querySelector("meter#quota").max}`;
    });
    document.querySelector("#load-file").addEventListener("click", () => {
        document.querySelector("#load-file-real").click();
    });
    var loadedData;
    document.querySelector("#load-file-real").addEventListener("change", () => {
        var fileList = document.querySelector("#load-file-real").files;
        var lastFile = fileList[fileList.length - 1];
        var fr = new FileReader();
        fr.onload = () => {
            loadedData = fr.result;
            document.querySelector("button#load-file-complete").removeAttribute("disabled");
        };
        fr.readAsText(lastFile);
        beforeLoadShelves();
        loadShelves().forEach(item => {
            document.querySelector(".shelves").appendChild(item);
        });
        afterLoadShelves();
    });
    document.querySelector("button#load-file-complete").addEventListener("click", () => {
        if (loadedData) {
            var overwrite = document.querySelector("#overwrite-current").checked;
            if (!overwrite) {
                overwrite = !confirm("Var olan kitaplığınız silinsin mi?");
            }
            unpack(loadedData, overwrite);
            beforeLoadShelves();
            loadShelves().forEach(item => {
                document.querySelector(".shelves").appendChild(item);
            });
            afterLoadShelves();
        }
    });
    document.querySelectorAll("a.inpage").forEach(item => {
        item.addEventListener("click", () => {
            var oldTransition = document.querySelector("#" + item.href.split("#")[1]).style.transition;
            document.querySelector("#" + item.href.split("#")[1]).style.transition = ".2s filter";
            document.querySelector("#" + item.href.split("#")[1]).style.backdropFilter = "brightness(0.8)";
            setTimeout(() => {
                document.querySelector("#" + item.href.split("#")[1]).style.backdropFilter = "none";
                setTimeout(() => {
                    document.querySelector("#" + item.href.split("#")[1]).style.transition = oldTransition;
                }, 250);
            }, 500);
        });
    });
    document.querySelector("button#logout-1").addEventListener("click", () => {
        signOut(auth);
        alert("Çıkış yapıldı. Yedeklerinize erişmek veya kitaplığınızı değişikliklerle yeniden yayınlamak için tekrar giriş yapın.");
        document.querySelector("button#logout-1").style.display = "none";
        document.querySelector("button#login-1").style.display = "block";
        document.querySelector("button#create-code").disabled = true;
        document.querySelector("canvas#qr-code").getContext("2d").clearRect(0, 0,
            document.querySelector("canvas#qr-code").width,
            document.querySelector("canvas#qr-code").height,
        );
        document.querySelector("span#code-display").innerText = "---";
    });
    document.querySelector("button#create-code").addEventListener("click", async () => {
        if (!auth.currentUser.uid) return;
        var snapshot = await get(child(ref(db), `/users/${auth.currentUser.uid}`));
        let data = pack();
        var code;
        let alreadyExists = true;
        while (alreadyExists) {
            code = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
            var checkSnapshot = await get(child(ref(db), `/saves/${code}`));
            alreadyExists = checkSnapshot.exists();
        }
        if (snapshot.val().save) {
            update(ref(db, `/saves/${snapshot.val().save}`), {
                Data: data,
                LastDate: Date.parse(new Date())
            }).then(() => {
                displayCode(snapshot.val().save, "qr-code");
            });
        }
        else {
            var testSnapshot = await get(child(ref(db), `/saves/${code}`));
            if (testSnapshot.exists()) {
                alert("Anlık bir hata oluştu. Lütfen \"Gönder\" butonuna tekrar tıklayınız.");
            }
            update(ref(db, `/saves/${code}`), {
                Data: data,
                User: auth.currentUser.uid,
                Date: Date.parse(new Date()),
                LastDate: Date.parse(new Date())
            }).then(() => {
                displayCode(code, "qr-code");
                update(ref(db, `/users/${auth.currentUser.uid}`), {
                    save: code
                }).then(() => {
                    alert("Kitaplığınız başarıyla yayınlandı!");
                })
            });
        }
    });
    document.querySelector("button#load-with-code").addEventListener("click", () => {
        var code = document.querySelector("input#enter-code").value;
        if (code.length != 6) {
            alert("Kod, 6 haneli olmalıdır.");
            return
        }
        get(child(ref(db), `/saves/${code}`))
            .then(snapshot => {
                if (!snapshot.exists()) {
                    alert("Kod hatalı!");
                    return;
                }
                var overwrite = document.querySelector("#overwrite-current-with-code").checked;
                if (!overwrite) {
                    overwrite = !confirm("Var olan kitaplığınız silinsin mi?");
                }
                unpack(snapshot.val().Data, overwrite);
                beforeLoadShelves();
                loadShelves().forEach(item => {
                    document.querySelector(".shelves").appendChild(item);
                });
                afterLoadShelves();
            });
    });
    document.querySelectorAll("img.thumbnail").forEach(item => {
        item.addEventListener("error", () => {
            item.src = "https://placehold.co/150x150";
        });
    });
    document.querySelectorAll("select#icon").forEach(item => {
        for (const [text, value] of Object.entries(iconToName)) {
            const option = document.createElement("option");
            option.innerHTML = `${text} <i class="fa fa-${text}"></i>`;
            option.value = text;
            item.appendChild(option);
        }
        item.addEventListener("change", () => {
            document.querySelector("i#test").removeAttribute("class");
            document.querySelector("i#test").classList.add("fa");
            document.querySelector("i#test").classList.add(`fa-${iconToName[item.value]}`);
        });
    });
    document.querySelectorAll("#copy-btn").forEach(item => {
        item.addEventListener("click", () => {
            navigator.clipboard.writeText(item.parentElement.querySelector("input#link").value);
            item.setAttribute("data-title", "Kopyalandı!");
            setTimeout(() => {
                item.setAttribute("data-title", "Kopyala");
            }, 2000);
        });
    });
    document.querySelector("button#send-feedback").addEventListener("click", async () => {
        if (Math.abs(document.querySelector(".feedback-form #topic").value.length - 25) > 20) {
            alert("Konu özeti; en az 5, en fazla 45 karakterden oluşmalıdır.");
            return;
        }
        else if (Math.abs(document.querySelector(".feedback-form #feedback").value.length - 105) > 95) {
            alert("Geri bildirim; en az 10, en fazla 200 karakterden oluşmalıdır.");
            return;
        }
        set(push(ref(db, `/feedbacks`)), {
            Email: document.querySelector(".feedback-form #email").value || "Belirtilmedi.",
            Topic: document.querySelector(".feedback-form #topic").value,
            Feedback: document.querySelector(".feedback-form #feedback").value
        }).then(() => {
            alert("Geri bildiriminiz başarıyla gönderildi. Teşekkürler!");
        }).catch(errHandler);
    });
    const expectedMainColors = [
        "blue;dodgerblue;rgb(30,224,225)",
        "yellow;goldenrod;rgb(255,200,0)",
        "green;green;limegreen",
        "pink;violet;pink"
    ];
    if (!localStorage.getItem("main-colors") || !expectedMainColors.includes(localStorage.getItem("main-colors"))) {
        localStorage.setItem("main-colors", expectedMainColors[0]);
        document.querySelector("#colors button.blue").classList.add("active");
    }
    else {
        document.querySelector(`#colors button.${localStorage.getItem("main-colors").split(";")[0]}`).classList.add("active");
        document.querySelector(":root").style.setProperty("--primary", localStorage.getItem("main-colors").split(";")[1]);
        document.querySelector(":root").style.setProperty("--secondary", localStorage.getItem("main-colors").split(";")[2]);
        document.querySelectorAll("#colors button").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelector("#colors button.active")?.classList.remove("active");
                localStorage.setItem("main-colors", `${item.classList.item(0)};${expectedMainColors.filter(n => n.startsWith(item.classList.item(0) + ";"))[0].split(";")[1]};${expectedMainColors.filter(n => n.startsWith(item.classList.item(0) + ";"))[0].split(";")[2]}`);
                document.querySelector(`#colors button.${localStorage.getItem("main-colors").split(";")[0]}`).classList.add("active");
                document.querySelector(":root").style.setProperty(!dark ? "--primary" : "--secondary", localStorage.getItem("main-colors").split(";")[1]);
                document.querySelector(":root").style.setProperty(!dark ? "--secondary" : "--primary", localStorage.getItem("main-colors").split(";")[2]);
            });
        });
    }
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            authState = true;
            document.querySelector("button#create-code").removeAttribute("disabled");
            document.querySelector("button#login-1").style.display = "none";
            document.querySelector("button#logout-1").style.display = "block";
            document.querySelector("p#backups").innerText = "Yedekler yükleniyor...";
            document.querySelector("button#delete-acc").style.display = "block";
            document.querySelector("button#delete-acc").addEventListener("click", () => {
                controlModal("delete-account", "show");
            });
            get(child(ref(db), `users/${user.uid}`))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        var backups = [
                            snapshot.val().backups[0],
                            snapshot.val().backups[1],
                            snapshot.val().backups[2],
                        ];
                        var dates = snapshot.val().backups.dates;
                        var table = document.createElement("table");
                        backups.filter(n => n).forEach((topItem, index) => {
                            var row = document.createElement("tr");
                            var col1 = document.createElement("td");
                            var date = new Date(parseInt(dates[index]));
                            col1.innerText = `Yedek ${index + 1} (${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear().toString().padStart(4, "0")}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()})`;
                            row.appendChild(col1);
                            var col2 = document.createElement("td");
                            var loadBtn = document.createElement("button");
                            loadBtn.innerText = "Yükle";
                            loadBtn.addEventListener("click", () => {
                                var ask = confirm("Bu yedeği yüklemek istediğinize emin misiniz?");
                                if (!ask) return;
                                var overwrite = !confirm("Var olan kitaplığınız silinsin mi?");
                                unpack(topItem, overwrite);
                                beforeLoadShelves();
                                loadShelves().forEach(item => {
                                    document.querySelector(".shelves").appendChild(item);
                                });
                                afterLoadShelves();
                            });
                            col2.appendChild(loadBtn);
                            row.appendChild(col2);
                            table.appendChild(row);
                        });
                        document.querySelector(".section:has(p#backups)").appendChild(table);
                        document.querySelector("p#backups").innerText = "";
                        document.querySelector("button#make-backup").addEventListener("click", async () => {
                            var childSnapshot = await get(child(ref(db), `/users/${user.uid}`));
                            if (!childSnapshot.exists()) return;
                            update(ref(db, `/users/${user.uid}`), {
                                lastBackup: Date.parse(new Date()),
                                backups: {
                                    0: pack(),
                                    1: childSnapshot.val().backups[0] || null,
                                    2: childSnapshot.val().backups[1] || null,
                                    dates: {
                                        0: Date.parse(new Date()),
                                        1: childSnapshot.val().backups.dates[0] || null,
                                        2: childSnapshot.val().backups.dates[1] || null
                                    }
                                }
                            }).then(() => {
                                alert("Yedekleme başarıyla yapılmış, sayfa yenilendiğinde buraya yansıyacaktır.");
                                localStorage.setItem("changes-and-loads-without-backup", "0");
                            })
                        });
                    }
                    else {
                        set(ref(db, `/users/${user.uid}`), {
                            createdOn: Date.parse(new Date()),
                            lastBackup: Date.parse(new Date()),
                            backups: {
                                0: pack(),
                                1: null,
                                2: null,
                                dates: {
                                    0: Date.parse(new Date()),
                                    1: null,
                                    2: null
                                }
                            }
                        });
                    }
                });
            var snapshot = await get(child(ref(db), `/users/${auth.currentUser.uid}`));
            if (snapshot.exists() && snapshot.val().save) {
                displayCode(snapshot.val().save, "qr-code");
                document.querySelector("button#create-code").innerText = "Güncelle";
            }
            document.querySelector("input#email").value = user.email;
        }
        else {
            authState = false;
            document.querySelector("button#create-code").disabled = true;
            document.querySelector("button#login-1").style.display = "block";
            document.querySelector("button#logout-1").style.display = "none";
            document.querySelector("p#backups").innerText = "Yedeklerinize ulaşmak veya yedekleme yapmak için lütfen giriş yapın.";
            document.querySelector("button#make-backup").disabled = true;
            document.querySelector("button#create-code").innerText = "QR Kod Oluştur";
            document.querySelector("button#delete-acc").style.display = "none";
            document.querySelector("input#email").value = "";
        }
        let firstVisit = new Date(parseInt(localStorage.getItem("visited-before")));
        document.querySelector("li span#first-visit-date").innerText = `${firstVisit.getDate().toString().padStart(2, "0")}.${(firstVisit.getMonth() + 1).toString().padStart(2, "0")}.${firstVisit.getFullYear().toString().padStart(4, "0")}`;
        let createdOn = null;
        let backupOn = null;
        document.querySelector("li span#sign-in-date").innerText = "Giriş yapılmadı.";
        document.querySelector("li span#last-backup-date").innerText = "Giriş yapılmadı.";
        if (!auth.currentUser) createdOn = backupOn = "Giriş yapılmadı.";
        else {
            get(child(ref(db), `/users/${auth.currentUser.uid}`))
                .then(snapshot => {
                    let date = [new Date(snapshot.val().createdOn), new Date(snapshot.val().lastBackup)];
                    createdOn = `${date[0].getDate().toString().padStart(2, "0")}.${(date[0].getMonth() + 1).toString().padStart(2, "0")}.${date[0].getFullYear().toString().padStart(4, "0")}`;
                    backupOn = `${date[1].getDate().toString().padStart(2, "0")}.${(date[1].getMonth() + 1).toString().padStart(2, "0")}.${date[1].getFullYear().toString().padStart(4, "0")}`;
                    document.querySelector("li span#sign-in-date").innerText = createdOn;
                    document.querySelector("li span#last-backup-date").innerText = backupOn;
                });
        }
    });
    const srcParams = Object.fromEntries(new URLSearchParams(location.search));
    const code = srcParams.code;
    if (code) {
        if (srcParams.shelf) {
            get(child(ref(db), `/saves/${code}`))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        console.log(snapshot.val().Data);
                        var shelfToImport = JSON.parse(snapshot.val().Data)["shelves"][parseInt(srcParams.shelf)];
                        var dataToImport = JSON.parse(snapshot.val().Data)["shelfData"][parseInt(srcParams.shelf)];
                        console.log(shelfToImport);
                        console.log(dataToImport);
                        submitFunctions["add-shelf"](
                            shelfToImport[0],
                            shelfToImport[1],
                            shelfToImport[2]
                        );
                        localStorage.setItem(`shelf-${srcParams.shelf}`,
                            dataToImport
                        );
                    }
                    location.href = location.origin + "/kitaplik";
                }).catch(errHandler);
        }
        else {
            var overwrite = !confirm("Bir kitaplığı açmaya çalışıyorsunuz. Var olan kitaplığınız silinsin mi?");
            get(child(ref(db), `/saves/${code}`))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        unpack(snapshot.val().Data, overwrite);
                        beforeLoadShelves();
                        loadShelves().forEach(item => {
                            document.querySelector(".shelves").appendChild(item);
                        });
                        afterLoadShelves();
                        location.href = location.origin + "/kitaplik";
                    }
                }).catch(errHandler);
        }
    }
});

const errHandler = (err) => {
    console.error(err);
    alert("Bir hata oluştu");
}

export const afterLoadShelves = () => {
    document.querySelectorAll(".context-menu").forEach(item => {
        item.querySelectorAll(".action").forEach(action => {
            action.addEventListener("click", () => {
                if (!item.getAttribute("data-target")) return;
                contextMenuFunctions[action.id](document.querySelector(`.shelf[data-key='${item.getAttribute("data-target")}']`), action);
            });
        });
    });
    window.addEventListener("click", (event) => {
        document.querySelectorAll(".context-menu").forEach(item => {
            item.style.display = "none";
        });
    });
    document.querySelectorAll(".shelf i.fa").forEach(item => {
        item.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            document.querySelector(".context-menu#shelf").setAttribute("data-target", event.target.parentElement.getAttribute("data-key"));
            document.querySelector(".context-menu#shelf").style.left = `${event.clientX}px`;
            document.querySelector(".context-menu#shelf").style.top = `${event.clientY}px`;
            document.querySelector(".context-menu#shelf").style.display = "block";
        });
        item.addEventListener("click", () => {
            document.querySelector(".container .main-view").style.display = "none";
            document.querySelector(".container .shelf-view").style.display = "block";
            setActiveKey(item.parentElement.getAttribute("data-key") || 0);
            document.querySelector(".books").innerHTML = "";
            loadBooks(activeKey).forEach(item => {
                document.querySelector(".books").appendChild(item);
            });
        });
    });
    document.querySelectorAll(".modal #cancel").forEach(item => {
        item.addEventListener("click", () => {
            controlModal(item.parentElement.parentElement.id, "hide");
        });
    });
    document.querySelector("#shelf-display").addEventListener("change", () => {
        document.querySelector(".books").removeAttribute("data-display");
        document.querySelector(".books").setAttribute("data-display", document.querySelector("#shelf-display").value);
    });
    document.querySelectorAll(".modal").forEach(item => {
        item.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                item.querySelector(".content button#submit").dispatchEvent(new Event("click"));
            }
        });
    });
    document.querySelector("li span#shelf-count").innerText = JSON.parse(localStorage.getItem("shelves")).length.toString();
}

export const beforeLoadShelves = () => {
    Array.from(document.querySelector(".shelves").childNodes).filter(n => n.nodeType == 1 && !n.classList.contains("add-shelf")).forEach(item => item.remove());
}

export var keyOnEdit = 0;

export const setKeyOnEdit = (key) => {
    if (!document.querySelector(`.shelf[data-key='${key}']`)) return;
    keyOnEdit = key;
}

export var activeKey = 0;

export const setActiveKey = (key) => {
    if (!document.querySelector(`.shelf[data-key='${key}']`)) return;
    activeKey = key;
}

export const rgbToHex = (r, g, b) => {
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
}