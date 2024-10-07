const token = require("../services/jwtToken");
const bycrpt = require("../services/bycrpt");
const userModel = require("../model/user.model");

const passwordService = new bycrpt();
const tokenService = new token();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

class userController {
  createUser = async (req, res) => {
    try {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const dateOfBirth = req.body.dateOfBirth;
      const contactNumber = req.body.contactNumber;
      const gender = req.body.gender;
      const email = req.body.email;
      const password = req.body.password;
      const role = req.body.role;

      const data = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        contact_number: contactNumber,
        gender: gender,
        email: email,
        password: await passwordService.hashPassword(password),
        role: role,
      };

      const userData = await userModel.create(data);

      if (!userData)
        return res.status(403).send({ response: `somthing went wrong` });

      res.status(200).send({ response: `User created successfully` });
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  };

  updateUser = async (req, res) => {
    try {
      const userId = req.query.id;
      console.log("User ID:", userId);
      if (!userId)
        return res.status(403).send({ response: `User ID is required` });

      const {
        firstName,
        lastName,
        dateOfBirth,
        contactNumber,
        gender,
        email,
        password,
        role,
      } = req.body;

      const data = {};
      if (firstName) data.first_name = firstName;
      if (lastName) data.last_name = lastName;
      if (dateOfBirth) data.date_of_birth = dateOfBirth;
      if (contactNumber) data.contact_number = contactNumber;
      if (gender) data.gender = gender;
      if (email) data.email = email;
      if (password) data.password = password;
      if (role) data.role = role;

      const updatedUser = await userModel.findByIdAndUpdate(userId, data, {
        new: true,
      });

      if (!updatedUser)
        return res.status(404).send({ response: `User not found` });

      res.status(200).send({ response: `User updated successfully` });
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.query.id;

      if (!userId)
        return res.status(403).send({ response: `User ID is required` });

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { status: false },
        { new: true }
      );

      if (!updatedUser)
        return res.status(404).send({ response: `User details not deleted` });

      res.status(200).send({ response: `User deleted successfully` });
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  };

  listAllUsers = async (req, res) => {
    try {
      const page = req.query.page? req.query.page : 0;
      const limit = req.query.limit? req.query.limit : 10;
      const role = req.query.role;

      let pipeline = [{ $skip: page }, { $limit: limit }];

      if (role) {
        pipeline.push({ $match: { role: role } });
      }
      const totalUsers = await userModel.countDocuments(
        role ? { role: role } : {}
      );
      const data = await userModel.aggregate(pipeline);
      if (!data)
        return res
          .status(403)
          .send({ response: `Somthing went wrong fetching data` });
      let result = {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        data: data,
      };
      res.status(200).send({ response: result });
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  };

  searchUser = async (req, res) => {
    try {
        const search = req.body.search;

        if (!search)
            return res.status(403).send({ response: `Search term cannot be empty` });

        const query = {
            $or: [
                { first_name: { $regex: search, $options: "i" } },
                { last_name: { $regex: search, $options: "i" } },
                { _id: mongoose.Types.ObjectId.isValid(search) ? mongoose.Types.ObjectId(search) : null },
            ],
        };

        const searchData = await userModel.find(query).lean();

        if (searchData.length === 0)
            return res.status(200).send({ response: `No data found` });

        res.status(200).send({ response: searchData });
    } catch (error) {
        console.error(`Error in searchUser:`, error); 
        return res.status(500).send({ response: error.message }); 
    }
};

  checkToken = async(req, res) => {
    try {
      const token = req.query.token
      if(!token) return res.status(403).send({ response : `Token is required`})

      const result = jwt.decode(token, { complete: true });
      if(!result) return res.status(403).send({ response : `Invalid token`});
      res.status(200).send({ response : result.payload })
    } catch (error) {
      return res.status(500).send({ response: error });
    }
  }

  signIn = async (req, res) => {
    try {
      const userName = req.body.userName;
      const password = req.body.password;

      if (!userName || !password)
        return res
          .status(403)
          .send({ response: ` username or passeword is required` });

      const findUser = await userModel.findOne({ email: userName });
      if (!findUser)
        return res.status(403).send({ response: `User not found` });

      const checkPassword = await passwordService.checkPassword(
        password,
        findUser._id
      );
      if (!checkPassword)
        return res.status(403).send({ response: `Invalid password` });

      const tokenData = findUser;
      const token = await tokenService.generateToken(tokenData);

      res.status(200).send({ response: token });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ response: error });
    }
  };
}

module.exports = userController