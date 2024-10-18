
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
      clear(formFields);
    })
    if (isValid) {
      grecaptcha.ready(function() {
        grecaptcha.execute('6LerEGEqAAAAAJMgtSACnu4SmDCR1QuA14GAPzbh', {action: 'submit'}).then(function(token) {
          document.getElementById('recaptchaResponse').value = token;
          
          // Gather form data
          // const formData = new FormData(document.getElementById('contact-form'));
          const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            title: document.getElementById('title').value,
            message: document.getElementById('message').value,
            recaptchaResponse: token
          }

          fetch('/api/verifyRecaptcha.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
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
  