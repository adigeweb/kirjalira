import loadBooks from "./loadBooks.js";
import loadShelves from "./loadShelves.js";
import { activeKey, afterLoadShelves, beforeLoadShelves, keyOnEdit } from "./script.js";

export default {
    "add-shelf": (name, color, icon) => {
        let current = JSON.parse(
            localStorage.getItem("shelves") ?
            localStorage.getItem("shelves") : "[]"
        );
        current.push([name.substring(0, 15), color, icon]);
        localStorage.setItem("shelves", JSON.stringify(current));
        Array.from(document.querySelector(".shelves").childNodes).filter(n => n.nodeType == 1 && !n.classList.contains("add-shelf")).forEach(item => item.remove());
        beforeLoadShelves();
        loadShelves().forEach(item => {
            document.querySelector(".shelves").appendChild(item);
        });
        afterLoadShelves();
    },
    "edit-shelf": (name, color, icon) => {
        let current = JSON.parse(
            localStorage.getItem("shelves") ?
            localStorage.getItem("shelves") : "[]"
        );
        localStorage.setItem("shelves", JSON.stringify(current.map((n, i) => i != keyOnEdit ? n : [name.substring(0, 15), color, icon])));
        Array.from(document.querySelector(".shelves").childNodes).filter(n => n.nodeType == 1 && !n.classList.contains("add-shelf")).forEach(item => item.remove());
        beforeLoadShelves();
        loadShelves().forEach(item => {
            document.querySelector(".shelves").appendChild(item);
        });
        afterLoadShelves();
    },
    "add-book": (name, authors, publisher, publishedOn, thumbnail) => {
        if (localStorage.getItem(`shelf-${activeKey}`) === "null") localStorage.setItem(`shelf-${activeKey}`, "[]");
        let current = JSON.parse(
            localStorage.getItem(`shelf-${activeKey}`) ?
            localStorage.getItem(`shelf-${activeKey}`) : "[]"
        );
        current.push([name, authors, publisher, publishedOn, thumbnail || "https://placehold.co/150x150"]);
        localStorage.setItem(`shelf-${activeKey}`, JSON.stringify(current));
        document.querySelector(".books").innerHTML = "";
        loadBooks(activeKey).forEach(item => {
            document.querySelector(".books").appendChild(item);
        });
        document.querySelector("img#preview").src = "";
    },
    "edit-book": (name, authors, publisher, publishedOn, thumbnail, key) => {
        let current = JSON.parse(
            localStorage.getItem(`shelf-${activeKey}`) ?
            localStorage.getItem(`shelf-${activeKey}`) : "[]"
        );
        current[key] = [name, authors, publisher, publishedOn, thumbnail || "https://placehold.co/150x150"];
        localStorage.setItem(`shelf-${activeKey}`, JSON.stringify(current));
        document.querySelector(".books").innerHTML = "";
        loadBooks(activeKey).forEach(item => {
            document.querySelector(".books").appendChild(item);
        });
        document.querySelector("img#preview").src = "";
    },
    "delete": (type, key) => {
        if (type == "shelf") {
            localStorage.setItem("shelves",
                JSON.stringify(
                    JSON.parse(localStorage.getItem("shelves"))
                        .filter((n, i) => i != key)
                )
            );
            localStorage.removeItem(`shelf-${key}`);
            beforeLoadShelves();
            loadShelves().forEach(item => {
                document.querySelector(".shelves").appendChild(item);
            });
            afterLoadShelves();
        }
        if (type == "book") {
            let current = JSON.parse(
                localStorage.getItem(`shelf-${activeKey}`) ?
                localStorage.getItem(`shelf-${activeKey}`) : "[]"
            );
            current.splice(key, 1);
            localStorage.setItem(`shelf-${activeKey}`, JSON.stringify(current));
            document.querySelector(".books").innerHTML = "";
            loadBooks(activeKey).forEach(item => {
                document.querySelector(".books").appendChild(item);
            });
            document.querySelector("img#preview").src = "";
        }
    }
}