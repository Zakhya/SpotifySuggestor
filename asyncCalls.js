export async function get50Recommendations(token, selectedSeeds) {
    let url = `https://api.spotify.com/v1/recommendations?limit=50`
    let firstArtist = true
    let firstGenre = true
    let firstTrack = true
    console.log('selectedSeeds', selectedSeeds)
    selectedSeeds.artist.forEach(el => {
      if(firstArtist){
        url += `&seed_artists=${el.id}`
        selectedSeeds.artist = selectedSeeds.artist.filter(item => item !== el)
        firstArtist = false
       } else {
         url += `,${el.id}`
         selectedSeeds.artist = selectedSeeds.artist.filter(item => item !== el)
       }
     })
     console.log('selectedSeeds:', selectedSeeds);
   
    selectedSeeds.genre.forEach(el => {
      if(firstGenre){
        url += `&seed_genre=${el}`
        selectedSeeds.genre = selectedSeeds.genre.filter(item => item !== el)
        firstGenre = false
       } else {
         url += `,${el}`
         selectedSeeds.genre = selectedSeeds.genre.filter(item => item !== el)
       }
     })
     console.log('selectedSeeds:', selectedSeeds);
   
     selectedSeeds.topSong.forEach(el => {
       if(firstTrack){
         url += `&seed_tracks=${el.id}`
         selectedSeeds.topSong = selectedSeeds.topSong.filter(item => item !== el)
         firstTrack = false
        } else {
   
          url += `,${el.id}`
          selectedSeeds.topSong = selectedSeeds.topSong.filter(item => item !== el)
        }
      })
      console.log('selectedSeeds:', selectedSeeds);
   
     selectedSeeds.savedSong.forEach(el => {
       if(firstTrack){
         url += `&seed_tracks=${el.id}`
         selectedSeeds.savedSong = selectedSeeds.savedSong.filter(item => item !== el)
         firstTrack = false
        } else {
          url += `,${el.id}`
          console.log('selectedSeeds', selectedSeeds.artist)
          selectedSeeds.savedSong = selectedSeeds.savedSong.filter(item => item !== el)
        }
      })
     
     console.log(url)
     console.log('selectedSeeds:', selectedSeeds);
   
     const result = await fetch(url, {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   }
   
   export async function getGenres(token) {
     const result = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   } 
   
   
   export async function fetchAllSavedSongs(token) {
     let offset = 0;
     const limit = 50; // This is the maximum number of items the API returns in one call.
     let savedSongs = [];
     let shouldContinueFetching = true;
   
     while (shouldContinueFetching) {
         try {
             const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
                 headers: {
                     Authorization: `Bearer ${token}`
                 }
             });
   
             if (!response.ok) {
                 throw new Error(`HTTP error! Status: ${response.status}`);
             }
   
             const data = await response.json();
   
             const songs = data.items.map(item => ({
                 name: item.track.name,
                 id: item.track.id
             }));
   
             savedSongs = [...savedSongs, ...songs];
   
             // Check if there are more songs to fetch
             if (data.items.length < limit) {
                 shouldContinueFetching = false;
             } else {
                 offset += limit;
             }
   
         } catch (error) {
             console.error("Failed to fetch songs:", error);
             shouldContinueFetching = false; // Stop the loop in case of an error
         }
     }
   
     return savedSongs;
   }
   
   
   export async function fetchTop50Songs(token) {
     const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50", {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   }
   
   export async function fetchTop50Artists(token) {
     const result = await fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50", {
       method: "GET", headers: { Authorization: `Bearer ${token}` }
   });
   
   return await result.json();
   }

   export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });
  
  return await result.json();
  }
  
  export async function fetchPlaylists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });
  
  return await result.json();
  }
  
  // async function createPlaylist(token) {
  //   const requestBody = {
  //       "name": "New Playlist",
  //       "description": "New playlist description",
  //       "public": false
  //   };
  
  //   const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
  //       method: "POST",
  //       headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(requestBody)
  //   });
  
  //   const data = await response.json();
  //   return data.id;  // This will return the ID of the newly created playlist.
  // }
  