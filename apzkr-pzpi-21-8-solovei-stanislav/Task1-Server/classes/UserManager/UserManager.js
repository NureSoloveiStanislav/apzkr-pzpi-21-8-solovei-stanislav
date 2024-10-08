const bcrypt = require('bcrypt');

class UserManager {
  async login(login, password, database) {
    try {
      const query = 'SELECT * FROM user WHERE login = ?';
      const [rows] = await database.promise().query(query, [login]);

      if (rows.length === 0) {
        return null;
      }

      const user = rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const { password, ...userData } = user;

        return {id: userData.id, login: userData.login, firstName: userData.first_name, phone: userData.phone_number, isAdmin: userData.is_admin};
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error during login: ', error);
      throw error;
    }
  }

  async registerUser(login, firstName, phone, password, database) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = 'INSERT INTO user (login, first_name, phone_number, password) VALUES (?, ?, ?, ?)';
      const values = [login, firstName, phone, hashedPassword];

      database.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error inserting data into the database: ', err);
        } else {
          console.log('Data inserted successfully');
        }
      });
    } catch (e) {
      console.error('Error hashing password: ', e);
    }
  }
}

const userManager = new UserManager();
module.exports = userManager;
