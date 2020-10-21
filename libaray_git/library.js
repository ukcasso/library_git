const element = document.getElementById("bTable");
let db = [];
let temp = [];
function showHtml(i) {
  return  `
          <td>${i + 1}</td>
          <td><a href="#" id='${i}' onclick='popInfo(this.id);'>${db[i].title}</a></td>
          <td>${db[i].content}</td>
          <td>${db[i].author}</td>
          <td>${db[i].date}</td>
          `;
}

function startServer() {
  fetch("http://localhost:3000/get")
    .then((response) => response.json())
    .then((data) => {db = data; showTable();})
    .catch(err => {
      console.log('Fetch Error', err)
    })
}

function showTable() {
  for(let i = 0; i <= db.length - 1; i++) {
      element.innerHTML += showHtml(i);
  };
  for(let i = 0; i < 5 - db.length; i++) {
    element.innerHTML += `<td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          `;
  };
};

function inputEditBook() {
  if(temp.length === 0) {
    fetch("http://localhost:3000/inputBook", {
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("title").value,
        content: document.getElementById("content").value,
        author: document.getElementById("author").value,
        date: document.getElementById("date").value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => console.log(json))
    location.reload();
} else if(temp.length !== 0) {
    fetch("http://localhost:3000/edit/", {
      method: "PATCH",
      body: JSON.stringify({
        id: temp[temp.length - 1],
        title: document.getElementById("title").value,
        content: document.getElementById("content").value,
        author: document.getElementById("author").value,
        date: document.getElementById("date").value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => console.log(json))
    location.reload();
  }
}

function deleteBook(){
  fetch("http://localhost:3000/delete/" + temp[temp.length - 1], {
    method: "DELETE"
  })
  .then(response => response.json())
  .then(json => console.log(json))
  location.reload();
}

function popInfo(id) {
  document.getElementById("title").value = db[id].title;
  document.getElementById("content").value = db[id].content;
  document.getElementById("author").value = db[id].author;
  document.getElementById("date").value = db[id].date;
  temp.push(db[id].id);
};

function searchBook(data, sDate, eDate) {
  console.log(data, sDate, eDate)
  element.innerHTML = ``;
  if(!data && isNaN(sDate)) {
      location.reload();
  } else {
    for(let i = 0; i <= db.length - 1; i++) {
      let popData = (db[i].title.includes(data)) || (db[i].author.includes(data)) || (db[i].content.includes(data));
      if(!isNaN(sDate) ? popData && sDate <= new Date(db[i].date) && eDate >= new Date(db[i].date) : popData) {
        element.innerHTML += showHtml(i);
      };
    };
  };
};