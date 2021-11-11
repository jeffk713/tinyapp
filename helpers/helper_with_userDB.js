module.exports = helperWithUserDB = userDB => {
  const isEmailOccupied = newEmail => {
    for (const userKey in userDB) {
      if (newEmail === userDB[userKey].email) {
        return true;
      }
    }
    return false;
  };

  const getUserFromEmail = email => {
    for (const userKey in userDB) {
      if (userDB[userKey].email === email) {
        return userDB[userKey];
      }
    }
    return null;
  };

  return { isEmailOccupied, getUserFromEmail };
};
