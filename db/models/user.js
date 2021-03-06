'use strict'

const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const db = require('APP/db')

const User = db.define('users', {
  name: Sequelize.STRING,
  role:  {
    type: Sequelize.ENUM('basic', 'admin', 'anonymous'),
    allowNull: false,
    defaultValue: 'basic'
  },
  email: {
    type: Sequelize.STRING,
    // commenting this out so that OAUTH login will work; there might be a better way to do this
    // allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  shippingAddress: Sequelize.STRING,
  billingAddress: Sequelize.STRING,
  // possibly don't need these two id's, because of the ways the oauth <-> user associations are designed
  // googleId: Sequelize.STRING,
  // facebookId: Sequelize.STRING,
  // We support oauth, so users may or may not have passwords.
  password_digest: Sequelize.STRING,
  password: Sequelize.VIRTUAL
}, {
  indexes: [{ fields: ['email'], unique: true }],
  hooks: {
    beforeCreate: setEmailAndPassword,
    beforeUpdate: setEmailAndPassword
  },
  instanceMethods: {
    authenticate (plaintext) {
      return new Promise((resolve, reject) =>
        bcrypt.compare(plaintext, this.password_digest,
          (err, result) =>
            err ? reject(err) : resolve(result))
        )
    }
  }
})

function setEmailAndPassword (user) {
  user.email = user.email && user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

  return new Promise((resolve, reject) =>
    bcrypt.hash(user.get('password'), 10, (err, hash) => {
  if (err) reject(err)
  user.set('password_digest', hash)
  resolve(user)
})
  )
}

module.exports = User
