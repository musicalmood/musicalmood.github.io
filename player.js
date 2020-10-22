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
    let requestOptions2 = {
        method: 'GET',
        headers: {
            "ChannelID": "Hi this is from html"
        },
    };
    let id = ""
    await fetch("https://discord-snap-bot.herokuapp.com/song", requestOptions2)
    .then(response => response.text())
    .then(result => {
        id = result
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
document.getElementById("playpause").addEventListener("click", myFunction);
let pause = false
function myFunction() {
    if(pause === false) {
        fetch('https://discord-snap-bot.herokuapp.com/pause')
        document.getElementById("playpause").innerHTML = "I>";
    }
    else {
        fetch('https://discord-snap-bot.herokuapp.com/play')
        document.getElementById("playpause").innerHTML = "| |";
    }
    pause = !pause
}
