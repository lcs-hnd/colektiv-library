const myLibrary = [];

function Book() {

};

function addBookToLibrary() {

};

// loads first screen and transition to the library content
document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.querySelector('.intro');
    const introButton = document.querySelector('.intro-button');
    const libraryScreen = document.querySelector('.library-content');

    // assign class to first screen
    introScreen.classList.add('active-screen');

    // begins transition to the main content of the library
    introButton.addEventListener('click', () => {

        // checking trasitionends in order 
        const introButtonTransform = function(event) {
            if (event.propertyName === 'transform') {
                introButton.removeEventListener('transitionend', introButtonTransform);
                introScreen.classList.remove('active-screen');

                const introScreenFadeEnd = function(event) {
                    if(event.propertyName === 'opacity'){
                        introScreen.removeEventListener('transitionend', introScreenFadeEnd);

                        libraryScreen.classList.add('active-screen');
                        introScreen.remove();
                    }
                };
                introScreen.addEventListener('transitionend', introScreenFadeEnd);
            }
        };
        introButton.addEventListener('transitionend', introButtonTransform);
    });
});