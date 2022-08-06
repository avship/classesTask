class Worker {
  static gen_form() {
    return `
        <input placeholder="Имя" name="user_name"><br>
        <input placeholder="Отчество" name="user_patronymic"><br>
        <input placeholder="Фамилия" name="user_surname">
        `;
  }
  static gen_header() {
    return `
        <td>Имя</td><td>Отчество</td><td>Фамилия</td>
        `;
  }
  get type() {
    return this._type;
  }
  get name() {
    return this._name;
  }
  get surname() {
    return this._surname;
  }
  get patronymic() {
    return this._patronymic;
  }
  set type(str) {
    this._type = str;
  }
  set name(str) {
    this._name = str;
  }
  set patronymic(str) {
    this._patronymic = str;
  }
  set surname(str) {
    this._surname = str;
  }
  toHtml() {
    return `<td>${this._name}</td><td>${this._patronymic}</td><td>${this._surname}</td>`;
  }
}
class Driver extends Worker {
  static gen_header() {
    return Worker.gen_header() + "<td>Категория прав</td>";
  }
  static gen_form() {
    return (
      Worker.gen_form() +
      `<br><input placeholder="Категория прав" name="user_driveCat">`
    );
  }
  set driveCat(str) {
    this._driveCat = str;
  }
  get driveCat() {
    return this._driveCat;
  }
  toHtml() {
    return `<td>${this._name}</td><td>${this._patronymic}</td><td>${this._surname}</td><td>${this._driveCat}</td>`;
  }
}
class Teacher extends Worker {
  static gen_form() {
    return (
      Worker.gen_form() +
      `<br><input placeholder="Учительская категория" name="user_teacherCat">`
    );
  }
  static gen_header() {
    return Worker.gen_header() + "<td>Учиельская категория</td>";
  }
  set teacherCat(str) {
    this._teacherCat = str;
  }
  get teacherCat() {
    return this._teacherCat;
  }
  toHtml() {
    return `<td>${this._name}</td><td>${this._patronymic}</td><td>${this._surname}</td><td>${this.teacherCat}</td>`;
  }
}
class DataProcessor {
  constructor(dbName) {
    this._dbName = dbName;
    this._dbObj = [];
    this.readDb();
  }
  readDb() {
    const jsonDb = localStorage.getItem(this._dbName)
      ? JSON.parse(localStorage.getItem(this._dbName))
      : [];
    this._dbObj = [];
    console.log(jsonDb);
    for (const i in jsonDb) {
      let myObj = null;
      switch (jsonDb[i].type) {
        case "worker":
          myObj = new Worker();
          break;
        case "driver":
          myObj = new Driver();
          myObj.driveCat = jsonDb[i].driveCat;
          break;
        case "teacher":
          myObj = new Teacher();
          myObj.teacherCat = jsonDb[i].teacherCat;
          break;
      }

      if (myObj) {
        myObj.type = jsonDb[i].type;
        myObj.name = jsonDb[i].name;
        myObj.patronymic = jsonDb[i].patronymic;
        myObj.surname = jsonDb[i].surname;
        this._dbObj.push(myObj);
      }
    }
  }
  saveDb() {
    const data = [];
    for (const i in this._dbObj) {
      const tempData = {
        name: this._dbObj[i].name,
        surname: this._dbObj[i].surname,
        patronymic: this._dbObj[i].patronymic,
        type: this._dbObj[i].type,
      };
      if (this._dbObj[i].type === "driver") {
        tempData["driveCat"] = this._dbObj[i].driveCat;
      }
      if (this._dbObj[i].type === "teacher") {
        tempData["teacherCat"] = this._dbObj[i].teacherCat;
      }
      data.push(tempData);
    }
    console.log("Сохраняю: ", data.length, data);
    localStorage.setItem(this._dbName, JSON.stringify(data));
  }
  updateDB() {
    this.saveDb();
    this.readDb();
  }
  addData(btn) {
    let myObj = null;
    switch (btn.getAttribute("data-val")) {
      case "worker":
        myObj = new Worker();
        myObj.type = "worker";
        break;
      case "teacher":
        myObj = new Teacher();
        myObj.type = "teacher";
        break;
      case "driver":
        myObj = new Driver();
        myObj.type = "driver";
        break;
    }
    document.querySelectorAll("#form input").forEach((element) => {
      if (element.getAttribute("name") === "user_name") {
        myObj.name = element.value.trim();
      }
      if (element.getAttribute("name") === "user_surname") {
        myObj.surname = element.value.trim();
      }
      if (element.getAttribute("name") === "user_patronymic") {
        myObj.patronymic = element.value.trim();
      }
      if (element.getAttribute("name") === "user_driveCat") {
        myObj.driveCat = element.value.trim();
      }
      if (element.getAttribute("name") === "user_teacherCat") {
        myObj.teacherCat = element.value.trim();
      }
    });
    if (myObj) {
      console.log("В массиве ", this._dbObj.length, myObj);
      this._dbObj.push(myObj);
      this.updateDB();
      this.showBtns();
      console.log("В массиве ", this._dbObj.length);
    }
  }
  filterData(type) {
    const dbSlice = [];
    for (const i in this._dbObj) {
      if (this._dbObj[i].type === type) {
        dbSlice.push(this._dbObj[i]);
      }
    }
    return dbSlice;
  }
  showData(type) {
    console.log("afasf", type);
    let resultTable = "<table>";
    switch (type) {
      case "worker":
        resultTable += Worker.gen_header();
        break;
      case "driver":
        resultTable += Driver.gen_header();
        break;
      case "teacher":
        resultTable += Teacher.gen_header();
        break;
    }
    const dbSlice = this.filterData(type);
    for (const i in dbSlice) {
      console.log("aaaa", dbSlice[i]);
      resultTable += `<tr>${dbSlice[i].toHtml()}</tr>`;
    }
    resultTable += "</table>";
    if (dbSlice.length) {
      document.querySelector("#result").innerHTML = resultTable;
    }
  }
  getClassNames() {
    const obj = {};
    for (const i in this._dbObj) {
      console.log(this._dbObj[i].type);
      obj[this._dbObj[i].type] = 1;
    }
    const res = [];
    for (const key in obj) {
      res.push(key);
    }
    return res;
  }
  showBtns() {
    const btnBlock = document.querySelector("#buttons");
    btnBlock.innerHTML = "";

    const names = this.getClassNames();
    console.log(names);
    for (const elem of names) {
      const btn = document.createElement("button");
      btn.textContent = elem;
      btnBlock.appendChild(btn);
      btn.addEventListener("click", (e) => {
        this.showData(elem);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form");
  const dataProcessor = new DataProcessor("classDb");
  console.dir(dataProcessor);

  dataProcessor.showBtns();
  document.querySelector("#type").addEventListener("input", (e) => {
    form.innerHTML = "";
    document.querySelector("#result").innerHTML = "";
    let formHTML = "";
    switch (e.target.value) {
      case "worker":
        formHTML = Worker.gen_form();
        break;
      case "driver":
        formHTML = Driver.gen_form();
        break;
      case "teacher":
        formHTML = Teacher.gen_form();
        break;
    }
    if (e.target.value !== "Выберите профессию") {
      formHTML +=
        '<br><button id="add" data-val=' +
        e.target.value +
        ">Добавить</button>";
      form.innerHTML = formHTML;
      document.querySelector("#add").addEventListener("click", (e) => {
        dataProcessor.addData(e.target);
      });
    }
  });
});
