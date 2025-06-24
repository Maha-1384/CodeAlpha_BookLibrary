
let books = [];

// DOM elements
const addBookForm = document.getElementById('addBookForm');
const bookTitleInput = document.getElementById('bookTitle');
const bookAuthorInput = document.getElementById('bookAuthor');
const bookCategorySelect = document.getElementById('bookCategory');
const bookListDiv = document.getElementById('bookList');
const searchTermInput = document.getElementById('searchTerm');
const filterCategorySelect = document.getElementById('filterCategory');
const noBooksMessage = document.getElementById('noBooksMessage');

// Edit Modal elements
const editBookModal = document.getElementById('editBookModal');
const editBookModalCloseBtn = editBookModal.querySelector('.close-button');
const editBookForm = document.getElementById('editBookForm');
const editBookIdInput = document.getElementById('editBookId');
const editBookTitleInput = document.getElementById('editBookTitle');
const editBookAuthorInput = document.getElementById('editBookAuthor');
const editBookCategorySelect = document.getElementById('editBookCategory');

// Borrow Modal elements
const borrowModal = document.getElementById('borrowModal');
const borrowModalCloseBtn = borrowModal.querySelector('.close-button');
const borrowModalTitle = document.getElementById('borrowModalTitle');
const borrowForm = document.getElementById('borrowForm');
const borrowBookIdInput = document.getElementById('borrowBookId');
const borrowerNameInput = document.getElementById('borrowerName');
const borrowDateInput = document.getElementById('borrowDate');
const returnDateInput = document.getElementById('returnDate');
const borrowerInputGroup = document.getElementById('borrowerInputGroup');
const borrowDateInputGroup = document.getElementById('borrowDateInputGroup');
const returnDateInputGroup = document.getElementById('returnDateInputGroup');
const borrowSubmitBtn = document.getElementById('borrowSubmitBtn');

// Confirmation Modal elements
const confirmationModal = document.getElementById('confirmationModal');
const confirmationMessage = document.getElementById('confirmationMessage');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');

let onConfirmCallback = null; // Callback function for confirmation modal

// --- Utility Functions --- 

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function saveBooks() {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}

/**
 * Loads books from localStorage. If no books are found, loads sample data.
 */
function loadBooks() {
    const storedBooks = localStorage.getItem('libraryBooks');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    } else {
        // Sample Data
        books = [
            {
                id: generateUniqueId(),
                title: "1984",
                author: "George Orwell",
                category: "Fiction",
                isBorrowed: false,
                borrowedBy: "",
                borrowDate: "",
                returnDate: "",
                borrowHistory: []
            },
            {
                id: generateUniqueId(),
                title: "Cosmos",
                author: "Carl Sagan",
                category: "Science",
                isBorrowed: false,
                borrowedBy: "",
                borrowDate: "",
                returnDate: "",
                borrowHistory: []
            },
            {
                id: generateUniqueId(),
                title: "The Hitchhiker's Guide to the Galaxy",
                author: "Douglas Adams",
                category: "Fantasy",
                isBorrowed: false,
                borrowedBy: "",
                borrowDate: "",
                returnDate: "",
                borrowHistory: []
            },
            {
                id: generateUniqueId(),
                title: "Educated",
                author: "Tara Westover",
                category: "Biography",
                isBorrowed: false,
                borrowedBy: "",
                borrowDate: "",
                returnDate: "",
                borrowHistory: []
            },
            {
                id: generateUniqueId(),
                title: "Fantasy 4",
                author: "George Orwell",
                category: "Fiction",
                isBorrowed: false,
                borrowedBy: "",
                borrowDate: "",
                returnDate: "",
                borrowHistory: []
            }
        ];

        saveBooks(); // Save sample data immediately
    }
}

/**
 * Displays books in the #bookList div based on current search and filter criteria.
 */
