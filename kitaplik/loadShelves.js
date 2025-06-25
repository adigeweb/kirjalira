import { auth } from "./firebase.js";
import iconToName from "./iconToName.js";

export default function () {
    var shelves = localStorage.getItem("shelves");
    if (!shelves) {
        localStorage.setItem("shelves", "[]");
        return [];
    }
    localStorage.setItem("shelves", JSON.stringify(JSON.parse(shelves).filter(n => n)));
    if (!(JSON.parse(shelves).filter(n => (n.length == 3)))[0]) {
        localStorage.setItem("shelves", "[]");
        shelves = localStorage.getItem("shelves");
    }
    const nodes = [];
    JSON.parse(localStorage.getItem("shelves")).forEach((item, index) => {
        if (!item) return;
        const [name, color, icon] = item;
        const shelf = document.createElement("div");
        shelf.className = "shelf";
        shelf.setAttribute("data-key", index);
        const faI = document.createElement("i");
        faI.classList.add("fa", `fa-${iconToName[icon]}`);
        faI.style.background = color;
        const nameP = document.createElement("div");
        nameP.innerText = name.substring(0, 20);
        nameP.className = "shelf-name";
        shelf.appendChild(faI);
        shelf.appendChild(nameP);
        nodes.push(shelf);
    });
    if (auth.currentUser) {
        document.querySelector("#create-code").dispatchEvent(new Event("click"));
        localStorage.setItem("changes-and-loads-without-backup", "0");
    }
    else {
        if (!localStorage.getItem("changes-and-loads-without-backup") || isNaN(localStorage.getItem("changes-and-loads-without-backup"))) {
            localStorage.setItem("changes-and-loads-without-backup", "0");
        }
        localStorage.setItem("changes-and-loads-without-backup",
            (parseInt(localStorage.getItem("changes-and-loads-without-backup")) + 1).toString()
        );
        if (parseInt(localStorage.getItem("changes-and-loads-without-backup")) >= 10 && parseInt(localStorage.getItem("changes-and-loads-without-backup")) % 5 == 0) {
            alert("Uzun zamandır yedekleme yapılmadı. Daha Fazla > Yedekler sekmesinden yapmanız önerilir.")
        }
    }
    return nodes;
}