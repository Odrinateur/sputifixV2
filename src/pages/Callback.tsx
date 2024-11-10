import secureLocalStorage from "react-secure-storage";

export default function Callback() {
    secureLocalStorage.setItem('logged_in', 'true');
    secureLocalStorage.setItem('code', new URLSearchParams(window.location.search).get('code') as string);

    window.location.href = '/';
}