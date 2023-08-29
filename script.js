import { getAccessToken, redirectToAuthCodeFlow} from "./verify";
import { get50Recommendations, getGenres, fetchAllSavedSongs, fetchTop50Songs, fetchTop50Artists, fetchProfile, fetchPlaylists } from "./asyncCalls";
const clientId = "6fd7da8323b5478aafa52dc629d650f4"; // Replace with your client ID
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let userID = ''
let top50Tracks = [{}]
let top50Artists = [{}]
let recommendationArtist = {}
let finalRecomendationsList = [{}]
let genres = []
let savedSongs = [{}]
let selectedSeeds = {
  topSong: [],
  savedSong: [],
  artist: [],
  genre: []
}
let seedDisplay = []
let accessToken
let profile

let seedDiv = document.querySelector('.seedsDisplay')
const genresToListButton = document.querySelector('.submitButton');
const topSongsDropdown = document.getElementById('topSongs')
const topArtistsDropdown = document.getElementById('topArtists')
const savedSongsDropdown = document.getElementById('savedSongs')
const genresDropdown = document.getElementById('genres')
const getRecomendationsButton = document.getElementById('getRecomendationsButton')

getRecomendationsButton.addEventListener('click', async function(){
  console.log('selectedSeeds:', selectedSeeds);
  let recomendations = await get50Recommendations(accessToken, selectedSeeds)
  console.log(recomendations)
  recomendations.tracks.map((track, i = 0) => {
    let trackName = track.name;
  
    const featIndex = trackName.indexOf('(feat.');
    const ftIndex = trackName.indexOf('(ft.');
    if (featIndex !== -1) {
        trackName = trackName.substring(0, featIndex).trim();
      } else if(ftIndex !== -1){
        trackName = trackName.substring(0, ftIndex).trim();
    }
    finalRecomendationsList[i] = {
      name: trackName,
      artists: [],
      id: track.id,
      previewURL: track.preview_url,
      picURL: track.album.images[1].url,
      activated: false
    }
    track.artists.map(artist =>{
      if(i === 0) {
        finalRecomendationsList[i].artists.push(`${artist.name}`)
      } else{
        finalRecomendationsList[i].artists.push(` ${artist.name}`)
      }
    })
    i++
  })
  console.log(finalRecomendationsList)
  populateUI(profile);
})

