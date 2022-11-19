import"./style.c0ed6924.js";import{A as C,T as w,E as P,l as b,S as f,g as A,a as E,L as S,s as M}from"./common.15b301e7.js";const _="https://api.spotify.com/v1",H=()=>{const s=localStorage.getItem(C),t=localStorage.getItem(w),e=localStorage.getItem(P);if(Date.now()<e)return{accessToken:s,tokenType:t};b()},q=({accessToken:s,tokenType:t},e="GET")=>({headers:{Authorization:`${t} ${s}`},method:e}),I=async s=>{const t=`${_}/${s}`;return(await fetch(t,q(H()))).json()},a=new Audio;let B;const N=s=>{s.stopPropagation();const t=document.getElementById("profile-menu");t.classList.toggle("hidden"),t.classList.contains("hidden")||t.querySelector("li#logout").addEventListener("click",b)},j=()=>new Promise(async(s,t)=>{const e=document.getElementById("default-image"),n=document.getElementById("user-profile-btn"),l=document.getElementById("display-name"),{display_name:o,images:i}=await I(E.userInfo);console.log({displayName:o,images:i}),i!=null&&i.length?e.classList.add("hidden"):e.classList.remove("hidden"),n.addEventListener("click",N),l.textContent=o,s({displayName:o})}),D=(s,t)=>{console.log(s.target);const e={type:f.PLAYLIST,playlist:t};history.pushState(e,"",`playlist/${t}`),x(e)},v=async(s,t)=>{const{playlists:{items:e}}=await I(s);console.log({items:e});const n=document.getElementById(t);for(let{id:l,images:o,name:i,description:c}of e){const m=document.createElement("section");m.className="bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black",m.id=l,m.setAttribute("data-type","playlist"),m.addEventListener("click",r=>{D(r,l)});const[{url:p}]=o;m.innerHTML=`
                                    <img src="${p}" alt="${i}" class="rounded mb-2 object-contain shadow" />
                                    <h2 class="text-base font-semibold mb-4 truncate">${i}</h2>
                                    <h3 class="text-sm text-secondary line-clamp-2">${c}</h3>`,n.appendChild(m)}},F=()=>{v(E.featuredPlaylist,"featured-playlist-items"),v(E.toplists,"top-playlist-items")},O=s=>{const t=Math.floor(s/6e4),e=(s%6e3/1e3).toFixed(0);return e==60?t+1+":00":t+":"+(e<10?"0":"")+e},Y=(s,t)=>{document.querySelectorAll("#tracks .track").forEach(e=>{e.id===t?e.classList.add("bg-gray","selected"):e.classList.remove("bg-gray","selected")})},R=()=>{const s=document.getElementById("cover-content");s.innerHTML=`<h1 class="text-5xl">Hello, ${B}!</h1>`;const t=document.getElementById("page-content"),e=new Map([["featured playlist","featured-playlist-items"],["top playlist","top-playlist-items"]]);let n="";for(let[l,o]of e)n+=`<article class="p-4">
                        <h1 class="text-2xl mb-2 capitalize">${l}</h1>
                        <section id="${o}" class="grid grid-cols-auto-fill-cards featured-songs gap-4"></section>
                    </article>
                    `;t.innerHTML=n},U=s=>{const t=document.getElementById("play");t.querySelector("span").textContent="pause_circle";const e=document.querySelector(`#play-track-${s}`);e&&(e.innerHTML='<i class="fa-solid fa-pause"></i>')},z=s=>{const t=document.getElementById("play");t.querySelector("span").textContent="play_circle";const e=document.querySelector(`#play-track-${s}`);e&&(e.innerHTML='<i class="fa-solid fa-play"></i>')},K=()=>{const s=document.getElementById("total-song-duration");s.textContent=`0:${a.duration.toFixed(0)}`},L=()=>{a.src&&(a.paused?a.play():a.pause())},k=(s,{image:t,artistNames:e,name:n,duration:l,previewURL:o,id:i})=>{if(console.log({image:t,artistNames:e,name:n,duration:l,previewURL:o,id:i}),s!=null&&s.stopPropagation&&s.stopPropagation(),a.src===o)L();else{const c=document.getElementById("now-playing-image"),m=document.getElementById("now-playing-song"),p=document.getElementById("now-playing-artists"),r=document.getElementById("audio-control"),d=document.getElementById("song-info");r.setAttribute("data-track-id",i),c.src=t.url,m.textContent=n,p.textContent=e,a.src=o,a.play(),d.classList.remove("invisible")}},$=()=>{const t=document.querySelector("#audio-control").getAttribute("data-track-id");if(t){const e=A(S);return{currentTrackIndex:e==null?void 0:e.findIndex(l=>l.id===t),tracks:e}}return null},X=()=>{var e;const{currentTrackIndex:s=-1,tracks:t=null}=(e=$())!=null?e:{};if(s>-1&&s<(t==null?void 0:t.length)-1){const n=t[s+1];k(null,n)}},G=()=>{var e;const{currentTrackIndex:s=-1,tracks:t=null}=(e=$())!=null?e:{};if(s>0){const n=t[s-1];k(null,n)}},W=({tracks:s})=>{const t=document.getElementById("tracks");let e=1;const n=[];for(let l of s.items.filter(o=>o.track.preview_url)){let{id:o,artists:i,name:c,album:m,duration_ms:p,preview_url:r}=l.track,d=document.createElement("section");d.id=o,d.className="track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md hover:bg-light-black";let u=m.images.find(g=>g.height===64),y=Array.from(i,g=>g.name).join(", ");d.innerHTML=`
            <p class="w-full flex items-center justify-center justify-self-center relative"><span class="track-no">${e++}</span></p>
            <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
                <img class="h-10 w-10" src="${u.url}" alt="${c}" />
                <article class="flex flex-col gap-1 justify-center">
                    <h2 class="song-title text-base text-primary line-clamp-1 song-title">${c}</h2>
                    <p class="text-xs line-clamp-1">${y}</p>
                </article>
            </section>
            <p class="text-sm">${m.name}</p>
            <p class="text-sm">${O(p)}</p>
        `,d.addEventListener("click",g=>Y(g,o));const h=document.createElement("button");h.id=`play-track-${o}`,h.className="play w-full absolute left-0 text-lg invisible",h.innerHTML='<i class="fa-solid fa-play"></i>',h.addEventListener("click",g=>{k(g,{image:u,artistNames:y,name:c,duration:p,previewURL:r,id:o})}),d.querySelector("p").appendChild(h),t.appendChild(d),n.push({id:o,artistNames:y,name:c,album:m,duration:p,previewURL:r,image:u})}M(S,n)},J=async s=>{const t=await I(`${E.playlist}/${s}`);console.log(t);const{name:e,description:n,images:l,tracks:o}=t,i=document.getElementById("cover-content");i.innerHTML=`<img class="object-contain shadow" src="${l[0].url}" alt="${e}">
                                <section class="flex flex-col justify-center">
                                    <section class="mb-10">
                                        <h2 id="playlist-name" class="text-7xl font-bold">${e}</h2>
                                    </section>
                                    <section>
                                        <p id="playlist-description" class="text-l text-secondary mb-3">${n}</p>
                                        <p id="playlist-details" class="text-base text-primary">${o.items.length} songs</p>
                                    </section>
                                </section>`;const c=document.getElementById("page-content");c.innerHTML=`
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
    <section class="px-8 text-secondary mt-4" id="tracks"></section>`,W(t)},T=s=>{const{scrollTop:t}=s.target,e=document.querySelector(".header"),n=document.getElementById("cover-content"),l=n.offsetHeight,o=100-(t>=l?100:t/l*100),i=t>=e.offsetHeight?100:t/e.offsetHeight*100;if(n.style.opacity=`${o}%`,e.style.background=`rgba(0 0 0 / ${i}%)`,history.state.type===f.PLAYLIST){const c=document.getElementById("playlist-header");o<=35?(c.classList.add("sticky","bg-black-secondary","px-8"),c.classList.remove("mx-8"),c.style.top=`${e.offsetHeight}px`):(c.classList.remove("sticky","bg-black-secondary","px-8"),c.classList.add("mx-8"),c.style.top="revert")}},x=s=>{s.type===f.DASHBOARD?(R(),F()):s.type===f.PLAYLIST&&J(s.playlist),document.querySelector(".content").removeEventListener("scroll",T),document.querySelector(".content").addEventListener("scroll",T)},Q=s=>{const t={type:f.PLAYLIST,playlist:s};history.pushState(t,"",`/dashboard/playlist/${t.playlist}`),x(t)},V=async()=>{const s=await I(E.userPlaylist);console.log(s);const t=document.querySelector("#user-playlists > ul");t.innerHTML="";for(let{name:e,id:n}of s.items){const l=document.createElement("li");l.textContent=e,l.className="cursor-pointer text-secondary hover:text-primary",l.addEventListener("click",()=>Q(n)),t.appendChild(l)}};document.addEventListener("DOMContentLoaded",async()=>{const s=document.getElementById("play"),t=document.getElementById("next"),e=document.getElementById("prev"),n=document.getElementById("song-duration-completed"),l=document.getElementById("progress"),o=document.getElementById("volume"),i=document.getElementById("audio-control"),c=document.getElementById("timeline");let m;({displayName:B}=await j()),V();const p={type:f.DASHBOARD};history.pushState(p,"",""),x(p),document.addEventListener("click",()=>{const r=document.getElementById("profile-menu");r.classList.contains("hidden")||r.classList.add("hidden")}),a.addEventListener("loadedmetadata",K),a.addEventListener("play",()=>{const r=i.getAttribute("data-track-id"),d=document.getElementById("tracks"),u=d==null?void 0:d.querySelector("section.playing"),y=d==null?void 0:d.querySelector(`[id="${r}"]`);(u==null?void 0:u.id)!==(y==null?void 0:y.id)&&(u==null||u.classList.remove("playing")),y==null||y.classList.add("playing"),m=setInterval(()=>{a.paused||(n.textContent=`${a.currentTime.toFixed(0)<10?"0:0"+a.currentTime.toFixed(0):"0:"+a.currentTime.toFixed(0)}`,l.style.width=`${a.currentTime/a.duration*100}%`)},100),U(r)}),a.addEventListener("pause",()=>{m&&clearInterval(m);const r=i.getAttribute("data-track-id");z(r)}),s.addEventListener("click",()=>L),o.addEventListener("change",()=>{a.volume=o.value/100}),c.addEventListener("click",r=>{const d=window.getComputedStyle(c).width,u=r.offsetX/parseInt(d)*a.duration;a.currentTime=u,l.style.width=`${a.currentTime/a.diration*100}%`},!1),s.addEventListener("click",L),t.addEventListener("click",X),e.addEventListener("click",G),window.addEventListener("popstate",r=>{console.log(r),x(r.state)})});