// ===
// Section 1. DEFINITIONS
// ===

const myLibrary = [];
const templateLibrary = [
    new Book("1984", "George Orwell", 328, true),
    new Book("Brave New World", "Aldous Huxley", 268, false),
    new Book("To Kill a Mockingbird", "Harper Lee", 281, true),
    new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, false),
    new Book("Moby-Dick", "Herman Melville", 635, false),
    new Book("Pride and Prejudice", "Jane Austen", 279, true)
];

Book.prototype.toggleReadStatus = function() {
    this.isRead = !this.isRead;
};

// Constructor
function Book(title, author, pages, isRead) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
};

function addBookToLibrary(library, title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    library.push(newBook);
};

function displayLibrary(library, container, onAddBook) {
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'book-collection-grid';

    library.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.bookId = book.id; 
        card.innerHTML = `
            <div class='book-container'>
                <div class='book-container-title'>${book.title}</div>
                <div class='book-container-text'>Author: ${book.author}</div>
                <div class='book-container-text'>Pages: ${book.pages}</div>
                <button class="toggle-read-btn">${book.isRead ? 'Read' : 'Not Read'}</button>
            </div>
        `;
        const toggleBtn = card.querySelector('.toggle-read-btn');

        toggleBtn.addEventListener('click', () => {
            // Call the prototype function to change the book's status
            book.toggleReadStatus();

            // Update the button's text and styling
            toggleBtn.textContent = book.isRead ? 'Read' : 'Not Read';
            toggleBtn.classList.toggle('read');
            toggleBtn.classList.toggle('not-read');
            toggleBtn.textContent = book.isRead ? 'Read' : 'Not Read';
        });

        grid.appendChild(card);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-book-btn';
    addBtn.innerHTML = '<svg class="add-book-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>';
    addBtn.addEventListener('click', onAddBook);
    grid.appendChild(addBtn);
    container.appendChild(grid);
}


function showBookForm(library, container, rerender) {
    container.innerHTML = '';
    const form = document.createElement('form');
    form.className = 'book-form';
    form.innerHTML = `
        <input name="title" placeholder="Title" required />
        <input name="author" placeholder="Author" required />
        <input name="pages" type="number" placeholder="Pages" required />
        <label>
            <input name="isRead" type="checkbox" /> Read
        </label>
        <button type="submit">Add Book</button>
    `;
    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        const data = new FormData(form);
        addBookToLibrary(
            library,
            data.get('title'),
            data.get('author'),
            data.get('pages'),
            data.get('isRead') === 'on'
        );
        rerender();
    });
    container.appendChild(form);
    setTimeout(() => form.classList.add('active-ui-element'), 10);
};

function showTemplatePage(libraryBrowser) {
    const options = document.querySelector('.library-new-options');
    const handler = function (e) {
        if (e.propertyName === 'opacity') {
            options.removeEventListener('transitionend', handler);
            libraryBrowser.innerHTML = '';
            const templatePage = document.createElement('div');
            templatePage.classList.add('template-page');

            const onAddBook = () => {
                showBookForm(templateLibrary, templatePage, () => {
                    displayLibrary(templateLibrary, templatePage, onAddBook)
                });
            };

            displayLibrary(templateLibrary, templatePage, onAddBook);
            libraryBrowser.appendChild(templatePage);
            setTimeout(() => templatePage.classList.add('active-ui-element'), 10);
        }
    };
    options.addEventListener('transitionend', handler);
    options.classList.remove('active-ui-element');
};

function showNewPage(libraryBrowser) {
    const options = document.querySelector('.library-new-options');
    const handler = function (e) {
        if (e.propertyName === 'opacity') {
            options.removeEventListener('transitionend', handler);
            libraryBrowser.innerHTML = '';
            const newPage = document.createElement('div');
            newPage.classList.add('new-page');
            displayLibrary(myLibrary, newPage, () => {
                showBookForm(myLibrary, newPage, () => displayLibrary(myLibrary, newPage, arguments.callee));
            });
            libraryBrowser.appendChild(newPage);
            setTimeout(() => newPage.classList.add('active-ui-element'), 10);
        }
    };
    options.addEventListener('transitionend', handler);
    options.classList.remove('active-ui-element');
};




