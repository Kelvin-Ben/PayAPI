const siteKey = window.location.hostname === 'www.getpayapi.org' ? process.env.RECAPTCHA_SITE_KEY_LIVE : process.env.RECAPTCHA_SITE_KEY;
const backendUrl = window.location.hostname === localhost ? 'http://localhost:4000/server' : 'api/verifyRecaptcha'

  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const formFields = document.querySelectorAll('.form-control');

    formFields.forEach(field => {
      const errorSpan = field.nextElementSibling;
      if (field.value.trim() === '') {
        field.classList.add('has-error');
        errorSpan.style.display = 'block';
        isValid = false;
      } else {
        field.classList.remove('has-error');
        errorSpan.style.display = 'none';
      }
    })

    if (isValid) {
      grecaptcha.ready(function() {
        grecaptcha.execute(siteKey, {action: 'submit'}).then(function(token) {
          document.getElementById('recaptchaResponse').value = token;
          
          // Gather form data
          const formData = new FormData(document.getElementById('contact-form'));

          fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              Swal.fire({
                title: 'success',
                text: data.message,
                icon: 'success',
                confirmationButton: 'OK'
              }).then(() => {
                document.getElementById('contact-form').reset();
              })
            }else {
              Swal.fire({
                title: 'Error!',
                text: data.message,
                icon: 'error',
                confirmationButton: 'Try Again'
              })
            }
          })
          .catch(error => {
            Swal.fire({
              title: 'Oops!',
              text: 'Something went wrong. Please try again later.',
              icon: 'error',
              confirmationButton: 'OK'
            })
          })
        })
      })
    }
  })
  