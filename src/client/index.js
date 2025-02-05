// js files
import { handleSubmit } from './js/formHandler';

// sass files
import './styles/resets.scss';
import './styles/base.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';

// Event Listener for Form Submission
document.getElementById('urlForm').addEventListener('submit', handleSubmit);

// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}

// alert("I EXIST")
// console.log("CHANGE!!");
