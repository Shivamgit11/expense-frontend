function saveLogin(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const email = event.target.email.value;
  const password = event.target.password.value;

  const obj = {
    name,
    email,
    password,
  };

  console.log(obj);

  axios
    .post("http://localhost:3000/auth/authdetails", obj)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => console.log(err));
}
