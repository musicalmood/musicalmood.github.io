let og = window.location.search
let id = og.substr(og.indexOf('id=')+3);
let testdat = []
const options = {
    inputs: 7,
    outputs: 2,
    task: 'classification',
    debug: true
}
  const nn = ml5.neuralNetwork(options);

  const modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  }
  nn.load(modelDetails, getTestDat)

  function modelLoaded(){
    console.log(testdat)
    nn.classify(testdat, function(err, result){
        console.log(result);
        document.getElementById("h1").innerHTML = "this song is " + result[0].label + " probabaly kinnda idk";
    })
  }

  async function getTestDat()
{
    let token
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
            //console.log(result.access_token)
            token  = result.access_token

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
       
           
        console.log(id)
            await fetch("https://api.spotify.com/v1/audio-features/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                    testdat = [result.danceability , result.energy ,  result.speechiness , result.acousticness , result.instrumentalness ,result.liveness,result.valence]
            })
            .catch(error => console.log('error', error));
        modelLoaded()
}
