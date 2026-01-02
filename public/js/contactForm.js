document.getElementById('quote-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Impede o envio padrão do formulário

  const form = e.target; // Obtém o formulário
  const loading = form.querySelector('.loading');
  const errorMessage = form.querySelector('.error-message');
  const sentMessage = form.querySelector('.sent-message');

  // Mostrar loading
  loading.style.display = 'block';
  errorMessage.style.display = 'none';
  sentMessage.style.display = 'none';

  const formData = new FormData(form); 
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    loading.style.display = 'none';

    if (result.success) {
      sentMessage.textContent = result.message;
      sentMessage.style.display = 'block';
      form.reset(); // Limpa o formulário
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