import { dark, setTheme } from "./theme.js";

export default function (node) {
    node.querySelectorAll("span.item:not([data-no-page])").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(`:is(span.item, .page)[data-active]`).forEach(elem => { elem.removeAttribute("data-active") });
            item.setAttribute("data-active", "true");
            document.querySelector(`.page#${item.id}`).setAttribute("data-active", "true");
        });
    });
    /* Özel Fonksiyonlar */
    node.querySelector("span.item#tema").addEventListener("click", () => { setTheme(!dark); });
    node.querySelector("span.item#gizlilik-politikasi").addEventListener("click", () => { location.href = "../gizlilik-politikasi"; });
}