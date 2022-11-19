import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const scopes = "user-top-read user-follow-read user-library-read playlist-read-private";
const APP_URL = import.meta.env.VITE_APP_URL;

const authoriseUser = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=${scopes}&redirect_uri=${REDIRECT_URI}&show_dialog=true`;
    window.open(url, "login", "width:800 height:600");
}

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-to-spotify")
    loginBtn.addEventListener("click", authoriseUser);
})

window.setItemsInLocalStorage = ({ accessToken, expiresIn, tokenType }) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(EXPIRES_IN, (Date.now() + (expiresIn * 1000)));
    localStorage.setItem(TOKEN_TYPE, tokenType);
    window.location.href = APP_URL;
}

window.addEventListener("load", () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
        window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    }
    if (window.opener !== null && !window.opener.closed) {
        window.focus();
        if (window.location.href.includes("error")) {
            window.close();
        } 

        const { hash } = window.location;
        console.log(hash);
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");
        const expiresIn = searchParams.get("expires_in");
        const tokenType = searchParams.get("token_type");

        if (accessToken) {
            window.close();
            window.opener.setItemsInLocalStorage({ accessToken, expiresIn, tokenType });
        } else {
            window.close();
        }
    }
})