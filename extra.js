let expenseList = document.getElementById("items");
async function addNewExpenses(e) {
  console.log("addNewExpenses");
  try {
    e.preventDefault();
    // let money = document.getElementById("money").value;
    // let description = document.getElementById("description").value;
    // let category = document.getElementById("category").value;

    const amount = e.target.amount.value;
    const desc = e.target.desc.value;
    const category = e.target.category.value;

    const expenseDetails = {
      amount,
      desc,
      category,
    };
    console.log(expenseDetails);
    const token = localStorage.getItem("token");
    const responce = await axios
      .post("http://localhost:3000/expense/expensedetails", expenseDetails, {
        headers: {
          Authorization: token,
        },
      })
      .then((responce) => {
        displayUserLog(responce.data.expense);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    document.body.innerHTML += "<h1>Login 3 html not worked</h1>";
  }
}

function showPremiumuserMessage() {
  document.getElementById("rzp").style.visibility = "hidden";
  document.getElementById("msg").innerHTML = "Your Premiumuser";
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
window.onload = async function () {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  console.log(decodedToken);

  console.log(decodedToken.ispremimuser);

  // const ispremiumuser = decodedToken.ispremiumuser;

  if (decodedToken.ispremimuser === true) {
    showPremiumuserMessage();
    showLeaderBoard();
  }
  try {
    const response = await axios.get(
      `http://localhost:3000/expense/expensedetails?page=1&items_per_page=2`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("string");
    console.log("70", response);
    // console.log(response.data.data)
    const expenses = response.data.data;
    console.log(expenses);
    for (var i = 0; i < expenses.length; i++) {
      console.log(expenses[i]);
      displayUserLog(expenses[i]);
    }
    addPagination(response);
  } catch (err) {
    console.log(err);
    alert(`404 error onLoad `);
  }
};

function displayUserLog(user) {
  const parentNode = document.getElementById("items");
  const childHTML = `<li id=${user._id}> ${user.money} - ${user.description} - ${user.category}
                              <button onclick=deleteExistingUser('${user._id}')> Delete User </button> 
                              <button onclick=editUserDetails('${user.money}','${user.description}','${user._id}')> Edit User </button>
                           </li>`;

  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

async function deleteExistingUser(userId) {
  console.log("in deleteExistingUser");
  try {
    const reqId = await axios.delete(
      `http://localhost:3000/expense/expensedetails/${userId}`
    );
    console.log(reqId);
    deleteUser(userId);
  } catch (error) {
    console.log("404 error");
  }
}

function deleteUser(userId) {
  const parentNode = document.getElementById("items");
  const elem = document.getElementById(userId);
  parentNode.removeChild(elem);
  // const parentNode = document.getElementById('expenseList');
  // const childNodeToBeDeleted = document.getElementById(id);
  // console.log(childNodeToBeDeleted)
  // if (childNodeToBeDeleted) {
  //   parentNode.removeChild(childNodeToBeDeleted);
  // }
}

function editUserDetails(money, description, user_id) {
  document.getElementById("money").value = money;
  document.getElementById("description").value = description;
  deleteExistingUser(user_id);
}
document.getElementById("rzp").onclick = async function (e) {
  console.log("rzp working");
  const token = localStorage.getItem("token");
  const responce = await axios.get(
    "http://localhost:3000/user/premiumAccount",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  var options = {
    key: responce.data.key_id,
    order_id: responce.data.order.id,
    handler: async function (responce) {
      await axios.post(
        "http://localhost:3000/user/updatePremiumAccount",
        {
          order_id: options.order_id,
          payment_id: responce.razorpay_payment_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert("Your premimuser User Now");
      document.getElementById("rzp").style.visibility = "hidden";
      document.getElementById("msg").innerHTML = "Your Premiumuser";
      showLeaderBoard();
    },
  };
  const rzp2 = new Razorpay(options);
  rzp2.open();
  e.preventDefault();
  rzp2.on("payment.faled", function (responce) {
    console.log(responce);
    alert("something went wrong!!!");
  });
};

function showLeaderBoard() {
  const input = document.createElement("input");
  input.type = "button";
  input.id = "board";
  input.value = "Show Leaderboard";
  input.onclick = async () => {
    console.log("showLeaderBoard working");
    const token = localStorage.getItem("token");
    const userLeaderBoard = await axios.get(
      "http://localhost:3000/showLeaderBoard",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(userLeaderBoard.data);
    console.log("userLeaderBoard");

    var leader_board = document.getElementById("leaderboard");
    leader_board.innerHTML += "<h1>Leader<=>Board</h1>";
    userLeaderBoard.data.forEach((userss) => {
      console.log("yup!!!!!!!!!");
      leader_board.innerHTML += `<li>Name - ${userss.name}
     Total Expense - ${userss.total_cost} </li>`;
    });
  };
  document.getElementById("msg").appendChild(input);
}

function download() {
  console.log("download buttion clickedd");
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/user/download", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        let a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log("err===download func");
    });
}
function addPagination(data) {
  let pagination = document.getElementById("pagination");
  let ulTemp = document.createElement("ul");
  console.log("210", data);
  ulTemp.setAttribute("class", "pagination d-flex justify-content-center");
  if (data.data.info.currentPage !== 1) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${1})'>1</a></li>`;
  }
  ulTemp.innerHTML += `
  <li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.currentPage})'>${data.data.info.currentPage}</a></li>`;

  if (data.data.info.hasNextPage) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.nextPage})'>Next</a></li>`;
  }

  if (
    data.data.info.lastPage !== data.data.info.currentPage &&
    data.data.info.nextPage !== data.data.info.lastPage
  ) {
    ulTemp.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick='paginationFunc(${data.data.info.lastPage})'>Last</a></li>`;
  }

  pagination.appendChild(ulTemp);
  localStorage.setItem("currentPage", data.data.info.currentPage);
}
function paginationFunc(pageNo) {
  let token = localStorage.getItem("token");
  let items_per_page = document.getElementById("limitM").value;
  console.log("pageNo", pageNo, "item", items_per_page);
  axios
    .get(
      `http://localhost:3000/expense/expensedetails?pageNo=${pageNo}&items_per_page=${items_per_page}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((data) => {
      expenseList.innerHTML = "";
      let temp = data.data.data;
      console.log("242", data);
      temp.forEach((ele) => {
        displayUserLog(ele);
      });
      document.getElementById("pagination").innerHTML = "";
      addPagination(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

document.getElementById("limitM").addEventListener("change", (e) => {
  let pageNo = localStorage.getItem("currentPage");
  let token = localStorage.getItem("token");
  axios
    .get(
      `http://localhost:3000/expense/expensedetails?pageNo=${pageNo}&items_per_page=${e.target.value}`,
      {
        headers: { Authorization: token },
      }
    )
    .then((data) => {
      expenseList.innerHTML = "";
      let temp = data.data.data;
      console.log("242", data);
      temp.forEach((ele) => {
        displayUserLog(ele);
      });
      document.getElementById("pagination").innerHTML = "";
      addPagination(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
