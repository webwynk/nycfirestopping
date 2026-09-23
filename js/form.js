/* ============================================
   NYC Firestopping — Form Validation & Submit
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  // Validation rules
  const validators = {
    fullName: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: (v) => /^[\d\s\-()+ ]{7,}$/.test(v.replace(/\s/g, '')),
    projectType: (v) => v !== '' && v !== null,
    service: (v) => v !== '' && v !== null,
  };

  // Validate a single field
  function validateField(field) {
    const name = field.name || field.id;
    const value = field.value;
    const validator = validators[name];

    if (!validator) return true;

    const isValid = validator(value);
    if (isValid) {
      field.classList.remove('is-error');
    } else {
      field.classList.add('is-error');
    }
    return isValid;
  }

  // Add live validation on blur
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-error')) {
        validateField(field);
      }
    });
  });

  // Form submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all required fields
    let isFormValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      // Scroll to first error
      const firstError = form.querySelector('.is-error');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // GSAP animation for button
    if (typeof gsap !== 'undefined') {
      gsap.to(submitBtn, { scale: 0.98, duration: 0.1 });
    }

    // Simulate API call
    setTimeout(() => {
      // Success
      submitBtn.textContent = '✓ Message Sent!';
      submitBtn.style.backgroundColor = '#22c55e';

      if (typeof gsap !== 'undefined') {
        gsap.to(submitBtn, { scale: 1.02, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(submitBtn, { scale: 1, duration: 0.2, delay: 0.3 });
      }

      // Reset form
      form.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.style.backgroundColor = '';
        submitBtn.disabled = false;
      }, 3000);
    }, 1500);
  });
});
