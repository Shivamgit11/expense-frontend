function loginhandler(event) {
  console.log("inside loginhandler");
  event.preventDefault();

  const email = event.target.email.value;
  const password = event.target.password.value;

  console.log(name, password);

  let obj = {
    email,
    password,
  };

  //   axios
  //     .post("http://localhost:3000/auth/logindetails", obj)
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((err) => console.log(err));

  axios
    .post("http://localhost:3000/auth/logindetails", obj)
    .then((response) => {
      if (response.status == 200) {
        alert(response.data.message);
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        window.location.href = "../index.html";
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      document.body.innerHTML += `<div style="color:red";>${err.message}</div>`;
    });
}
