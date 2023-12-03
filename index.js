const api =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
let current_page = 1;
let checkedBoxes = [];
let counts = 0;
// document.querySelector(".counter").innerHTML = `${counts} rows are selected`;

// add data
function displayMembers(members) {
  const table = document.querySelector(".table");
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    // console.log(member.name.split(" "));
    const div = document.createElement("div");
    div.className = `row row_${member.id}`;
    div.innerHTML = `
    <p>
    <input class="check" type="checkbox">
    </p>
        <p>    
        <input class='name_${member.id}' type="text" value='${member.name}' readonly>
        </p>
        <p>    
            <input class='email_${member.id}' type="text" value='${member.email}' readonly>
        </p>
        <p>    
            <input class='role_${member.id}'  type="text" value='${member.role}' readonly>
        </p>
        <p class='actions' >
          <span class="material-symbols-outlined edit edit_${member.id}"> edit_note </span>
          <span class="save save_${member.id} active"> save </span>
          <span class="material-symbols-outlined delete delete_${member.id}">delete</span>
        </p>
    `;
    table.appendChild(div);
  }
}

// divide data into pages
function paginationIndices(data) {
  let pages = Math.ceil(data.length / 10);
  const pageIndex = document.querySelector(".page-indices");
  pageIndex.innerHTML = `
   <div class="prev" >prev</div>
  `;
  for (let i = 1; i <= pages; i++) {
    const div = document.createElement("div");
    div.className = `page page_${i}`;
    div.innerHTML = `${i}`;
    if (i === current_page) {
      div.style.backgroundColor = "cyan";
    }
    pageIndex.appendChild(div);
  }
  const div = document.createElement("div");
  div.className = "next";
  div.innerHTML = `next`;
  pageIndex.appendChild(div);
}

//show pages
function paginate(data, pageNumber = 1) {
  console.log(typeof data);
  const page = document.querySelector(`.page_${pageNumber}`);
  if (page) {
    page.style.backgroundColor = "cyan";
  }
  if (data) {
    const newData = data.slice(
      10 * (pageNumber - 1),
      Math.min(data.length, 10 * pageNumber)
    );
    displayMembers(newData);
  }
}

function handleChange(data, currentPage = 1) {
  const table = document.querySelector(".table");
  table.innerHTML = `
    <div class="row labels">
    <p>
        <input type="checkbox" class='all-check check' />
    </p>
    <p>Name</p>
    <p>Email</p>
    <p>Role</p>
    <p>Actions</p>
    </div>
    `;
  const pages = document.querySelectorAll(".page");
  for (const page of pages) {
    console.log(page);
    if (
      page.style.backgroundColor === "cyan" &&
      !page.classList.contains(`page_${current_page}`)
    ) {
      // console.log(page, currentPage);
      console.log("this page", page);
      console.log("current page", current_page);
      page.style.backgroundColor = "";
    }
  }
  console.log(currentPage);
  paginate(data, currentPage);
  handleEdits(data);
  handleDelete(data);
  handleMultipleDelete(data);
  handleCheckboxes(data);
  // search(data);
}

function handlePageIndices(data) {
  const pages = document.querySelectorAll(".page");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  for (let page of pages) {
    page.addEventListener("click", () => {
      const newPage = Number(page.classList[1].substring(5));
      if (current_page !== newPage) {
        console.log(page);
        current_page = newPage;
        handleChange(data, current_page);
      } else {
        console.log(page);
      }
    });
  }

  prev.addEventListener("click", () => {
    if (current_page > 1) {
      current_page--;
      handleChange(data, current_page);
    }
  });

  next.addEventListener("click", () => {
    if (current_page < pages.length) {
      current_page++;
      handleChange(data, current_page);
    }
  });
}

function search(data) {
  const searchbar = document.querySelector(".search-bar input");
  console.log(searchbar);
  searchbar.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target.value === "") {
      paginationIndices(data);
      handleChange(data, current_page);
      handlePageIndices(data);
    } else if (e.key === "Enter") {
      e.preventDefault();
      console.log(e.target.value);
      const newData = data.filter((row) => {
        return (
          row.name.includes(e.target.value) ||
          row.email.includes(e.target.value) ||
          row.role.includes(e.target.value)
        );
      });
      if (newData !== data) {
        // console.log(newData);
        // console.log(typeof newData);
        current_page = 1;
        handleChange(newData, current_page);
        paginationIndices(newData);
        handlePageIndices(newData);
      }
    }
  });
}

function handleDelete(data) {
  const deletes_el = document.querySelectorAll(".delete");
  for (let deleted of deletes_el) {
    deleted.addEventListener("click", (e) => {
      e.preventDefault();
      const employee_id = e.target.classList[2].substring(7);
      console.log(employee_id);
      checkedBoxes.push(employee_id);
      const newData = data.filter((row) => row.id !== employee_id);
      if (newData !== data) {
        handleChange(newData, current_page);
        paginationIndices(newData);
        handlePageIndices(newData);
      }
    });
  }
}

function handleMultipleDelete(data) {
  const deleteAll = document.querySelector(".delete_all");
  deleteAll.addEventListener("click", (e) => {
    console.log(checkedBoxes);
    const newData = data.filter((row) => !checkedBoxes.includes(row.id));

    console.log(newData);
    if (data !== newData) {
      counts = 0;
      paginationIndices(newData);
      handleChange(newData, current_page);
      handlePageIndices(newData);
    }
  });
}

