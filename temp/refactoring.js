// BLUEPRINTING FOR CLASS STRUCTURE -------------------------------------------------------------------------------------------------------------------------------------------------------
// Before refactoring the library I am attempting to understand class layouts better.
// ----------- THE FLOW -----------
// 1. User clicks submit.
// 2. This triggers the event listener from TodoUI and it calls a handler method passed into it.
// 3. The function called is an arrow function and thus needed no wrapping on the call.
// 4. It takes the given text pulled with the event listeners function and passed into a method call addTodo.
// 5. The text is again passed into a new object instance of TodoItem and is pushed into the todos array.
// 6. A render method is called and passes the todos array attained from another method call.
// 7. List is cleared and a new list is sequentially appended with li elements containing an text value from each of todos objects.

// - MAIN APPLICATION CLASS // "The central hub."  ----------------------------------------------------------------------------------------------------------------------------------------
// : This will start the application, create all other necessary class instances, and connect classes to enable communication.
class App {
    constructor() {
        // - Creating the other modules/class objects. -
        this.todoService = new TodoService();
        this.todoUI = new TodoUI();
    }

    init() {
        // - Uses a method from todoUI onto a method from App's object -
        this.todoUI.bindAddItem(this.handleAddItem);
        // - Initial application render. Calling a prototype method from the TodoUI Class object. -
        this.todoUI.render(this.todoService.getTodos());
    }

    // - Intance method from the App class. Auto-Binding (`this` will always refer back to created object). -
    handleAddItem = (text) => {
        // - Calling some method from the object `todoService` and passing in an argument from App's object's method. -
        this.todoService.addTodo(text);
        // - Another method, this time from todoUI. Renders a value attained from another method in todoService. - 
        this.todoUI.render(this.todoService.getTodos());
    }
}

// - SERVICE/LOGIC CLASS // "The Engine."  ------------------------------------------------------------------------------------------------------------------------------------------------
// : Manages the logic side of the application. Handles the data, knows the 'rules'. Has zero knowledge of the DOM.
class TodoService {
    todos; // - I believe I might've read online that declaring fields is good practice even when you go about defining them in the constructor. -
    constructor() {
        // - Defining an The single source of truth for the data. ()
        this.todos = [];
    }

    addTodo(text) {
        // - Creates a new object from class with given argument. -
        const newTodo = new TodoItem(text);
        // - Pushes the new object into the array. -
        this.todos.push(newTodo);
    }
    
    getTodos() {
        return this.todos;
    }
}

// - UI COMPONENT CLASS // "The hands and eyes."  -----------------------------------------------------------------------------------------------------------------------------------------
// : Responsible for a specific piece of the user interface. Renders data into HTML. Listens for user events. Notifies App class when an event occurs. -
class TodoUI {
    constructor() {
        // - Caching DOM elements. -
        this.form = document.querySelector('#todo-form');
        this.list = document.querySelector('#todo-list');
    }

    render(todos) {
        this.list.innerHTML = '';
        // - Iterates through each item in todos and places it within an li that is then appended into the HTML list. -
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            this.list.appendChild(li);
        });
    }

    // - Method used to bind an event listener. Argument passed becomes another method called with text passed in. -
    bindAddItem(handler) {
        // - Add an event listener onto the form element for submit. -
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            // - Pull a value from an element and defines it as text. -
            const text = event.target.elements.todoInput.value;
            // - Passed method is called with the recently defined text as an argument. - 
            handler(text);
        });
    }
}

// - THE MODEL CLASS // "The data's blueprint"  -------------------------------------------------------------------------------------------------------------------------------------------
// : Defines the shape of your data objects. Ensures a consistent structure for every 'todo-item'.
class TodoItem {
    constructor(text) {
        this.id = Date.now(); // Why make an unique ID in this case? I would assume for clear object separation but what is that static method? -
        this.text = text; 
        this.completed = false;
    }
}

