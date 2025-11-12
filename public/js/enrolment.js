document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enrolmentForm');
  const checkbox = document.getElementById('checkbox');
  const emailContainer = document.getElementById('emailToSendContainer');
  const emailInput = document.getElementById('emailToSend');
  const msg = document.getElementById('msg');

  // Show/hide email input when checkbox is toggled
  checkbox.addEventListener('change', () => {
    emailContainer.style.display = checkbox.checked ? 'block' : 'none';
    if (!checkbox.checked) emailInput.value = '';
  });

  // Show feedback in <p id="msg">
  function showMessage(text, type = 'info') {
    msg.textContent = text;
    msg.style.color = type === 'success' ? 'green' : type === 'error' ? 'red' : '#333';
  }

  // Validate email format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (checkbox.checked && !isValidEmail(emailInput.value)) {
      return showMessage('Please enter a valid email to receive a copy.', 'error');
    }

    const formData = new FormData(form);
    const payload = {};

    for (let [key, value] of formData.entries()) {
      payload[key] = value;
    }

    payload.checkbox = checkbox.checked;

    try {
      const res = await fetch('/enrol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await res.json();
      } catch (parseErr) {
        const text = await res.text();
        console.error('❌ Failed to parse JSON:', parseErr);
        console.error('📄 Raw response:', text);
        return showMessage(`Server returned invalid response: ${text}`, 'error');
      }

      if (!res.ok) {
        console.error('❌ Server responded with error:', result);
        return showMessage(`${result.message} (${result.error || 'unknown error'})`, 'error');
      }

      console.log('✅ Server responded with success:', result);
      showMessage(result.message, 'success');
      form.reset();
      emailContainer.style.display = 'none';
    } catch (err) {
      console.error('❌ Fetch failed:', err);
      showMessage(`Network error: ${err.message}`, 'error');
    }
  });
});
