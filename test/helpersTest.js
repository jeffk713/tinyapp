const { assert } = require('chai');
const expect = require('chai').expect;

const helper_with_userDB = require('../helpers/helper_with_userDB');

const helper_with_urlDB = require('../helpers/helper_with_urlDB');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

const testUrls = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    userId: 'aJ48lW',
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userId: '8s8dfj',
  },
  oidfwr: {
    longURL: 'https://www.yahoo.ca',
    userId: 'hke13w',
  },
};

const { getUserFromEmail, isEmailOccupied } = helper_with_userDB(testUsers);
const { getUrlsForUser } = helper_with_urlDB(testUrls);

describe('helpers with user database', () => {
  it('should return a user with valid email', () => {
    const user = getUserFromEmail('user@example.com');
    const expectedUserID = 'userRandomID';

    assert.deepEqual(user.id, expectedUserID);
  });

  it('should return null with invalid email', () => {
    const user = getUserFromEmail('invalid@example.com');

    assert.isNull(user);
  });

  it('should return true when existing email is passed', () => {
    const occupied = isEmailOccupied('user@example.com');

    assert.isTrue(occupied);
  });

  it('should return false when non-existing email is passed', () => {
    const occupied = isEmailOccupied('non-existing@example.com');

    assert.isFalse(occupied);
  });
});

describe('helpers with url database', () => {
  it('should return user urls in object with valid user ID', () => {
    const userUrls = getUrlsForUser('8s8dfj');
    const expectedUserUrls = {
      i3BoGr: {
        longURL: 'https://www.google.ca',
        userId: '8s8dfj',
      },
    };

    expect(userUrls).to.deep.equal(expectedUserUrls);
  });

  it('should return {} with invalid user ID', () => {
    const userUrls = getUrlsForUser('ZD33PP');
    const expectedUserUrls = {};

    expect(userUrls).to.deep.equal(expectedUserUrls);
  });
});
