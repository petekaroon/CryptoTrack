/* eslint-disable max-lines-per-function */
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:8000/main-api', {
    credentials: 'include'
  })
    .then(res => {
      if (res.ok) {
        document.querySelector('#main').classList.toggle('hidden');
      } else {
        document.querySelector('#login').classList.toggle('hidden');
      }
    });

  let loginForm = document.querySelector('#login form');
  loginForm.addEventListener('submit', event => {
    event.preventDefault();

    let data = new FormData(loginForm);
    let json = convertToJson(data);

    fetch('http://localhost:8000/auth-api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: json
    })
      .then(res => {
        if (res.ok) {
          document.querySelector('#login').classList.toggle('hidden');
          document.querySelector('#main').classList.toggle('hidden');
        }
      });
  });

  let signUpButton = document.querySelector('#signup-button');
  signUpButton.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#login').classList.toggle('hidden');
    document.querySelector('#signup').classList.toggle('hidden');
  });

  let signupForm = document.querySelector('#signup form');
  signupForm.addEventListener('submit', event => {
    event.preventDefault();

    let data = new FormData(signupForm);
    let json = convertToJson(data);

    fetch('http://localhost:8000/auth-api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: json
    })
      .then(res => {
        if (res.ok) {
          document.querySelector('#signup').classList.toggle('hidden');
          document.querySelector('#main').classList.toggle('hidden');
        }
      });
  });

  let logoutButton = document.querySelector('#logout-button');
  logoutButton.addEventListener('click', event => {
    event.preventDefault();

    fetch('http://localhost:8000/auth-api/logout', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          document.querySelector('#main').classList.toggle('hidden');
          document.querySelector('#login').classList.toggle('hidden');
        }
      });
  });
});


function convertToJson(data) {
  let object = {};
  data.forEach((value, key) => {
    object[key] = value;
  });
  return JSON.stringify(object);
}