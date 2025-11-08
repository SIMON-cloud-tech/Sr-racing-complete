document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        msg.textContent = result.message || 'Message sent successfully.';
        msg.style.color = 'green';
        form.reset();
      } else {
        msg.textContent = 'Validation failed. Please check your inputs.';
        msg.style.color = 'red';
        console.warn('Validation errors:', result.errors);
      }
    } catch (err) {
      msg.textContent = 'Error sending message.';
      msg.style.color = 'red';
      console.error('Fetch error:', err);
    }
  });
});
