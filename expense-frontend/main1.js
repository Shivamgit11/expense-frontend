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

  const token = localStorage.getItem("token");

  axios
    .post("http://localhost:3000/expense/expensedetails", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data.expense);
      shownewUserOnScreen(response.data.expense);
      // console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
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
      if (response.status === 201) {
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
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const decodedtoken = parseJwt(token);
  console.log(decodedtoken);
  console.log(decodedtoken.isPremiumUser);
  if (decodedtoken.isPremiumUser) {
    showPremiumUserMessage();
    showleaderboard();
  }
  axios
    .get("http://localhost:3000/expense/expensedetails", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      for (var i = 0; i < response.data.expenses.length; i++) {
        shownewUserOnScreen(response.data.expenses[i]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function shownewUserOnScreen(user) {
  console.log(user, "shownewuse");
  const parentNode = document.getElementById("listofusers");

  const childHTML = `<li id=${user.id}> ₹${user.amount} - ${user.description} - ${user.categoru} 
            <button onclick=editUserDetails('${user.amount}','${user.description}','${user.categoru}','${user.id}')>Edit</button>
            <button onclick=deleteUser('${user.id}')> Delete</button> </li>`;
  parentNode.innerHTML = parentNode.innerHTML + childHTML;
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
    leaderboardEle.innerHTML += "<h1>Leader Board</h1>";
    userLeaderboardArray.data.forEach((userDetails) => {
      leaderboardEle.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses} </li>`;
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
      await axios.post(
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
