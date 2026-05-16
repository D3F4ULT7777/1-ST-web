const movieSelect = document.getElementById('movie');
const seatsContainer = document.getElementById('seatsContainer');
const selectedMovieSpan = document.getElementById('selectedMovie');
const unitPriceSpan = document.getElementById('unitPrice');
const seatCountSpan = document.getElementById('seatCount');
const totalPriceSpan = document.getElementById('totalPrice');
const confirmBtn = document.getElementById('confirmBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');

const rows = 5;
const seatsPerRow = 10;
let selectedSeats = [];
let reservedSeats = ['1-3', '1-4', '2-5', '3-7', '3-8', '4-2'];

function createSeats() {
    seatsContainer.innerHTML = '';
    
    for (let i = 1; i <= rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';

        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = String.fromCharCode(64 + i);
        rowDiv.appendChild(rowLabel);

        for (let j = 1; j <= seatsPerRow; j++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.row = i;
            seat.dataset.seat = j;
            seat.dataset.id = `${i}-${j}`;

            if (reservedSeats.includes(seat.dataset.id)) {
                seat.classList.add('reserved');
            }

            seat.addEventListener('click', toggleSeat);
            rowDiv.appendChild(seat);
        }

        seatsContainer.appendChild(rowDiv);
    }
}

function toggleSeat(e) {
    const seat = e.target;
    
    if (seat.classList.contains('reserved')) {
        return;
    }
    const seatId = seat.dataset.id;
    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    }
    updateSummary();
}

function updateSummary() {
    const moviePrice = parseInt(movieSelect.value);
    const movieText = movieSelect.options[movieSelect.selectedIndex].text.split(' - ')[0];
    const count = selectedSeats.length;
    const total = count * moviePrice;

    selectedMovieSpan.textContent = movieText;
    unitPriceSpan.textContent = `${moviePrice} DH`;
    seatCountSpan.textContent = count;
    totalPriceSpan.textContent = `${total} DH`;

    confirmBtn.disabled = count === 0;
}

function confirmReservation() {
    if (selectedSeats.length === 0) {
        alert('Veuillez sélectionner au moins un siège !');
        return;
    }
    const movieText = movieSelect.options[movieSelect.selectedIndex].text.split(' - ')[0];
    const moviePrice = parseInt(movieSelect.value);
    
    const seatLabels = selectedSeats.map(id => {
        const [row, seat] = id.split('-');
        return `${String.fromCharCode(64 + parseInt(row))}${seat}`;
    }).join(', ');

    confirmMessage.innerHTML = `
        <strong>Film :</strong> ${movieText}<br>
        <strong>Sièges réservés :</strong> ${seatLabels}<br>
        <strong>Nombre de places :</strong> ${selectedSeats.length}<br>
        <strong>Montant total :</strong> ${moviePrice * selectedSeats.length} DH
    `;
    
    reservedSeats = [...reservedSeats, ...selectedSeats];
    confirmModal.classList.add('active');
}

function closeModal() {
    confirmModal.classList.remove('active');
    selectedSeats = [];
    createSeats();
    updateSummary();
}

movieSelect.addEventListener('change', updateSummary);
confirmBtn.addEventListener('click', confirmReservation);

createSeats();
updateSummary();