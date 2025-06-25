export default function (name, criterion) {
    globalResults = [];
    searchOnShelf(0, name, criterion);
    return globalResults.slice(0, 50);
}

var globalResults = [];

const searchOnShelf = (key, name, i) => {
    if (!localStorage.getItem(`shelf-${key}`)) return;
    if (!JSON.parse(localStorage.getItem(`shelf-${key}`))) return;
    var shelfResults = [];
    JSON.parse(localStorage.getItem(`shelf-${key}`)).forEach((item, index) => {
        if (item[parseInt(i)] && item[parseInt(i)].toLowerCase().includes(name.toLowerCase())) {
            shelfResults.push({ book: item, shelf: JSON.parse(localStorage.getItem("shelves"))[key][0], index: index });
        }
    });
    globalResults.push(...shelfResults);
    if (localStorage.getItem(`shelf-${key + 1}`)) searchOnShelf(key + 1, name, i);
    else return true;
}