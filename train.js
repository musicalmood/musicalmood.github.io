let og = window.location.search
let id = og.substr(og.indexOf('id=')+3);
let testdat = []
let nn;

const options = {
    inputs: 7,
    outputs: 2,
    task: 'classification',
    debug: true
}

function setup(){
    nn = ml5.neuralNetwork(options);
    console.log(nn)
    createTrainingData();
    nn.normalizeData();
    const trainingOptions={
        batchSize: 24,
        epochs: 32
    }
    getTestDat();
    nn.train(trainingOptions,finishedTraining);
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

}
function finishedTraining(){
    console.log(testdat)
    nn.classify(testdat, function(err, result){
        console.log(result);
        document.getElementById("h1").innerHTML = "this song is " + result[0].label + " probabaly kinnda idk";
    })
    //nn.save()
}

function createTrainingData(){
    nn.addData( [0.684, 0.687, 0.2, 0.0164, 0, 0.253, 0.265],  ['happy'])
    nn.addData( [0.797, 0.844, 0.275, 0.0651, 0, 0.087, 0.52],  ['happy'])
    nn.addData( [0.797, 0.853, 0.105, 0.000699, 0, 0.118, 0.595],  ['happy'])
    nn.addData( [0.841, 0.877, 0.0343, 0.129, 0.00416, 0.348, 0.474],  ['happy'])
    nn.addData( [0.816, 0.63, 0.226, 0.133, 0, 0.0692, 0.715],  ['happy'])
    nn.addData( [0.654, 0.452, 0.0439, 0.17, 0, 0.114, 0.532],  ['sad'])
    nn.addData( [0.746, 0.338, 0.109, 0.674, 0.000375, 0.529, 0.469],  ['sad'])
    nn.addData( [0.628, 0.676, 0.0916, 0.00957, 0.0000265, 0.121, 0.75],  ['sad'])
    nn.addData( [0.722, 0.658, 0.119, 0.208, 0, 0.249, 0.592],  ['sad'])
    nn.addData( [0.61, 0.258, 0.0331, 0.883, 0.0145, 0.103, 0.164],  ['sad'])
}
