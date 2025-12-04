console.log("lets write java script")

let currsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // let song = element.href.split("/%5Csongs%5C")[1]
            // songs.push(element.href.split(`/%5C${folder}%5C`)[1])
            // const url = new URL(element.href);
            // const file = decodeURIComponent(url.pathname.split("/").pop());
            // songs.push(file);

            const url = new URL(element.href);

            // 1) decode (%20 → space, %5C → \)
            let pathname = decodeURIComponent(url.pathname);
            // e.g. "/\songs\oldsong\song name.mp3"

            // 2) split by both / and \
            const parts = pathname.split(/[/\\]/);
            const file = parts.pop();  // "song name.mp3"

            songs.push(file);
        }
    }

    return songs
}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currsong.src = `/${currfolder}/` + track
    if (!pause) {
        currsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    //get the list of all songs
    songs = await getsongs("songs/oldsong")
    playmusic(songs[0], true)

    //show all the song in the play list
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Arun</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                            </li>`;
    }

    // attach a event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())//trim for remone space
        })
    })

    //attacch a event listener for play, next and previous
    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play()
            play.src = "pause.svg"
        }
        else {
            currsong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for time updation event
    currsong.addEventListener("timeupdate", () => {
        // console.log(currsong.currentTime, currsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)}/${secondsToMinutesSeconds(currsong.duration)}`
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
    })

    // add event listener to seekvar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currsong.currentTime = (currsong.duration * percent) / 100;
    })

    // Add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add event listener for previous song
    prev.addEventListener("click", () => {
        // console.log("prev clicked")
        // currsong.pause()
        let index = songs.indexOf(decodeURIComponent(currsong.src.split("/").pop()))
        if ((index - 1) >= 0) {
            currsong.pause()
            playmusic(songs[index - 1])
        }
    })

    // add event listener for next song
    next.addEventListener("click", () => {
        // console.log("next clicked")
        // currsong.pause()
        let index = songs.indexOf(decodeURIComponent(currsong.src.split("/").pop()))
        if ((index + 1) < songs.length) {
            currsong.pause()
            playmusic(songs[index + 1])
        }
    })

    // add event for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("setting volume : ", e.target.value, " / 100")
        currsong.volume = parseInt(e.target.value) / 100
    })


}

main()