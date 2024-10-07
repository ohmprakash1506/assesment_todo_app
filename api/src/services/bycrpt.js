const userModel = require('../model/user.model') 
const bycrpt = require('bcrypt');
const saltRound = 10;
const mongoose = require('mongoose')

class password {
    hashPassword = async (data) => {
        try {
            
            if(!data) return console.log(`hashing value cannot be null`)
            const bycrptPassword = await bycrpt.hash(data, saltRound)
            return bycrptPassword
        } catch (error) {
            console.log(`Error:`, error);
        }
    }

    checkPassword = async(data, userId) => {
        try {
            const password = data
            const userData = await userModel.findOne({ _id: userId })
            if(!userData) return console.log(`user not found`)
                console.log(`user:`, userData);
            const hashPassword = userData.password;
            console.log(`password:`, password);
            console.log(`hashPassword:`, hashPassword);
            const response = await bycrpt.compare(password, hashPassword)
            return response
        } catch (error) {
            console.log(`Somthing went wrong: ${error}`);
        }
    }
}

module.exports = password