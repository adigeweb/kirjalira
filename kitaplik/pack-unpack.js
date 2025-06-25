export const pack = () => {
    var sampleData = {
        title: document.querySelector(".title h1 span").innerText,
        shelves: JSON.parse(localStorage.getItem("shelves")),
        shelfData: []
    }
    for (let i = 0; i < sampleData.shelves.length; i++) {
        sampleData.shelfData.push(JSON.parse(
            localStorage.getItem(`shelf-${i}`)
        ));
    }
    return JSON.stringify(sampleData);
}

export const unpack = (data, overwrite) => {
    let dataJSON = JSON.parse(data);
    localStorage.setItem("library-name", dataJSON.title);
    document.querySelector(".title h1 span").innerText = dataJSON.title;
    let length = 0;
    let shelves = [];
    if (overwrite) {
        length = JSON.parse(localStorage.getItem("shelves")).length;
        shelves = JSON.parse(localStorage.getItem("shelves"));
    }
    dataJSON.shelfData.forEach((shelf, i) => {
        localStorage.setItem(`shelf-${length + i}`, JSON.stringify(shelf));
    });
    dataJSON.shelves.forEach(shelf => {
        shelves.push(shelf); 
    });
    localStorage.setItem("shelves", JSON.stringify(shelves));
}