function displayBooks() {
    bookListDiv.innerHTML = ''; // Clear existing list
    const searchTerm = searchTermInput.value.toLowerCase();
    const filterCategory = filterCategorySelect.value;

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = filterCategory === 'All' || book.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredBooks.length === 0) {
        noBooksMessage.classList.remove('hidden');
    } else {
        noBooksMessage.classList.add('hidden');
        filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col justify-between';
            bookCard.innerHTML = `
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">${book.title}</h3>
                            <p class="text-md text-gray-700 mb-1"><strong>Author:</strong> ${book.author}</p>
                            <p class="text-md text-gray-700 mb-4"><strong>Category:</strong> ${book.category}</p>
                            <p class="text-sm font-semibold mb-2 ${book.isBorrowed ? 'text-red-600' : 'text-green-600'}">
                                Status: ${book.isBorrowed ? 'Borrowed' : 'Available'}
                            </p>
                            ${book.isBorrowed ? `
                                <p class="text-sm text-gray-600">Borrowed by: ${book.borrowedBy}</p>
                                <p class="text-sm text-gray-600">On: ${book.borrowDate}</p>
                            ` : ''}
                            ${book.borrowHistory && book.borrowHistory.length > 0 ? `
                                <div class="mt-3">
                                    <h4 class="text-sm font-semibold text-gray-700">Borrow History:</h4>
                                    <ul class="list-disc list-inside text-xs text-gray-600">
                                        ${book.borrowHistory.map(history => `
                                            <li>
                                                ${history.borrower} (${history.borrowDate} - ${history.returnDate || 'Current'})
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <button data-id="${book.id}" class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-3 rounded-md transition duration-150 ease-in-out transform hover:scale-105 shadow-sm">
                                Edit
                            </button>
                            <button data-id="${book.id}" class="borrow-return-btn ${book.isBorrowed ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-green-500 hover:bg-green-600'} text-white text-sm py-2 px-3 rounded-md transition duration-150 ease-in-out transform hover:scale-105 shadow-sm">
                                ${book.isBorrowed ? 'Return' : 'Borrow'}
                            </button>
                            <button data-id="${book.id}" class="delete-btn bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-md transition duration-150 ease-in-out transform hover:scale-105 shadow-sm">
                                Delete
                            </button>
                        </div>
                    `;
            bookListDiv.appendChild(bookCard);
        });
        addEventListenersToBookCards();
    }
}

/**
 * Adds event listeners to dynamically created book card buttons.
 */
function addEventListenersToBookCards() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.onclick = (e) => openEditModal(e.target.dataset.id);
    });
    document.querySelectorAll('.borrow-return-btn').forEach(button => {
        button.onclick = (e) => openBorrowModal(e.target.dataset.id);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.onclick = (e) => showConfirmationModal(
            `Are you sure you want to delete "${books.find(b => b.id === e.target.dataset.id)?.title}"?`,
            () => deleteBook(e.target.dataset.id)
        );
    });
}

// --- Add Book Functionality ---

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newBook = {
        id: generateUniqueId(),
        title: bookTitleInput.value.trim(),
        author: bookAuthorInput.value.trim(),
        category: bookCategorySelect.value,
        isBorrowed: false,
        borrowedBy: "",
        borrowDate: "",
        returnDate: "",
        borrowHistory: [] // Initialize borrow history for new books
    };

    if (newBook.title && newBook.author) {
        books.push(newBook);
        saveBooks();
        displayBooks();
        addBookForm.reset(); // Clear the form
    } else {
        console.error("Title and Author cannot be empty."); // In a real app, show a user-friendly message
    }
});

// --- Edit Book Functionality ---

/**
 * Opens the edit book modal and populates it with book data.
 * @param {string} id The ID of the book to edit.
 */
function openEditModal(id) {
    const bookToEdit = books.find(book => book.id === id);
    if (bookToEdit) {
        editBookIdInput.value = bookToEdit.id;
        editBookTitleInput.value = bookToEdit.title;
        editBookAuthorInput.value = bookToEdit.author;
        editBookCategorySelect.value = bookToEdit.category;
        editBookModal.style.display = 'flex'; // Show modal
    }
}

// Close edit modal when clicking on 'x' or outside
editBookModalCloseBtn.onclick = () => {
    editBookModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === editBookModal) {
        editBookModal.style.display = 'none';
    }
    if (event.target === borrowModal) {
        borrowModal.style.display = 'none';
    }
    if (event.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
};

editBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = editBookIdInput.value;
    const updatedTitle = editBookTitleInput.value.trim();
    const updatedAuthor = editBookAuthorInput.value.trim();
    const updatedCategory = editBookCategorySelect.value;

    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1 && updatedTitle && updatedAuthor) {
        books[bookIndex].title = updatedTitle;
        books[bookIndex].author = updatedAuthor;
        books[bookIndex].category = updatedCategory;
        saveBooks();
        displayBooks();
        editBookModal.style.display = 'none'; // Hide modal
    } else {
        console.error("Title and Author cannot be empty during edit.");
    }
});

