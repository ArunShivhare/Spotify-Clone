console.log("lets write java script")

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // let song = element.href.split("/%5Csongs%5C")[1]
            songs.push(element.href.split("/%5Csongs%5C")[1])
        }
    }

    return songs
}

async function main() {
    //get the list of all songs
    let songs = await getsongs()
    console.log(songs)

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

    // play the first song 
    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime)

    })
}

main()