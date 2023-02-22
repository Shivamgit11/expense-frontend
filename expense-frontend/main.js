function saveToLocalStorage(event) {
  event.preventDefault();
  const amount = event.target.amount.value;
  const desc = event.target.desc.value;
  const category = event.target.category.value;

  const obj = {
    amount,
    desc,
    category,
  };

  console.log(obj, "front fronte end line 13");

  axios
    .post("http://localhost:3000/expense/expensedetails", obj)
    .then((response) => {
      shownewUserOnScreen(response.data.newExpenseDetails);
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  // localStorage.setItem(obj.email, JSON.stringify(obj));
  //shownewUserOnScreen(obj);
}

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/expense/expensedetails")
    .then((response) => {
      console.log(response);
      for (var i = 0; i < response.data.allExpense.length; i++) {
        shownewUserOnScreen(response.data.allExpense[i]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function shownewUserOnScreen(user) {
  console.log(user, "shownewuse");
  const parentNode = document.getElementById("listofusers");

  const childHtml = `<li id=${user._id}>${user.amount} -- ${user.description} -- ${user.categoru}
                                <button onclick=deleteuser('${user.id}')> DeleteUser </button>
                                <button onclick=editUserDetails('${user.amount}','${user.description}','${user.categoru}','${user.id}')>Edit User</button>
                            </li>`;
  parentNode.innerHTML = parentNode.innerHTML + childHtml;
}

//Edit User
function editUserDetails(amount, description, category, userId) {
  console.log(amount, description, category, userId)
  document.getElementById("amount").value = amount;
  document.getElementById("desc").value = description;
  document.getElementById("category").value = category;

  deleteuser(userId);
}

function deleteuser(userId) {
  axios
    .delete(
      `http://localhost:3000/expense/expensedetails/${userId}`
    )
    .then((response) => {
      removeUserFromScreen(userId);
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(userId);
  // localStorage.removeItem(emailId);
  // removeUserFromScreen(emailId);
}
function removeUserFromScreen(userId) {
  const parentNode = document.getElementById("listofusers");
  const childNodetoBeDeleted = document.getElementById(userId);

  parentNode.removeChild(childNodetoBeDeleted);
}




//

// function saveToLocalStorage(event) {
//   const amount = event.target.amount.value;
//   const desc = event.target.desc.value;
//   const category = event.target.category.value;
  
//   const obj = {
//     amount,
//     desc,
//     category,
//   };

//   console.log(obj, "front fronte end line 13");

//   axios
//   .post("http://localhost:3000/expense/expensedetails", obj)
//   .then((response) => {
//     shownewUserOnScreen(response.data.newExpenseDetails);
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// }

// window.addEventListener("DOMContentLoaded", () => {
//   axios
//     .get("http://localhost:3000/expense/expensedetails")
//     .then((response) => {
//       console.log(response);
//       for (var i = 0; i < response.data.allExpense.length; i++) {
//         shownewUserOnScreen(response.data.allExpense[i]);
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// function shownewUserOnScreen(user) {
//   const parentElem = document.getElementById("listofuser");
//   const childElem = document.createElement("li");
//   childElem.textContent = user.amount + " , " + user.description + " , " + user.categoru;
//   const deleteBtn = document.createElement("input");
//   deleteBtn.type = "Button";
//   deleteBtn.value = "Delete";
//   deleteBtn.onclick = () => {
//     axios
//       .delete(`http://localhost:3000/expense/expensedetails/${userId}`)
//       .then((response) => {
//         // removeUserFromScreen(userId);
//         console.log(response);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     // localStorage.removeItem(user.email);
//     parentElem.removeChild(childElem);
//   };

//   const editBtn = document.createElement("input");
//   editBtn.type = "Button";
//   editBtn.value = "Edit";
//   editBtn.onclick = () => {
//     axios
//       .delete(`http://localhost:3000/expense/expensedetails/${userId}`)
//       .then((response) => {
//         // removeUserFromScreen(userId);
//         console.log(response);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     // localStorage.removeItem(user.email);
//     parentElem.removeChild(childElem);
//     document.getElementById("amount").value = user.amount;
//     document.getElementById("desc").value = user.description;
//     document.getElementById("category").value = user.categoru;
//   };

//   childElem.appendChild(deleteBtn);
//   childElem.appendChild(editBtn);
//   parentElem.appendChild(childElem);
// }