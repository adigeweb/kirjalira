export default (code, canvas) => {
    document.querySelector("span#code-display").innerText = code;
    QRCode.toCanvas(document.querySelector(`canvas#${canvas}`), `${location.origin}/kitaplik/?code=${code}`, (err) => {
        if (err) console.error(err);
    });
}