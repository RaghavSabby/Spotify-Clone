import { fetchRequest } from "../api";
import { ENDPOINT, getItemFromLocalStorage, LOADED_TRACKS, logout, SECTIONTYPE, setItemInLocalStorage } from "../common";

const audio = new Audio();
let displayName;

const onProfileClick = (event) => {
    // Stop Bubbling
    event.stopPropagation();
    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")) {
        profileMenu.querySelector("li#logout").addEventListener("click", logout);
    }
}

const loadUserProfile = () => {
    return new Promise(async (resolve, reject) => {
        const defaultImage = document.getElementById("default-image");
        const userProfileBtn = document.getElementById("user-profile-btn");
        const displayNameElement = document.getElementById("display-name");
        const { display_name: displayName, images} = await fetchRequest(ENDPOINT.userInfo);
        console.log({displayName, images});
        if (images?.length) {
            defaultImage.classList.add("hidden");
        } else {
            defaultImage.classList.remove("hidden");
        }
        userProfileBtn.addEventListener("click", onProfileClick)
        displayNameElement.textContent = displayName;
        resolve({displayName});
    });

}

const onPlaylistItemClicked = (event, id) => {
    console.log(event.target);
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id }
    // kind of a key value pair -> "playlist" is key and section is value
    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
}

const loadPlaylist = async (endpoint, id) => {
    const { playlists: { items } } = await fetchRequest(endpoint);
    console.log({ items });
    const playlistsItemsSection = document.getElementById(id);
    for (let { id, images, name, description } of items) {
        const playlistsItem = document.createElement("section");
        playlistsItem.className = "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black";
        playlistsItem.id = id;
        playlistsItem.setAttribute("data-type", "playlist")
        playlistsItem.addEventListener("click", (event) => {
            onPlaylistItemClicked(event, id);
        });
        const [{ url: imageUrl }] = images;
        playlistsItem.innerHTML = `
                                    <img src="${imageUrl}" alt="${name}" class="rounded mb-2 object-contain shadow" />
                                    <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
                                    <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`;
        playlistsItemsSection.appendChild(playlistsItem);
    }
}

const loadPlaylists = () => {
    loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
    loadPlaylist(ENDPOINT.toplists, "top-playlist-items");
}

const formatTime = (duration) => {
    const min = Math.floor(duration / 60_000);
    const sec = ((duration % 6_000) / 1000).toFixed(0);
    const formattedTime = sec == 60 ? min+1+":00" : min+":"+(sec < 10 ? "0" : "") + sec;
    return formattedTime;
}

const onTrackSelection = (event, id) => {
    document.querySelectorAll("#tracks .track").forEach((trackItem) => {
        if (trackItem.id === id) {
            trackItem.classList.add("bg-gray", "selected");
        } else {
            trackItem.classList.remove("bg-gray", "selected");
        }
    });
}

const fillContentForDashboard = () => {
    const coverContent = document.getElementById("cover-content");
    coverContent.innerHTML = `<h1 class="text-5xl">Hello, ${displayName}!</h1>`
    const pageContent = document.getElementById("page-content");
    const playlistMap = new Map([["featured playlist", "featured-playlist-items"], ["top playlist", "top-playlist-items"]]);
    let innerHTML = "";
    for (let [type, id] of playlistMap) {
        innerHTML +=
                    `<article class="p-4">
                        <h1 class="text-2xl mb-2 capitalize">${type}</h1>
                        <section id="${id}" class="grid grid-cols-auto-fill-cards featured-songs gap-4"></section>
                    </article>
                    `;
    }
    pageContent.innerHTML = innerHTML;
}

const updateIconsForPlayMode = (id) => {
    const playButton = document.getElementById("play");
    playButton.querySelector("span").textContent = "pause_circle";
    const playButtonForTracks = document.querySelector(`#play-track-${id}`);
    if (playButtonForTracks) {
        playButtonForTracks.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }
}