function handleCheckboxes(data) {
  let checkboxes = document.querySelectorAll(".check");
  checkboxes[0].addEventListener("change", (event) => {
    if (event.target.checked) {
      for (let i = 1; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == false) {
          checkboxes[i].checked = true;
          checkboxes[i].parentElement.parentElement.style.backgroundColor =
            "rgb(137, 132, 132)";
          checkboxes[i].parentElement.parentElement.style.color = "white";
          checkboxes[i].parentElement.parentElement.querySelector(
            ".delete"
          ).style.color = "white";
          checkboxes[i].parentElement.parentElement.querySelector(
            ".edit"
          ).style.color = "white";
          const id =
            checkboxes[i].parentElement.parentElement.classList[1].substring(4);
          checkedBoxes.push(id);
          counts++;
        }
      }
      document.querySelector(
        ".counter"
      ).innerHTML = `${counts} rows are selected from ${data.length} rows`;
    } else {
      for (let i = 1; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true) {
          const id = checkboxes[i].parentElement.parentElement.classList[1];
          checkboxes[i].parentElement.parentElement.style.backgroundColor = "";
          checkboxes[i].parentElement.parentElement.style.color = "black";
          checkboxes[i].parentElement.parentElement.querySelector(
            ".delete"
          ).style.color = "gray";
          checkboxes[i].parentElement.parentElement.querySelector(
            ".edit"
          ).style.color = "gray";

          counts--;
          checkboxes[i].checked = false;
          checkedBoxes.splice(checkedBoxes.indexOf(id), 1);
        }
      }
      // console.log(checkedBoxes);
      document.querySelector(
        ".counter"
      ).innerHTML = `${counts} rows are selected from ${data.length} rows`;
    }
  });
  for (let i = 1; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", (event) => {
      if (event.target.checked) {
        counts++;
        checkboxes[i].parentElement.parentElement.style.backgroundColor =
          "rgb(137, 132, 132)";
        checkboxes[i].parentElement.parentElement.style.color = "white";
        checkboxes[i].parentElement.parentElement.querySelector(
          ".delete"
        ).style.color = "white";
        checkboxes[i].parentElement.parentElement.querySelector(
          ".edit"
        ).style.color = "white";
        const id =
          event.target.parentElement.parentElement.classList[1].substring(4);
        checkedBoxes.push(id);
        document.querySelector(
          ".counter"
        ).innerHTML = `${counts} rows are selected from ${data.length} rows`;
      } else {
        counts--;
        const id =
          event.target.parentElement.parentElement.classList[1].substring(4);

        // console.log(id)
        checkboxes[i].parentElement.parentElement.style.backgroundColor = "";
        checkboxes[i].parentElement.parentElement.style.color = "black";
        checkboxes[i].parentElement.parentElement.querySelector(
          ".delete"
        ).style.color = "gray";
        checkboxes[i].parentElement.parentElement.querySelector(
          ".edit"
        ).style.color = "gray";

        if (checkedBoxes.includes(id)) {
          checkedBoxes = checkedBoxes.filter((x) => x !== id);
        }
        document.querySelector(
          ".counter"
        ).innerHTML = `${counts} rows are selected from ${data.length} rows`;
        // console.log(checkedBoxes);
      }
    });
  }
  // console.log()
  document.querySelector(
    ".counter"
  ).innerHTML = `${counts} rows are selected from ${data.length} rows`;
}

function handleEdits(data) {
  const editBtn = document.querySelectorAll(".edit");
  editBtn.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = e.target.parentElement.parentElement;
      const inputChildren = parent.querySelectorAll(
        `.${parent.classList[1]} input[type='text']`
      );
      for (let child of inputChildren) {
        child.readOnly = false;
      }
      const id = e.target.classList[2].substring(5);
      // console.log(e.target);
      e.target.innerHTML = "";
      save_btn = document.querySelector(`.save_${id}`);
      save_btn.innerHTML = `Save`;
      save_btn.classList.remove("active");
      save_btn.addEventListener("click", (evt) => {
        evt.preventDefault();
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          const name = document.querySelector(`.name_${id}`).value;
          const email = document.querySelector(`.email_${id}`).value;
          const role = document.querySelector(`.role_${id}`).value;
          const newMember = {
            id: id,
            name: name,
            email: email,
            role: role,
          };
          // console.log("new member:", newMember);
          // console.log(data[i]);
          console.log(typeof data);
          if (data[i].id === id) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id === id) {
                data[i] = newMember;
                console.log(data);
              }
            }
            break;
          }
        }
        for (let child of inputChildren) {
          child.readOnly = true;
        }
        save_btn.classList.add("active");
        e.target.innerHTML = "edit_note";
        // console.log(e.target);
      });
    })
  );
}

console.log(current_page);

async function fetchData() {
  const response = await fetch(api);
  let data = await response.json();
  members = data;
  paginationIndices(data);
  paginate(data, current_page);
  handlePageIndices(data);
  search(data);
  handleDelete(data);
  handleCheckboxes(data);
  handleMultipleDelete(data);
  handleEdits(data);
}

fetchData();
