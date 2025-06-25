document.querySelector("button#main").addEventListener("click", () => {
    location.href = "/kitaplik";
});

const typewriteField = document.querySelector("p#typewrite");
var i = 0;
var j = 0;
const texts = [
    "kitaplarınızı kaybetmeyin.",
    "sade bir arayüz ile raflara ayırın.",
    "yedekleme yaparak kitaplığınızı güvende tutun."
]
const typewrite = (text, target, delay) => {
    let string = "";
    if (i == Math.floor(delay / 50)) {
        target.style.opacity = "1";
        string = texts[j]
        target.innerText = string;
        j++;
        i = 0;
        if (!texts[j]) j = 0;
        setTimeout(() => {
            target.style.opacity = "0.3";
            setTimeout(() => {
                typewrite(texts[j], target, delay);
            }, 250);
        }, 1750);
    }
    else {
        for (let k = 0; k < text.length - 5; k++) {
            string += String.fromCharCode(Math.floor(Math.random() * 25) + 97);
        }
        string += ".";
        target.innerText = string;
        i++;
        setTimeout(() => {
            typewrite(text, target, delay);
        }, 75);
    }
}

typewrite(texts[j], typewriteField, 750);

const instTitles = [
    "I. Raf Oluştur",
    "II. Rafını Özelleştir",
    "III. Kitap Ekle",
    "IV. Bir Kitap Ara",
    "V. Kitaplığını Paylaş",
    "VI. Kitaplığını Yedekle"
]

const fillInsts = (m) => {
    document.querySelector(".right .content #text").innerText = instTitles[m];
    document.querySelector(".right .content #inst").style.backgroundImage = `url("./instructions/insts-${m}.png")`;
}

var n = 0;

fillInsts(n);

document.querySelector("#back").addEventListener("click", () => { n = (((n - 1) % instTitles.length) + instTitles.length) % instTitles.length; fillInsts(n) });
document.querySelector("#forward").addEventListener("click", () => { n = (((n + 1) % instTitles.length) + instTitles.length) % instTitles.length; fillInsts(n) });