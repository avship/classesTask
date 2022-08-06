class Worker {
    static gen_form() {
        return `
        <input placeholder="Имя" name="user_name"><br>
        <input placeholder="Имя" name="user_patronymic"><br>
        <input placeholder="Имя" name="user_surname">
        `
    }
    static gen_header() {
        return `
        <td>Имя</td><td>Отчество</td><td>Фамилия</td>
        `
    }
    set name(str) {
        this._name = str
    }
    set patronymic(str) {
        this._patronymic = str
    }
    set surname(str) {
        this._surname = str
    }
    get resultString() {
        return `<td>${this._name}</td><td>${this._patronymic}</td><td>${this._surname}</td>`
    }
}
class Driver extends Worker {
    static gen_header() {
        return Worker.gen_header() + "<td>Категория прав</td>"
    }
    static gen_form() {
        return Worker.gen_form() + `<input placeholder="Категория прав" name="user_licence">`
    }
    set driveCat(str) {
        if(str.match(/^[^ABCD]$/)) {
            return
        }
        this._driveLicence = str
    }
    get resultString() {
        return `<td>${this._name}</td><td>${this._patronymic}</td><td>${this._surname}</td><td>${this._driveLicence}</td>`
    }
}
class Teacher extends Worker {
    static gen_form() {
        return Worker.gen_form() + `<input placeholder="Учительская категория" name="user_category">`
    }
    static gen_header() {
        return Worker.gen_header() + "<td>Учиельская категория</td>"
    }
    set teacherCat(str) {
        if(str!== 'первая' && str!== 'высшая' && str!== 'молодой специалист') {
            return
        }
        this._teacherCat = str
    }
    get resultString() {
        return `<td>${this._name}</td><td>${this._patronymic}</td><td>${this._surname}</td><td>${this._teacherCat}</td>`
    }
}

const worker = new Worker()

console.log(Worker.gen_form());
console.log(Driver.gen_form());
console.log(Teacher.gen_form());
