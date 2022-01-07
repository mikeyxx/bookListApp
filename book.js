// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks()

        books.forEach(book => UI.addBookToList(book))
    }

    static displayAlerts(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.textContent = message
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form)

        // Set alert time-out
        setTimeout(() => document.querySelector('.alert').remove(), 2000)
    }

    static clearListFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn btn-danger btn-sm delete">X</button></td>`

        list.appendChild(row)
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books

        if(localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static addBooks(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBooks(isbn) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks())

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', e => {
    e.preventDefault()

    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    // Validation
    if(title === '' || author === '' || isbn === '') {
        UI.displayAlerts('Please fill empty field(s)', 'danger')
    } else {
        const book = new Book(title, author, isbn)

        // Add book to list
        UI.addBookToList(book)

        // Add book to store
        Store.addBooks(book)

        // Display success message
        UI.displayAlerts('Book Added', 'success')

        // Clear list fields
        UI.clearListFields()
    }

})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', e => {
    const bookEl = e.target
    if(bookEl.classList.contains('delete')) {
        bookEl.parentElement.parentElement.remove()
    }

    Store.removeBooks(bookEl.parentElement.previousElementSibling.innerHTML)

    // Display success message
    UI.displayAlerts('Book Removed', 'success')
})
