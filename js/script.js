// js/script.js
const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLIC_KEY');

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    initializeEventSelectors();
    initializeAdmin();
});

function loadEvents() {
    const eventSelect = document.getElementById('event-select');
    const featuredEventsContainer = document.getElementById('featured-events');
    const eventsContainer = document.getElementById('events-container');

    mockEvents.forEach(event => {
        if (eventSelect) {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = `${event.name} - ${event.date} @ ${event.time}`;
            eventSelect.appendChild(option);
        }

        const eventCard = document.createElement('div');
        eventCard.className = 'event-card p-6 rounded-lg cursor-pointer hover:shadow-lg transition fade-in';
        eventCard.innerHTML = `
            <h3 class="text-2xl font-bold mb-2">${event.name}</h3>
            <p class="text-gray-300 mb-4">${event.description}</p>
            <p class="text-blue-300 font-bold mb-2">📅 ${event.date} @ ${event.time}</p>
            <p class="text-blue-300 font-bold mb-4">💵 $${event.price}</p>
            <p class="text-gray-400 mb-4">Capacity: ${event.capacity} seats</p>
            <button onclick="selectEvent(${event.id})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full">
                View Details
            </button>
        `;

        if (featuredEventsContainer && mockEvents.indexOf(event) < 3) {
            const clonedCard = eventCard.cloneNode(true);
            clonedCard.querySelector('button').onclick = () => selectEvent(event.id);
            featuredEventsContainer.appendChild(clonedCard);
        }
        if (eventsContainer) {
            const clonedCard = eventCard.cloneNode(true);
            clonedCard.querySelector('button').onclick = () => selectEvent(event.id);
            eventsContainer.appendChild(clonedCard);
        }
    });
}

function initializeEventSelectors() {
    const eventSelect = document.getElementById('event-select');
    if (eventSelect) {
        eventSelect.addEventListener('change', (e) => {
            const eventId = parseInt(e.target.value);
            if (eventId) {
                selectEvent(eventId);
            }
        });
    }
}

function selectEvent(eventId) {
    currentEvent = mockEvents.find(e => e.id === eventId);
    if (!currentEvent) return;

    const container = document.getElementById('seat-selection-container');
    if (container) {
        container.classList.remove('hidden');
        generateTheaterLayout();
        window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
    }
}

function generateTheaterLayout() {
    const theaterLayout = document.getElementById('theater-layout');
    if (!theaterLayout || !currentEvent) return;

    theaterLayout.innerHTML = '<div class="stage">🎬 STAGE 🎬</div>';

    const rows = Math.ceil(currentEvent.capacity / 10);
    selectedSeats = [];
    updateSeatSummary();

    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'theater-row';
        
        const seatsInRow = Math.min(10, currentEvent.capacity - row * 10);
        for (let seat = 0; seat < seatsInRow; seat++) {
            const seatButton = document.createElement('button');
            const seatNumber = row * 10 + seat + 1;
            const rowLetter = String.fromCharCode(65 + row);
            seatButton.className = 'seat';
            seatButton.textContent = rowLetter + seatNumber;
            seatButton.addEventListener('click', () => toggleSeat(seatNumber, seatButton, rowLetter));
            rowDiv.appendChild(seatButton);
        }
        theaterLayout.appendChild(rowDiv);
    }
}

function toggleSeat(seatNumber, button, rowLetter) {
    if (button.classList.contains('occupied')) return;

    if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== rowLetter + seatNumber);
    } else {
        button.classList.add('selected');
        selectedSeats.push(rowLetter + seatNumber);
    }

    updateSeatSummary();
}

function updateSeatSummary() {
    const selectedSeatsEl = document.getElementById('selected-seats');
    const totalPriceEl = document.getElementById('total-price');

    if (selectedSeatsEl) {
        selectedSeatsEl.textContent = selectedSeats.length > 0 
            ? `Seats: ${selectedSeats.join(', ')}` 
            : 'None selected';
    }

    if (totalPriceEl && currentEvent) {
        const totalPrice = (selectedSeats.length * currentEvent.price).toFixed(2);
        totalPriceEl.textContent = totalPrice;
    }
}

const stripeButton = document.getElementById('stripe-button');
if (stripeButton) {
    stripeButton.addEventListener('click', async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        try {
            const bookingSummary = `Event: ${currentEvent.name}\nDate: ${currentEvent.date} @ ${currentEvent.time}\nSeats: ${selectedSeats.join(', ')}\nTotal: $${(selectedSeats.length * currentEvent.price).toFixed(2)}\n\nDemo mode - No actual payment processed`;
            
            alert('✅ Booking Confirmed!\n\n' + bookingSummary);
            saveBooking(currentEvent.id, selectedSeats);
            selectedSeats = [];
            document.getElementById('seat-selection-container').classList.add('hidden');
        } catch (error) {
            console.error('Payment error:', error);
            alert('An error occurred');
        }
    });
}

