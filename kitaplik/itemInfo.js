import iconToName from "./iconToName.js";

export class Shelf {
    constructor(node) {
        this.name = node.querySelector(".shelf-name").innerText;
        this.color = node.querySelector("i.fa").style.background;
        this.icon = Object.keys(iconToName).filter(n => iconToName[n] == node.querySelector("i.fa").classList[1].substring(3,
            node.querySelector("i.fa").classList[1].length
        ))[0];
    }
}

export class Book {
    constructor(node) {
        this.name = node.querySelector("span#name").innerText;
        this.authors = node.querySelector("span#authors").innerText.split(", ");
        this.publisher = node.querySelector("span#publisher").innerText;
        this.publishedOn = node.querySelector("span#publishedOn").innerText;
        this.image = node.querySelector("img#thumbnail").src;
    }
}