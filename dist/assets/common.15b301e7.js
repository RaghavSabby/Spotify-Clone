const o="ACCESS_TOKEN",e="TOKEN_TYPE",a="EXPIRES_IN",r="LOADED_TRACKS",l={VITE_CLIENT_ID:"b9704199a35649f88c10815676b0c368",VITE_API_BASE_URL:"https://api.spotify.com/v1",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0}.VITE_APP_URL,E={userInfo:"me",featuredPlaylist:"browse/featured-playlists?limit=5",toplists:"browse/categories/toplists/playlists?limit=10",playlist:"playlists",userPlaylist:"me/playlists"},S=()=>{localStorage.removeItem(o),localStorage.removeItem(e),localStorage.removeItem(a),window.location.href=l},c=t=>JSON.parse(localStorage.getItem(t)),I=(t,s)=>localStorage.setItem(t,JSON.stringify(s)),i={DASHBOARD:"DASHBOARD",PLAYLIST:"PLAYLIST"};export{o as A,a as E,r as L,i as S,e as T,E as a,c as g,S as l,I as s};