// loads first screen and transition to the library content
document.addEventListener('DOMContentLoaded', () => {
    const libraryScreen = document.querySelector('.library-content');
    const libraryBrowser = document.querySelector('.library-browser');
    const libraryNewBookBtn = document.querySelector('.library-new-book-btn');
    const introScreen = document.querySelector('.intro');
    const introButton = document.querySelector('.intro-button');

    // assign class to first screen
    introScreen.classList.add('active-screen');

    // begins transition to the main content of the library
    introButton.addEventListener('click', () => {

        // checking trasitionends in order 
        const introButtonTransform = function (event) {
            if (event.propertyName === 'transform') {
                introButton.removeEventListener('transitionend', introButtonTransform);
                introScreen.classList.remove('active-screen');

                const introScreenFadeEnd = function (event) {
                    if (event.propertyName === 'opacity') {
                        introScreen.removeEventListener('transitionend', introScreenFadeEnd);

                        libraryScreen.classList.add('active-screen');
                        libraryBrowser.classList.add('active-ui-element');
                        libraryNewBookBtn.classList.add('active-ui-element');
                        introScreen.remove();
                    }
                };
                introScreen.addEventListener('transitionend', introScreenFadeEnd);
            }
        };
        introButton.addEventListener('transitionend', introButtonTransform);
    });

    libraryNewBookBtn.addEventListener('click', () => {
        const libraryNewOptions = document.createElement('div');
        libraryNewOptions.classList.add('library-new-options');

        const libraryNewOptionsBtn = document.createElement('button');
        libraryNewOptionsBtn.textContent = 'new';
        libraryNewOptionsBtn.classList.add('library-new-options-btns', 'library-new-options-btns-new');
        libraryNewOptionsBtn.addEventListener('click', () => showNewPage(libraryBrowser));

        const libraryNewOptionsBtnTemplate = document.createElement('button');
        libraryNewOptionsBtnTemplate.textContent = 'template';
        libraryNewOptionsBtnTemplate.classList.add('library-new-options-btns', 'library-new-options-btns-template');
        libraryNewOptionsBtnTemplate.addEventListener('click', () => showTemplatePage(libraryBrowser));

    

        const libraryNewOptionsBtnContainer = document.createElement('div');
        libraryNewOptionsBtnContainer.classList.add('library-new-options-btns-container');

        const libraryNewOptionsQuestion = document.createElement('div');
        libraryNewOptionsQuestion.textContent = "What'll it be?";
        libraryNewOptionsQuestion.classList.add('library-new-options-question');

        const libraryNewOptionsQuestionResponse = document.createElement('div');
        libraryNewOptionsQuestionResponse.classList.add('library-new-options-question-response');

        libraryNewOptionsBtn.addEventListener('mouseover', () => {
            libraryNewOptionsQuestionResponse.textContent = 'a fresh start please';
        });

        libraryNewOptionsBtn.addEventListener('mouseout', () => {
            libraryNewOptionsQuestionResponse.textContent = '';
        });

        libraryNewOptionsBtnTemplate.addEventListener('mouseover', () => {
            libraryNewOptionsQuestionResponse.textContent = 'just a demo run';
        });

        libraryNewOptionsBtnTemplate.addEventListener('mouseout', () => {
            libraryNewOptionsQuestionResponse.textContent = '';
        });

        libraryBrowser.appendChild(libraryNewOptions);
        libraryNewBookBtn.classList.remove('active-ui-element');

        const handleOpacityTransition = function (event) {
            if (event.propertyName === 'opacity') {
                libraryNewBookBtn.removeEventListener('transitionend', handleOpacityTransition);
                libraryNewBookBtn.remove();
                libraryNewOptions.appendChild(libraryNewOptionsQuestion);
                libraryNewOptions.appendChild(libraryNewOptionsQuestionResponse);
                libraryNewOptions.appendChild(libraryNewOptionsBtnContainer);
                libraryNewOptionsBtnContainer.appendChild(libraryNewOptionsBtn);
                libraryNewOptionsBtnContainer.appendChild(libraryNewOptionsBtnTemplate);
                libraryNewOptions.classList.add('active-ui-element');
            }
        };
        libraryNewBookBtn.addEventListener('transitionend', handleOpacityTransition);
    });

});