function saveBooking(eventId, seats) {
    const booking = {
        eventId,
        eventName: mockEvents.find(e => e.id === eventId).name,
        seats,
        timestamp: new Date().toISOString(),
        status: 'confirmed',
        total: seats.length * mockEvents.find(e => e.id === eventId).price
    };
    
    const bookings = JSON.parse(localStorage.getItem('theatre_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('theatre_bookings', JSON.stringify(bookings));
}

function initializeAdmin() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const addEventBtn = document.getElementById('add-event-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', adminLogin);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', adminLogout);
    }
    if (addEventBtn) {
        addEventBtn.addEventListener('click', addNewEvent);
    }

    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        showAdminDashboard();
    }
}

function adminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (email === 'admin@perinstheatre.com' && password === 'theatre2026') {
        localStorage.setItem('adminUser', JSON.stringify({ email, loginTime: new Date().toISOString() }));
        showAdminDashboard();
    } else {
        alert('Invalid credentials. Try:\nEmail: admin@perinstheatre.com\nPassword: theatre2026');
    }
}

function adminLogout() {
    localStorage.removeItem('adminUser');
    location.reload();
}

function showAdminDashboard() {
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const logoutBtn = document.getElementById('logout-btn');
    const adminEventsList = document.getElementById('admin-events-list');

    if (loginSection) loginSection.classList.add('hidden');
    if (adminSection) adminSection.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');

    if (adminEventsList) {
        adminEventsList.innerHTML = '';
        mockEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'bg-gray-700 p-4 rounded-lg flex justify-between items-center mb-3';
            eventDiv.innerHTML = `
                <div>
                    <h3 class="font-bold text-lg">${event.name}</h3>
                    <p class="text-gray-300">${event.date} @ ${event.time} - $${event.price} per ticket</p>
                    <p class="text-gray-400 text-sm">${event.capacity} seats | ${event.description}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editEvent(${event.id})" class="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 text-sm">Edit</button>
                    <button onclick="deleteEvent(${event.id})" class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-sm">Delete</button>
                </div>
            `;
            adminEventsList.appendChild(eventDiv);
        });
    }

    const bookings = JSON.parse(localStorage.getItem('theatre_bookings') || '[]');
    if (bookings.length > 0 && adminEventsList) {
        const bookingsSummary = document.createElement('div');
        bookingsSummary.className = 'bg-gray-700 p-4 rounded-lg mt-8';
        bookingsSummary.innerHTML = `
            <h3 class="font-bold text-lg mb-4">Recent Bookings (${bookings.length})</h3>
            ${bookings.map(b => `
                <div class="bg-gray-600 p-3 rounded mb-2">
                    <p class="font-bold">${b.eventName}</p>
                    <p class="text-gray-300 text-sm">Seats: ${b.seats.join(', ')} | Total: $${b.total.toFixed(2)}</p>
                    <p class="text-gray-400 text-xs">${new Date(b.timestamp).toLocaleString()}</p>
                </div>
            `).join('')}
        `;
        adminEventsList.parentElement.appendChild(bookingsSummary);
    }
}

function addNewEvent() {
    const name = document.getElementById('event-name').value;
    const description = document.getElementById('event-description').value;
    const date = document.getElementById('event-date').value;
    const capacity = parseInt(document.getElementById('event-capacity').value);
    const price = parseFloat(document.getElementById('ticket-price').value);

    if (!name || !date || !capacity || !price) {
        alert('Please fill in all fields');
        return;
    }

    const newEvent = {
        id: Math.max(...mockEvents.map(e => e.id), 0) + 1,
        name,
        description,
        date,
        time: '7:00 PM',
        capacity,
        price
    };

    mockEvents.push(newEvent);
    localStorage.setItem('theatre_events', JSON.stringify(mockEvents));

    alert('✅ Event added successfully!');
    
    document.getElementById('event-name').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-capacity').value = '';
    document.getElementById('ticket-price').value = '';

    showAdminDashboard();
}

function editEvent(eventId) {
    alert(`Edit event ${eventId} - Feature coming soon`);
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const index = mockEvents.findIndex(e => e.id === eventId);
        if (index > -1) {
            mockEvents.splice(index, 1);
            localStorage.setItem('theatre_events', JSON.stringify(mockEvents));
            location.reload();
        }
    }
}
