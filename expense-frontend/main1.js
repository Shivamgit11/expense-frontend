const pagination = document.getElementById("pagination");

let lastpaginationpage = 1;
console.log(lastpaginationpage);

async function saveToLocalStorage(event) {
  event.preventDefault();
  const amount = event.target.amount.value;
  const desc = event.target.desc.value;
  const category = event.target.category.value;
  console.log("last page", lastpaginationpage);
  const obj = {
    amount,
    desc,
    category,
  };

  console.log(obj, "front fronte end line 13");

  const token = localStorage.getItem("token");

  axios
    .post("http://localhost:3000/expense/expensedetails", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data.expense);
      // shownewUserOnScreen(response.data.expense);
      // console.log(response);
      getExpenses(lastpaginationpage);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("checking this line", lastpaginationpage);

  // localStorage.setItem(obj.email, JSON.stringify(obj));
  //shownewUserOnScreen(obj);
}

//download expense
function download() {
  const token = localStorage.getItem("token");
  console.log("inside download file");
  axios
    .get("http://localhost:3000/expense/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 200) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  //second task
}

function showPremiumUserMessage() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "you are a premium user";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const objUrlParamcs = new URLSearchParams(window.location.search);
const ppage = objUrlParamcs.get("page") || 1;

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedtoken = parseJwt(token);
  console.log(token);
  console.log(decodedtoken);
  console.log(decodedtoken.isPremiumUser);
  if (decodedtoken.isPremiumUser) {
    showPremiumUserMessage();
    showleaderboard();
  }

  const objUrlParams = new URLSearchParams(window.location.search);
  const page = objUrlParams.get("page") || 1;
  console.log(page);
  axios
    .get(
      `http://localhost:3000/expense/expensedetails?page=${page}&items_per_page=5`,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      console.log(response);
      // for (var i = 0; i < response.data.expenses.length; i++) {
      // response.data.Expense.map((item) => {
      shownewUserOnScreen(response.data.Expense);
      // });

      showPagination(response.data);
      // }
    })
    .catch((error) => {
      console.log(error);
    });
});

function shownewUserOnScreen(user) {
  console.log(user, "shownewuse");

  // getExpenses(lastpaginationpage);

  const parentNode = document.getElementById("listofusers");

  // Clear existing expense entries on the screen
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }

  if (Array.isArray(user)) {
    user.forEach((user) => {
      const childHTML = `<li id=${user.id}> ₹${user.amount} - ${user.description} - ${user.categoru} 
      <button onclick=editUserDetails('${user.amount}','${user.description}','${user.categoru}','${user.id}')>Edit</button>
      <button onclick=deleteUser('${user.id}')> Delete</button> </li>`;
      parentNode.insertAdjacentHTML("beforeend", childHTML);
    });
  } else {
    const childHTML = `<li id=${user.id}> ₹${user.amount} - ${user.description} - ${user.categoru} 
    <button onclick=editUserDetails('${user.amount}','${user.description}','${user.categoru}','${user.id}')>Edit</button>
    <button onclick=deleteUser('${user.id}')> Delete</button> </li>`;
    parentNode.insertAdjacentHTML("beforeend", childHTML);
  }
}

//showleaderboard

function showleaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "buttton";
  inputElement.value = "show leaderboard";
  inputElement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userLeaderboardArray = await axios.get(
      "http://localhost:3000/premium/showLeaderboard",
      {
        headers: { Authorization: token },
      }
    );
    console.log("serleaderboard", userLeaderboardArray);
    var leaderboardEle = document.getElementById("leaderboard");

    while (leaderboardEle.firstChild) {
      leaderboardEle.removeChild(leaderboardEle.firstChild);
    }
    leaderboardEle.innerHTML += "<h1 style='color: white;'>Leader Board</h1>";
    userLeaderboardArray.data.forEach((userDetails) => {
      leaderboardEle.innerHTML += `<li style='color: white;'>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses} </li>`;
    });
  };
  document.getElementById("message").appendChild(inputElement);
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
  const token = localStorage.getItem("token");
  axios
    .delete(`http://localhost:3000/expense/expensedetails/${userId}`, {
      headers: { Authorization: token },
    })
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

document.getElementById("rzp-button1").onclick = async function (e) {
  console.log("inside premium handler");
  const token = localStorage.getItem("token");
  console.log(token);

  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    {
      headers: { Authorization: token },
    }
  );
  console.log(response);
  var options = {
    key: response.data.key_id, //Enter the key id genarae from the token
    order_id: response.data.order.id, //for one time payment
    //This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      alert("YOur are a premium user now");
      document.getElementById("rzp-button1").style.visibility = "hidden";
      document.getElementById("message").innerHTML = "you are a premium user";
      localStorage.setItem("token", res.data.token);
      console.log("utoken", res);
      showleaderboard();
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment-failed", function (response) {
    console.log(response);
    alert("Something went wrong");
  });
};

//pagination
function showPagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  lastPage,
}) {
  console.log(lastPage);
  lastpaginationpage = lastPage;
  pagination.innerHTML = "";
  if (hasPreviousPage) {
    const btn2 = document.createElement("button");
    btn2.innerHTML = previousPage;
    btn2.addEventListener("click", () => getExpenses(previousPage));
    pagination.appendChild(btn2);
  }
  const btn1 = document.createElement("button");
  btn1.innerHTML = `<h3>${currentPage}</h3>`;
  btn1.addEventListener("click", () => getExpenses(currentPage));
  pagination.appendChild(btn1);
  if (hasNextPage) {
    const btn3 = document.createElement("button");
    btn3.innerHTML = nextPage;
    btn3.addEventListener("click", () => getExpenses(nextPage));
    pagination.appendChild(btn3);
  }
}
function getExpenses(page) {
  let items_per_page = document.getElementById("limitM").value;
  console.log("pageNo", page, "item", items_per_page);

  const token = localStorage.getItem("token");
  axios
    .get(
      `http://localhost:3000/expense/expensedetails?page=${page}&items_per_page=${items_per_page}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((response) => {
      console.log(response);
      // for (var i = 0; i < response.data.expenses.length; i++) {
      // response.data.Expense.map((item) => {
      shownewUserOnScreen(response.data.Expense);
      // });

      showPagination(response.data);
      // }
    })
    .catch((error) => {
      console.log(error);
    });
}
