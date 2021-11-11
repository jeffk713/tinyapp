module.exports = helperWithUrlDB = urlDB => {
  const getUrlsForUser = userId => {
    const userUrl = {};
    for (const urlKey in urlDB) {
      if (urlDB[urlKey].userId === userId) {
        userUrl[urlKey] = urlDB[urlKey];
      }
    }
    return userUrl;
  };

  return { getUrlsForUser };
};
