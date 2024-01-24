const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("belumDibaca");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("sudahDibaca");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const moveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const deleteData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const addBook = () => {
  const bookTitle = document.getElementById("judul");
  const bookAuthor = document.getElementById("penulis");
  const bookYear = document.getElementById("tahun");
  const bookHasFinished = document.getElementById("isRead");
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeBookElement = (bookObject) => {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.innerHTML = `judul : ${bookObject.title}`;

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.innerHTML = `Penulis : ${bookObject.author}`;

  const elementBookYear = document.createElement("p");
  elementBookYear.innerHTML = `Tahun : ${bookObject.year}`;

  const descContainer = document.createElement("div");
  descContainer.classList.add("item-desc");
  descContainer.append(elementBookTitle, elementBookAuthor, elementBookYear);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("item-action");

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnBtn = document.createElement("button");
    returnBtn.classList.add("kembalikan-btn");
    returnBtn.innerHTML = `<i class='bx bx-undo'></i>`;

    returnBtn.addEventListener("click", () => {
      returnBookFromFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("hapus-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(returnBtn, deleteBtn);
    container.append(actionContainer);
  } else {
    const finishBtn = document.createElement("button");
    finishBtn.classList.add("selesai-btn");
    finishBtn.innerHTML = `<i class='bx bx-check'></i>`;

    finishBtn.addEventListener("click", () => {
      addBookToFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("hapus-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(finishBtn, deleteBtn);
    container.append(actionContainer);
  }

  return container;
};

const addBookToFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const returnBookFromFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deleteBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const simpanForm = document.getElementById("form-input-data");
  simpanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });
});
