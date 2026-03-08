export const episodes = Array.from({ length: 62 }, (_, i) => {
    const id = i + 1;
    let season = 1, episode = id;
    if (id > 7 && id <= 20) { season = 2; episode = id - 7; }
    else if (id > 20 && id <= 33) { season = 3; episode = id - 20; }
    else if (id > 33 && id <= 46) { season = 4; episode = id - 33; }
    else if (id > 46) { season = 5; episode = id - 46; }

    return {
        id,
        season,
        episode,
        title: `Episode ${episode}`
    };
});
// Special titles for pilot & finale to add flavor
episodes[0].title = "Pilot";
episodes[61].title = "Felina";
