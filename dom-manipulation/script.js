let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do. - Steve Jobs", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity. - Albert Einstein", category: "Inspiration" }
];


function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}


function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes[randomIndex].text;
  sessionStorage.setItem('lastQuote', filteredQuotes[randomIndex].text);
}


function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
    postQuoteToServer(newQuote);
  } else {
    alert('Please enter both quote text and category.');
  }
}


function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}


function exportQuotes() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}


function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}


function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}


function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
}


function filterQuotes() {
  const filteredQuotes = getFilteredQuotes();
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filteredQuotes.length > 0) {
    quoteDisplay.innerHTML = filteredQuotes[0].text;
  } else {
    quoteDisplay.innerHTML = 'No quotes available for this category.';
  }
  localStorage.setItem('selectedCategory', document.getElementById('categoryFilter').value);
}


async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    const serverQuotesFormatted = serverQuotes.map(post => ({
      text: post.title,
      category: 'Server'
    }));
    return serverQuotesFormatted;
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
  }
}


async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    showNotification('Quote posted to server.');
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}


async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  quotes = [...new Set([...serverQuotes, ...quotes])];
  saveQuotes();
  populateCategories();
  showNotification('Quotes synced with server!');
}


function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = '';
  }, 3000);
}


document.getElementById('newQuote').addEventListener('click', showRandomQuote);


document.getElementById('exportQuotes').addEventListener('click', exportQuotes);


createAddQuoteForm();


populateCategories();


window.onload = function() {
  const lastQuote = sessionStorage.getItem('lastQuote');
  if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = lastQuote;
  }
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
    filterQuotes();
  }
  syncQuotes();
};


setInterval(syncQuotes, 60000);
