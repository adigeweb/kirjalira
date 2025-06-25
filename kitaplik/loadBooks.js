import controlModal from "./controlModal.js";
import { Book } from "./itemInfo.js";

export default function (key) {
    if (!localStorage.getItem(`shelf-${key}`)) localStorage.setItem(`shelf-${key}`, "[]");
    var nodes = [];
    JSON.parse(localStorage.getItem(`shelf-${key}`)).filter(n => n).forEach((item, index) => {
        var name = document.createElement("span");
        name.id = "name";
        name.innerText = item[0];
        var fontSize = 0;
        if (item[0].length < 10) fontSize = 1.3;
        if (item[0].length >= 10 && item[0].length < 20) fontSize = 1;
        if (item[0].length >= 20 && item[0].length < 30) fontSize = 0.8;
        if (item[0].length > 30) fontSize = 0.75;
        name.style.fontSize = (1.75 * fontSize).toString() + "rem";
        var authors = document.createElement("span");
        authors.id = "authors";
        authors.innerText = item[1];
        var publishInfo = document.createElement("span");
        publishInfo.style.color = "var(--mid)";
        var publisher = document.createElement("span");
        publisher.id = "publisher";
        publisher.innerText = item[2];
        publishInfo.appendChild(publisher);
        publishInfo.innerHTML += " | ";
        var publishedOn = document.createElement("span");
        publishedOn.id = "publishedOn";
        publishInfo.appendChild(publishedOn);
        publishedOn.innerText = item[3];
        var thumbnail = document.createElement("img");
        thumbnail.id = "thumbnail";
        thumbnail.src = item[4];
        var thumbnailContainer = document.createElement("div");
        thumbnailContainer.className = "thumbnail-container";
        thumbnailContainer.appendChild(thumbnail);
        var editBtn = document.createElement("i");
        editBtn.classList.add("fa");
        editBtn.classList.add("fa-pencil");
        editBtn.addEventListener("click", () => {
            controlModal("edit-book", "get").querySelector("#name").value = item[0];
            controlModal("edit-book", "get").querySelector("#authors").value = item[1];
            controlModal("edit-book", "get").querySelector("#publisher").value = item[2];
            controlModal("edit-book", "get").querySelector("#publishedOn").value = item[3];
            controlModal("edit-book", "get").querySelector("#thumbnail").value = item[4];
            controlModal("edit-book", "get").querySelector("#thumbnail").dispatchEvent(new Event("input"));
            controlModal("edit-book", "get").querySelector("#key").value = index;
            controlModal("edit-book", "show");
        });
        editBtn.style.cursor = "pointer";
        var delBtn = document.createElement("i");
        delBtn.classList.add("fa");
        delBtn.classList.add("fa-trash");
        delBtn.style.cursor = "pointer";
        delBtn.addEventListener("click", () => {
            controlModal("delete", "get").querySelector("#type").value = "book";
            controlModal("delete", "get").querySelector("#key").value = index;
            controlModal("delete", "show");
        });
        var btnContainer = document.createElement("div");
        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(delBtn);
        btnContainer.className = "control-buttons";
        var book = document.createElement("div");
        book.className = "book";
        book.setAttribute("data-key", index);
        book.appendChild(thumbnailContainer);
        book.appendChild(name);
        book.appendChild(authors);
        book.appendChild(publishInfo);
        book.appendChild(btnContainer);
        nodes.push(book);
    });
    let totalBooks = 0;
    for (let i = 0; i < JSON.parse(localStorage.getItem("shelves")).length; i++) {
        totalBooks += JSON.parse(localStorage.getItem(`shelf-${i}`)) ?  JSON.parse(localStorage.getItem(`shelf-${i}`))?.length : 0;
    }
    document.querySelector("li span#book-count").innerText = totalBooks.toString();
    return nodes;
}