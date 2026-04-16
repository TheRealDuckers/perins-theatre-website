// js/firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const mockEvents = [
    {
        id: 1,
        name: "Romeo and Juliet",
        description: "Shakespeare's timeless tragedy of star-crossed lovers",
        date: "2026-05-15",
        time: "7:00 PM",
        capacity: 150,
        price: 15,
        image: "assets/romeo-juliet.jpg"
    },
    {
        id: 2,
        name: "Cinderella",
        description: "A magical fairy tale adventure with music and dance",
        date: "2026-06-20",
        time: "6:30 PM",
        capacity: 200,
        price: 12,
        image: "assets/cinderella.jpg"
    },
    {
        id: 3,
        name: "The Phantom of the Opera",
        description: "An epic musical tale of music, mystery, and romance",
        date: "2026-07-10",
        time: "7:30 PM",
        capacity: 180,
        price: 18,
        image: "assets/phantom.jpg"
    },
    {
        id: 4,
        name: "A Midsummer Night's Dream",
        description: "Comedy and magic in an enchanted forest",
        date: "2026-08-05",
        time: "7:00 PM",
        capacity: 160,
        price: 14,
        image: "assets/midsummer.jpg"
    }
];

let selectedSeats = [];
let currentEvent = null;