// --- Delete Book Functionality ---

/**
 * Deletes a book from the array and updates storage/display.
 * @param {string} id The ID of the book to delete.
 */
function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    displayBooks();
    confirmationModal.style.display = 'none'; // Hide confirmation modal after deletion
}

// --- Borrowing History Functionality ---

/**
 * Opens the borrow/return modal based on the book's current status.
 * @param {string} id The ID of the book.
 */
function openBorrowModal(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    borrowBookIdInput.value = book.id;

    if (book.isBorrowed) {
        // Book is currently borrowed, prepare for return
        borrowModalTitle.textContent = `Return Book: "${book.title}"`;
        borrowerInputGroup.style.display = 'none';
        borrowDateInputGroup.style.display = 'none';
        returnDateInputGroup.style.display = 'block';
        returnDateInput.value = new Date().toISOString().split('T')[0]; // Pre-fill with current date
        borrowSubmitBtn.textContent = 'Confirm Return';
        borrowSubmitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        borrowSubmitBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        borrowerNameInput.required = false;
        borrowDateInput.required = false;

    } else {
        // Book is available, prepare for borrowing
        borrowModalTitle.textContent = `Borrow Book: "${book.title}"`;
        borrowerInputGroup.style.display = 'block';
        borrowDateInputGroup.style.display = 'block';
        returnDateInputGroup.style.display = 'none';
        borrowerNameInput.value = '';
        borrowDateInput.value = new Date().toISOString().split('T')[0]; // Pre-fill with current date
        borrowSubmitBtn.textContent = 'Confirm Borrow';
        borrowSubmitBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        borrowSubmitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        borrowerNameInput.required = true;
        borrowDateInput.required = true;
    }
    borrowModal.style.display = 'flex';
}

// Close borrow modal when clicking on 'x'
borrowModalCloseBtn.onclick = () => {
    borrowModal.style.display = 'none';
};

borrowForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = borrowBookIdInput.value;
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        console.error("Book not found for borrowing/returning.");
        return;
    }

    const book = books[bookIndex];

    if (book.isBorrowed) {
        // Handle Return
        const returnDate = returnDateInput.value;
        if (!returnDate) {
            console.error("Return date is required.");
            return;
        }

        book.isBorrowed = false;
        book.returnDate = returnDate; // Update the book's current returnDate

        // Find the latest active borrow entry in history and update its return date
        if (book.borrowHistory && book.borrowHistory.length > 0) {
            const lastBorrowEntry = book.borrowHistory[book.borrowHistory.length - 1];
            if (!lastBorrowEntry.returnDate) { // If it's the active borrowing
                lastBorrowEntry.returnDate = returnDate;
            }
        }
        book.borrowedBy = "";
        book.borrowDate = "";

    } else {
        // Handle Borrow
        const borrowerName = borrowerNameInput.value.trim();
        const borrowDate = borrowDateInput.value;

        if (!borrowerName || !borrowDate) {
            console.error("Borrower name and borrow date are required.");
            return;
        }

        book.isBorrowed = true;
        book.borrowedBy = borrowerName;
        book.borrowDate = borrowDate;
        book.returnDate = ""; // Clear return date when borrowed

        // Add to borrow history
        if (!book.borrowHistory) {
            book.borrowHistory = [];
        }
        book.borrowHistory.push({
            borrower: borrowerName,
            borrowDate: borrowDate,
            returnDate: "" // Empty until returned
        });
    }

    saveBooks();
    displayBooks();
    borrowModal.style.display = 'none';
    borrowForm.reset(); // Reset form fields
});

// --- Confirmation Modal Functions ---
function showConfirmationModal(message, onConfirm) {
    confirmationMessage.textContent = message;
    onConfirmCallback = onConfirm;
    confirmationModal.style.display = 'flex';
}

confirmYesBtn.onclick = () => {
    if (onConfirmCallback) {
        onConfirmCallback();
    }
};

confirmNoBtn.onclick = () => {
    confirmationModal.style.display = 'none';
};


// --- Search and Filter Event Listeners ---

searchTermInput.addEventListener('input', displayBooks);
filterCategorySelect.addEventListener('change', displayBooks);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    displayBooks();
});