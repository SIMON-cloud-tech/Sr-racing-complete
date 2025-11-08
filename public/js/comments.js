document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('commentForm');
  const msg = document.getElementById('msg');
  const countDisplay = document.getElementById('commentCount');

  // Fetch and display the current comment count
  async function updateCommentCount() {
    try {
      const res = await fetch('/comments/count');
      const result = await res.json();
      countDisplay.textContent = `Total Comments: ${result.count}`;
    } catch {
      countDisplay.textContent = 'Total Comments: ?';
    }
  }

  // Initial count on page load
  updateCommentCount();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/comments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      msg.textContent = result.message || 'Comment submitted.';
      msg.style.color = result.success ? 'green' : 'red';

      if (result.success) {
        form.reset();
        updateCommentCount(); // Refresh count after successful submission
      }
    } catch (error) {
      msg.textContent = 'Error submitting comment.';
      msg.style.color = 'red';
    }
  });
});
