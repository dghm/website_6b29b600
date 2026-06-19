"use strict";

// ============================================================
// DGHM Contact Form — Submit Handler
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const form     = document.querySelector('.cta-form');
  const btn      = form?.querySelector('.btn-submit');
  if (!form || !btn) return;

  form.addEventListener('submit', handleSubmit);

  // 讓 <button> 觸發 submit 事件（目前是純 button，補上 type）
  btn.setAttribute('type', 'submit');

  async function handleSubmit(e) {
    e.preventDefault();

    const name      = form.querySelector('input[name="name"]')?.value.trim()      ?? '';
    const company   = form.querySelector('input[name="company"]')?.value.trim()   ?? '';
    const email     = form.querySelector('input[name="email"]')?.value.trim()     ?? '';
    const challenge = form.querySelector('textarea[name="challenge"]')?.value.trim() ?? '';

    // 基本前端驗證
    if (!name || !email) {
      showMessage('Please fill in your name and email.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/form-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name, company, email, challenge }),
      });

      const data = await res.json();

      if (data.success) {
        showSuccess();
      } else {
        showMessage(data.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showMessage('Network error. Please email us directly at help@dghm.tw', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── UI helpers ──

  function setLoading(loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Sending…' : 'Submit Request';
  }

  function showSuccess() {
    form.innerHTML = `
      <div class="form-success">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="23" stroke="#E5622A" stroke-width="2"/>
          <path d="M14 24.5l7 7 13-14" stroke="#E5622A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>Request received.</h3>
        <p>We'll be in touch at your email within 1–2 business days.</p>
      </div>
    `;
  }

  function showMessage(msg, type) {
    let el = form.querySelector('.form-msg');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-msg';
      btn.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
    el.dataset.type = type; // 'error' | 'success'
  }

});
