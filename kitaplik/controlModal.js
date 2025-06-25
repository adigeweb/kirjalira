import submitFunctions from "./submitFunctions.js";

export default function (name, action) {
    if (!["show", "hide", "submit", "get"].includes(action)) return;
    if (!document.querySelector(`.modal#${name}`)) return;
    switch (action) {
        case "show":
            document.querySelector(`.modal#${name}`).style.display = "flex";
            document.querySelector(".mask").style.display = "block";
            break;
        case "hide":
            document.querySelector(`.modal#${name}`).style.display = "none";
            document.querySelector(".mask").style.display = "none";
            Array.from(document.querySelector(`.modal#${name} .content`).childNodes).filter(n => n.value).forEach(item => {
                item.value = item.getAttribute("data-default") || "";
            });
            break;
        case "submit":
            document.querySelector(`.modal#${name} .content .error`).style.display = "none";
            var okay = true;
            Array.from(document.querySelector(`.modal#${name} .content`).childNodes).filter(n => n.nodeType == 1 && n.getAttribute("data-required")).forEach(item => {
                if (!item.value) {
                    document.querySelector(`.modal#${name} .content .error`).style.display = "block";
                    okay = false;
                }
            });
            if (okay) {
                submitFunctions[name](
                    ...document.querySelector(`.modal#${name} .content #submit`)
                        .getAttribute("data-args").split(",")
                        .map(n => document.querySelector(`.modal#${name} .content #${n}`).value),
                    document.querySelector(`.modal#${name} .content #submit`).getAttribute("data-error")
                );
                document.querySelector(`.modal#${name}`).style.display = "none";
                document.querySelector(".mask").style.display = "none";
                Array.from(document.querySelector(`.modal#${name} .content`).childNodes).filter(n => n.value).forEach(item => {
                    item.value = item.getAttribute("data-default") || "";
                });
            }
            break;
        case "get":
            return document.querySelector(`.modal#${name}`);
        default:
            break;
    }
}