const updateIconsForPauseMode = (id) => {
    const playButton = document.getElementById("play");
    playButton.querySelector("span").textContent = "play_circle";
    const playButtonForTracks = document.querySelector(`#play-track-${id}`);
    if (playButtonForTracks) {
        playButtonForTracks.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

const onAudioMetadataLoaded = () => {
    const totalSongDuration = document.getElementById("total-song-duration");
    totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
}

// const onNowPlayingButtonClicked = (id) => {
//     if (audio.paused) {
//         audio.play();
//         updateIconsForPlayMode(id);
//     } else {
//         audio.pause();
//         updateIconsForPauseMode(id);
//     }
// }

const toggelPlay = () => {
    if (audio.src) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }
}

const playTrack = (event, { image, artistNames, name, duration, previewURL, id }) => {
    console.log({ image, artistNames, name, duration, previewURL, id });
    if (event?.stopPropagation) {
        event.stopPropagation()
    }
    if (audio.src === previewURL) {
        toggelPlay();
    } else {
        const nowPlayingSongImage = document.getElementById("now-playing-image");
        const songTitle = document.getElementById("now-playing-song");
        const artists = document.getElementById("now-playing-artists");
        const audioControl = document.getElementById("audio-control");
        const songInfo = document.getElementById("song-info")
        audioControl.setAttribute("data-track-id", id);
        nowPlayingSongImage.src = image.url;
        songTitle.textContent = name;
        artists.textContent = artistNames;
    
        // audio.removeEventListener("loadedmetadata", () => onAudioMetadataLoaded(id));
        audio.src = previewURL;
        audio.play();
        songInfo.classList.remove("invisible");
    }
    
}

const findCurrentTrack = () => {
    const audioControl = document.querySelector("#audio-control");
    const trackId = audioControl.getAttribute("data-track-id");
    if (trackId) {
        const loadedTracks = getItemFromLocalStorage(LOADED_TRACKS);
        const currentTrackIndex = loadedTracks?.findIndex(track => track.id === trackId);
        return { currentTrackIndex, tracks: loadedTracks };
    }
    return null;
}

const playNextTrack = () => {
    const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {};
    if (currentTrackIndex > -1 && currentTrackIndex < tracks?.length - 1) {
        const currentTrack = tracks[currentTrackIndex + 1];
        playTrack(null, currentTrack);
    }
}

const playPrevTrack = () => {
    const { currentTrackIndex = -1, tracks = null } = findCurrentTrack() ?? {};
    if (currentTrackIndex > 0) {
        const prevTrack = tracks[currentTrackIndex - 1];
        playTrack(null, prevTrack);
    }
}

const loadPlaylistTracks = ({ tracks }) => {
    const trackSections = document.getElementById("tracks");
    let trackNo = 1;
    const loadedTracks = [];
    for (let trackItem of tracks.items.filter((item) => item.track.preview_url)) {
        let { id, artists, name, album, duration_ms: duration, preview_url: previewURL } = trackItem.track;
        let track = document.createElement("section");
        track.id = id;
        track.className = "track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black";
        let image = album.images.find((img) => img.height === 64);
        let artistNames = Array.from(artists, (artist) => artist.name).join(", ");
        track.innerHTML = `
            <p class="w-full flex items-center justify-center justify-self-center relative"><span class="track-no">${trackNo++}</span></p>
            <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
                <img class="h-10 w-10" src="${image.url}" alt="${name}" />
                <article class="flex flex-col gap-1 justify-center">
                    <h2 class="song-title text-base text-primary line-clamp-1 song-title">${name}</h2>
                    <p class="text-xs line-clamp-1">${artistNames}</p>
                </article>
            </section>
            <p class="text-sm">${album.name}</p>
            <p class="text-sm">${formatTime(duration)}</p>
        `;
        track.addEventListener("click", (event) => onTrackSelection(event, id));
        const playButton = document.createElement("button");
        playButton.id = `play-track-${id}`;
        playButton.className = "play w-full absolute left-0 text-lg invisible";
        playButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
        playButton.addEventListener("click", (event) => {
            playTrack(event, { image, artistNames, name, duration, previewURL, id })
        });
        track.querySelector("p").appendChild(playButton);
        trackSections.appendChild(track);
        loadedTracks.push({id, artistNames, name, album, duration, previewURL, image})
    }
    setItemInLocalStorage(LOADED_TRACKS, loadedTracks);
}

const fillContentForPlaylist = async (playlistId) => {
    const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
    console.log(playlist);
    const { name, description, images, tracks } = playlist;
    const coverElement = document.getElementById("cover-content");
    coverElement.innerHTML = `<img class="object-contain shadow" src="${images[0].url}" alt="${name}">
                                <section class="flex flex-col justify-center">
                                    <section class="mb-10">
                                        <h2 id="playlist-name" class="text-7xl font-bold">${name}</h2>
                                    </section>
                                    <section>
                                        <p id="playlist-description" class="text-l text-secondary mb-3">${description}</p>
                                        <p id="playlist-details" class="text-base text-primary">${tracks.items.length} songs</p>
                                    </section>
                                </section>`;
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = `
    <header id="playlist-header" class="mx-8 border-secondary border-b-[0.5px] z-10">
        <nav class="py-2">
            <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary">
                <li class="justify-self-center text-sm font-semibold">#</li>
                <li class="text-sm font-semibold">TITLE</li>
                <li class="text-sm font-semibold">ALBUM</li>
                <li class="text-sm font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </li>
            </ul>
        </nav>
    </header>
    <section class="px-8 text-secondary mt-4" id="tracks"></section>`;
    loadPlaylistTracks(playlist);
}

const onContentScroll = (event) => {
    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    const coverElement = document.getElementById("cover-content");
    const totalHeight = coverElement.offsetHeight;
    const coverOpacity = 100 - (scrollTop >= totalHeight ? 100 : ((scrollTop/totalHeight)*100));
    const headerOpacity = scrollTop >= header.offsetHeight ? 100 : ((scrollTop/header.offsetHeight)*100);
    coverElement.style.opacity = `${coverOpacity}%`;
    header.style.background = `rgba(0 0 0 / ${headerOpacity}%)`;

    // if (scrollTop >= header.offsetHeight) {
    //         header.classList.add("sticky", "top-0", "bg-black");
    //         header.classList.remove("bg-transparent");
    // } else {
    //         header.classList.remove("sticky", "top-0", "bg-black");
    //         header.classList.add("bg-transparent");
    // }

    if (history.state.type === SECTIONTYPE.PLAYLIST) {
        const playlistHeader = document.getElementById("playlist-header");
        if (coverOpacity <= 35) {
            playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.remove("mx-8");
            playlistHeader.style.top = `${header.offsetHeight}px`;
        } else {
            playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
            playlistHeader.classList.add("mx-8");
            playlistHeader.style.top = `revert`;
        }
    }
}

const loadSection = (section) => {
    if (section.type === SECTIONTYPE.DASHBOARD) {
        fillContentForDashboard();
        loadPlaylists();
    } else if (section.type === SECTIONTYPE.PLAYLIST) {
        // Load the elements of a particular playlist
        fillContentForPlaylist(section.playlist);
    }
    document.querySelector(".content").removeEventListener("scroll", onContentScroll);
    document.querySelector(".content").addEventListener("scroll", onContentScroll);
}

const onUserPlaylistClick = (id) => {
    const section = {type: SECTIONTYPE.PLAYLIST, playlist: id};
    history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);
    loadSection(section);
}

