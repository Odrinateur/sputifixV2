import secureLocalStorage from "react-secure-storage";

export default function Callback() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
        secureLocalStorage.setItem('logged_in', 'true');
        secureLocalStorage.setItem('code', code);
    }
    window.location.href = '/';

    return null;
}