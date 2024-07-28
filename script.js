let quotes = [
    { text: "The only way to do great work is to love what you do. - Steve Jobs", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity. - Albert Einstein", category: "Inspiration" }
  ];
  
 
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = quotes[randomIndex].text;
  }
  
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('Quote added successfully!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
