export default class CurrentDTO {
    constructor(user) {
      this.name = user.user.first_name;
      this.last_name = user.user.last_name;
      this.age = user.user.age;
      this.role = user.user.role;
    }
  }
  