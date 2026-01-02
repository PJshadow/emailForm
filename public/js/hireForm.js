document.getElementById('quote-form2').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const loading = form.querySelector('.loading');
  const errorMessage = form.querySelector('.error-message');
  const sentMessage = form.querySelector('.sent-message');

  loading.style.display = 'block';
  errorMessage.style.display = 'none';
  sentMessage.style.display = 'none';

  const formData = new FormData(form); // Mantém como FormData para incluir o arquivo

  try {
    const response = await fetch('/send-email-hire', {
      method: 'POST',
      body: formData // Envia como multipart/form-data automaticamente
    });

    const result = await response.json();
    loading.style.display = 'none';

    if (result.success) {
      sentMessage.textContent = result.message;
      sentMessage.style.display = 'block';
      form.reset();
    } else {
      errorMessage.textContent = result.message;
      errorMessage.style.display = 'block';
    }
  } catch (err) {
    loading.style.display = 'none';
    errorMessage.textContent = 'Error sending. Try again later.';
    errorMessage.style.display = 'block';
  }
});
