let og = window.location.search
let channelID = og.substr(og.indexOf('id=')+3);
let id = ""
let slider = document.getElementById("myRange");
getDat()
async function getDat()
{
    let token = ''
    let urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    let requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": "Basic YzYzMDdhMWRkZDEzNDQ1OTkyNzY4NWQyYWZkYjcwMzg6Y2U2OWU2ZmY4ZDcxNGI1NTkwMDZiZmQ0OWU4NjE5NjE=",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlencoded,
        redirect: 'follow'
    };

    await fetch("https://accounts.spotify.com/api/token", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result.access_token)
            token = result.access_token

        })
        .catch(error => console.log('error', error));

    requestOptions = {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        redirect: 'follow'
    };

    await fetch("https://discord-snap-bot.herokuapp.com/song?channelID=" + channelID)
    .then(response => response.json())
    .then(result => {
        id = result.songId
        slider.max = result.duration/1000
        slider.value = (Date.now() - result.time)/1000
    })
    .catch(error => console.log('error', error));
    await fetch("https://api.spotify.com/v1/tracks/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result.album.images[0].url)
            var img = document.getElementById('img');
            img.src =  result.album.images[0].url
            img.id = 'img'
            img.className ="img-rounded"
            var title = document.getElementById('title')
            title.innerHTML = result.name + ' - ' + result.album.name
        })
        .catch(error => console.log('error', error));

}
let pause = false
document.getElementById("playpause").addEventListener("click", function (){
    if(pause === false) {
        fetch('https://discord-snap-bot.herokuapp.com/pause')
        document.getElementById("playpause").innerHTML = "I>";
    }
    else {
        fetch('https://discord-snap-bot.herokuapp.com/play')
        document.getElementById("playpause").innerHTML = "| |";
    }
    pause = !pause
});
document.getElementById("next").addEventListener("click", function (){

    fetch('https://discord-snap-bot.herokuapp.com/next')
});

slider.oninput = function() {
    fetch('https://discord-snap-bot.herokuapp.com/seek?time=' + this.value)
}
setTimeout(async function () {
    while(true)
    {
        await fetch("https://discord-snap-bot.herokuapp.com/song?channelID=" + channelID)
            .then(response => response.json())
            .then(result => {
                if(result.songId !== id)
                {
                    getDat()
                }else {
                    slider.max = result.duration / 1000
                    slider.value = Math.ceil((Date.now() - result.time) / 1000)
                }
            })
            .catch(error => console.log('error', error));
    }

}, 0);

