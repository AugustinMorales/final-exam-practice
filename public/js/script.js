async function getRandomComic() {
    try {
        const response = await fetch('/randomComic');
        const comic = await response.json();

        document.getElementById('randomImg').src = comic.comicUrl;
        document.getElementById('randomTitle').textContent = comic.comicTitle;
    } catch (err) {
        console.error("Error fetching random comic:", err);
    }
}