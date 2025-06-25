import controlModal from "./controlModal.js";
import loadShelves from "./loadShelves.js";
import { afterLoadShelves, beforeLoadShelves, keyOnEdit, rgbToHex, setKeyOnEdit } from "./script.js";
import { Shelf } from "./itemInfo.js";
import { auth, child, db, get, ref, update } from "./firebase.js";
import { pack } from "./pack-unpack.js";
import displayCode from "./displayCode.js";

export default {
    "open": (shelf, action) => {
        shelf.querySelector("i.fa").click();
    },
    "edit": (shelf, action) => {
        controlModal("edit-shelf", "get").querySelector("#name").value = new Shelf(shelf).name;
        controlModal("edit-shelf", "get").querySelector("#color").value = rgbToHex(...(new Shelf(shelf).color).split("(")[1].replaceAll(" ", "").replaceAll(");", "").split(","));
        controlModal("edit-shelf", "get").querySelector("#icon").value = new Shelf(shelf).icon;
        setKeyOnEdit(shelf.getAttribute("data-key"));
        controlModal("edit-shelf", "show");
    },
    "share": async (shelf, action) => {
        if (!auth.currentUser.uid) {
            alert("Bu özelliği kullanmak için giriş yapmalısınız. (Daha Fazla > Kitaplığı Paylaş / İçeri Aktar)");
        };
        controlModal("copy-link", "get").querySelector("input#link").value = "Yükleniyor...";
        controlModal("copy-link", "show");
        var snapshot = await get(child(ref(db), `/users/${auth.currentUser.uid}`));
        let data = pack();
        if (snapshot.val().save) {
            update(ref(db, `/saves/${snapshot.val().save}`), {
                Data: data,
                LastDate: Date.parse(new Date())
            }).then(() => {
                displayCode(snapshot.val().save, "qr-code");
                controlModal("copy-link", "get").querySelector("input#link").value = `${location.origin}/kitaplik/?code=${document.querySelector("#code-display").innerText}&shelf=${shelf.getAttribute("data-key")}`;
            });
        }
        else {
            alert("Bu özelliği kullanmak için kitaplığınızı yayınlamalısınız. (Daha Fazla > Kitaplığı Paylaş / İçeri Aktar)");
        }
    },
    "delete": (shelf, action) => {
        controlModal("delete", "get").querySelector("#type").value = "shelf";
        controlModal("delete", "get").querySelector("#key").value = shelf.getAttribute("data-key");
        controlModal("delete", "show");
    }
}