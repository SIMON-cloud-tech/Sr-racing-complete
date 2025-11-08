document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/newsletter/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      msg.textContent = result.message || 'Submission complete.';
      msg.style.color = result.success ? 'green' : 'red';
      if (result.success) form.reset();
    } catch (error) {
      msg.textContent = 'Something went wrong. Please try again.';
      msg.style.color = 'red';
    }
  });
});
