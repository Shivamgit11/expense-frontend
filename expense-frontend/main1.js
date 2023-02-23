async function saveToLocalStorage(event) {
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

//   const childHtml = `<li id=${user.id}>${user.amount} -- ${user.description} -- ${user.categoru}
//                                   <button onclick=deleteuser('${user.id}')> DeleteUser </button>
//                                   <button onclick=editUserDetails('${user.amount}','${user.description}','${user.categoru}','${user.id}')>Edit User</button>
//                               </li>`;
  const childHTML = `<li id=${user.id}> ₹${user.amount} - ${user.description} - ${user.categoru} 
            <button onclick=editUserDetails('${user.amount}','${user.description}','${user.categoru}','${user.id}')>Edit</button>
            <button onclick=deleteUser('${user.id}')> Delete</button> </li>`;
  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

//Edit User
function editUserDetails(amount, description, category, userId) {
  console.log(amount, description, category, userId);
  document.getElementById("amount").value = amount;
  document.getElementById("desc").value = description;
  document.getElementById("category").value = category;

  deleteUser(userId);
}

function deleteUser(userId) {
  axios
    .delete(`http://localhost:3000/expense/expensedetails/${userId}`)
    .then((response) => {
      console.log(response);
      console.log(userId);
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
  console.log(userId);
  const parentNode = document.getElementById("listofusers");
  const childNodetoBeDeleted = document.getElementById(userId);

  parentNode.removeChild(childNodetoBeDeleted);
}
