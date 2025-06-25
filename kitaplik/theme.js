export var dark = true;
var switchedOnce = false;

export const setTheme = (i) => {
    if (![true, false].includes(i)) return;
    dark = i;
    if (!i) {
        localStorage.setItem("theme", "false");
    }
    else if (i) {
        localStorage.setItem("theme", "true");
    }
    setCSSVariables();
}

const setCSSVariables = () => {
    let root = document.documentElement.style;
    root.setProperty("--text", dark ? "black" : "white");
    root.setProperty("--bg", dark ? "#eee" : "#333");
    root.setProperty("--darker", dark ? "#fff" : "#111");
    root.setProperty("--mid", dark ? "#fafafa" : "gray");
    root.setProperty("--theme", dark ? 1 : -1);
    let primary = root.getPropertyValue("--primary");
    let secondary = root.getPropertyValue("--secondary");
    if (!(switchedOnce || !dark) || switchedOnce) {
        root.setProperty("--primary", secondary);
        root.setProperty("--secondary", primary);
        switchedOnce = true;
    }
    document.querySelector("img.logo-bg").style.filter = `grayscale(100%) brightness(${dark ? "150" : "50"}%)`;
}

const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

window.addEventListener("load", () => {
    setTheme(localStorage.getItem("theme") ? localStorage.getItem("theme").toLowerCase() === "true" : userPrefersDark);
});