genresToListButton.addEventListener('click', function() {
  if(topSongsDropdown.value !== 'none' && !selectedSeeds.topSong.some(songObject => songObject.song === topSongsDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.topSong.push({
      song: topSongsDropdown.value,
      id: top50Tracks.find(track => track.name === topSongsDropdown.value).id
    });
  }
  
  if(savedSongsDropdown.value !== 'none' && !selectedSeeds.savedSong.some(songObject => songObject.song === savedSongsDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.savedSong.push({
      song: savedSongsDropdown.value,
      id: savedSongs.find(track => track.name === savedSongsDropdown.value).id
    });
  }

  if(topArtistsDropdown.value !== 'none' && !selectedSeeds.artist.some(songObject => songObject.artist === topArtistsDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.artist.push({
      artist: topArtistsDropdown.value,
      id: top50Artists.find(track => track.name === topArtistsDropdown.value).id
    });
  }

  if(genresDropdown.value !== 'none' && !selectedSeeds.genre.includes(genresDropdown.value) && seedDiv.getElementsByTagName('span').length <= 5){
    selectedSeeds.genre.push(genresDropdown.value)
  }
     
    console.log(selectedSeeds)
    filterAndDisplaySeeds()


});



if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
    accessToken = await getAccessToken(clientId, code);
    profile = await fetchProfile(accessToken);
    userID = profile.id
    // const newPlaylistID = await createPlaylist(accessToken)
    const playlists = await fetchPlaylists(accessToken)
    const top50SongsRes = await fetchTop50Songs(accessToken)
    const top50ArtistsRes = await fetchTop50Artists(accessToken)
    const genreSeeds = await getGenres(accessToken)
    savedSongs = await fetchAllSavedSongs(accessToken)
    console.log(top50ArtistsRes)

    genreSeeds.genres.forEach(el => {
      genres.push(el)
    })
    top50SongsRes.items.map((item, i = 0) => {
      if (i < 1) recommendationArtist = {name: item.album.artists[0].name, id: item.album.artists[0].id}
      top50Tracks[i] = {
        name: item.name,
        id: item.id
      }
      i++
    })
    top50ArtistsRes.items.map((item, i = 0) => {
      top50Artists[i] = {
        name: item.name,
        id: item.id
      }
      i++
    })
    // console.log(newPlaylistID)
    populateStartingUI(profile)

  }

  function populateStartingUI(profile){
    let emailDisplayLink = document.getElementById("email")
    emailDisplayLink.innerText = profile.email;
    emailDisplayLink.setAttribute('href', profile.external_urls.spotify)
  
    savedSongs.forEach(song => {
      const option = document.createElement('option')
      option.setAttribute('value', song.name)
      option.innerHTML = song.name
      savedSongsDropdown.appendChild(option)
    })
  
    genres.forEach(el => {
      const option = document.createElement('option')
      option.setAttribute('value', el)
      option.innerHTML = el
      genresDropdown.appendChild(option)
    })
  
    top50Tracks.forEach(el => {
      const option = document.createElement('option')
      option.setAttribute('value', el.name)
      option.innerHTML = `${el.name}`
      topSongsDropdown.appendChild(option)
    })
  
    top50Artists.forEach(el => {
        const option = document.createElement('option')
        option.setAttribute('value', el.name)
        option.innerHTML = `${el.name}`
        topArtistsDropdown.appendChild(option)
    })
  }

function populateUI(profile) {
    
  let listEl = document.getElementById("suggestions")

  finalRecomendationsList.map((liEl) => {
    let cardContainer = document.createElement('div')
    cardContainer.addEventListener('click', function(){
      if(liEl.activated === false){
        cardContainer.style.backgroundColor = "#50c9d9"
        liEl = {
          activated: true,
        }
      } else {
        cardContainer.style.backgroundColor = "#526D82"
        liEl = {
          activated: false,
        }
      }
      console.log(finalRecomendationsList)
    })
    let nameEl = document.createElement('span')
    let artistEl = document.createElement('span')
    let playButtonWrapper = document.createElement('a')
    let playButton = document.createElement('i')
    let playButtonBackground = document.createElement('a')
    let albumPic = document.createElement('img')
    let albumAndPlayContainer = document.createElement('div')
    

    playButtonBackground.setAttribute('class', 'playButtonBackground')
    playButton.setAttribute('class', 'fa-solid fa-play playButton')
    albumAndPlayContainer.setAttribute('class', 'albumPlayContainer')
    albumPic.setAttribute('src', liEl.picURL)
    albumPic.setAttribute('class', 'albumPic')
    cardContainer.setAttribute('class', 'cardContainer')
    nameEl.setAttribute('class', 'card-name')
    artistEl.setAttribute('class', 'card-artist')
    playButtonBackground.setAttribute('href', liEl.previewURL)
    playButtonBackground.setAttribute('target', '_blank')      
    playButtonWrapper.setAttribute('class', 'playButtonWrapper')      
    
    nameEl.innerText = liEl.name
    artistEl.innerText = liEl.artists
    
    playButtonBackground.appendChild(playButton)
    playButtonWrapper.appendChild(playButtonBackground)
    albumAndPlayContainer.appendChild(albumPic)
    albumAndPlayContainer.appendChild(playButtonWrapper)
    cardContainer.appendChild(nameEl)
    cardContainer.appendChild(artistEl)
    cardContainer.appendChild(albumAndPlayContainer)
    listEl.append(cardContainer)
  })
}

function filterAndDisplaySeeds(){
  seedDiv.innerHTML = ``
  selectedSeeds.topSong.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el.song}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.topSong = selectedSeeds.topSong.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  selectedSeeds.savedSong.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el.song}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.savedSong = selectedSeeds.savedSong.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  selectedSeeds.artist.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el.artist}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.artist = selectedSeeds.artist.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  selectedSeeds.genre.forEach((el, i) => {
    if(seedDiv.getElementsByTagName('span').length >= 5) return
    const span = document.createElement('span')
    span.setAttribute('class', 'seed')
    span.textContent = `  ${el}`
    seedDiv.appendChild(span)
    span.addEventListener('click', function(){
      selectedSeeds.genre = selectedSeeds.genre.filter(e => e !== el)
      filterAndDisplaySeeds()
    })
  })
  console.log(seedDiv)

  let childSpans = seedDiv.getElementsByTagName('span')
  for(let i = 0; i < childSpans.length; i++){
    if (childSpans[i + 1] !== undefined) childSpans[i].textContent += `,`

  }
}