const loadUserPlaylists = async () => {
    const playlists = await fetchRequest(ENDPOINT.userPlaylist);
    console.log(playlists);
    const userPlaylist = document.querySelector("#user-playlists > ul");
    userPlaylist.innerHTML = "";
    for (let {name, id} of playlists.items) {
        const li = document.createElement("li");
        li.textContent = name;
        li.className = "cursor-pointer text-secondary hover:text-primary";
        li.addEventListener("click", () => onUserPlaylistClick(id));
        userPlaylist.appendChild(li);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    
    const playButton = document.getElementById("play");
    const nextTrack = document.getElementById("next");
    const prevTrack = document.getElementById("prev");
    const songDurationCompleted = document.getElementById("song-duration-completed");
    const songProgress = document.getElementById("progress");
    const volume = document.getElementById("volume");
    const audioControl = document.getElementById("audio-control");
    const timeline = document.getElementById("timeline");
    let progressInterval;

    ({displayName} = await loadUserProfile());
    loadUserPlaylists();
    const section = { type: SECTIONTYPE.DASHBOARD };
    // const section = { type: SECTIONTYPE.PLAYLIST, playlist: "37i9dQZF1DX8qj1nSNkJqB" };
    // history.pushState() adds an entry to the browser's session history stack
    history.pushState(section, "", "");
    // history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);
    loadSection(section);
    // loadPlaylists();
    // fillContentForDashboard();
    document.addEventListener("click", () => {
        const profileMenu = document.getElementById("profile-menu");
        if (!profileMenu.classList.contains("hidden")) {
            profileMenu.classList.add("hidden");
        }
    });
    
    audio.addEventListener("loadedmetadata", onAudioMetadataLoaded);
    audio.addEventListener("play", () => {
        const selectedTrackId = audioControl.getAttribute("data-track-id");
        const tracks = document.getElementById("tracks");
        const playingTrack = tracks?.querySelector("section.playing");
        const selectedTrack = tracks?.querySelector(`[id="${selectedTrackId}"]`);
        if (playingTrack?.id !== selectedTrack?.id) {
            playingTrack?.classList.remove("playing");

        }
        selectedTrack?.classList.add("playing");

        progressInterval = setInterval(() => {
            if (audio.paused) {
                return 
            }
            songDurationCompleted.textContent = `${audio.currentTime.toFixed(0) < 10 ? "0:0" + audio.currentTime.toFixed(0) : "0:" + audio.currentTime.toFixed(0)}`;
            songProgress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        }, 100);
        updateIconsForPlayMode(selectedTrackId)
    });

    audio.addEventListener("pause", () => {
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        const selectedTrackId = audioControl.getAttribute("data-track-id");
        updateIconsForPauseMode(selectedTrackId);
    });

    playButton.addEventListener("click", () => toggelPlay);

    volume.addEventListener(("change"), () => {
        audio.volume = volume.value / 100;
    });

    timeline.addEventListener("click", (event) => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = (event.offsetX / parseInt(timelineWidth)) * audio.duration;
        audio.currentTime = timeToSeek;
        songProgress.style.width = `${(audio.currentTime / audio.diration) * 100}%`;
    }, false);

    playButton.addEventListener("click", toggelPlay);
    nextTrack.addEventListener("click", playNextTrack);
    prevTrack.addEventListener("click", playPrevTrack);

    //  When user clicks the back button
    window.addEventListener("popstate", (event) => {
        console.log(event);
        loadSection(event.state);
    })
});