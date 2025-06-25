export default async function googleBooksFetcher(name) {
    try {
        const res = await fetch(`https://google-books-fetcher.vercel.app/api/books/?q=${name}`);
        const data = await res.json();

        return {
            ok: 1,
            dataOnly: data.items,
            data: data.items.map(node => ({
                title: node.volumeInfo.title,
                authors: node.volumeInfo.authors,
                publishedDate: node.volumeInfo.publishedDate,
                publisher: node.volumeInfo.publisher,
                thumbnail: node.volumeInfo.imageLinks?.thumbnail || ""
            }))
        };
    } catch (error) {
        console.error(error);
        return { ok: 0 };
    }
}