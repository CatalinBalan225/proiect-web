import express from 'express';
import {createUser, getUserById, getUsers, deleteUser, updateUser, loginUser} from "../dataAccess/userDA"
import userFilterDto from '../dataAccess/models/userFilterDto';
import jwt from 'jsonwebtoken';
import User from '../entities/Users';

let UserRouter = express.Router();
  




UserRouter.route('/User').post( async (req, res) => {
  return res.json(await createUser(req.body));
})

UserRouter.route('/User').get( async (req, res) => {  
  var queryParams = new userFilterDto(req.query) 
  return res.json(await getUsers(queryParams));
})
UserRouter.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await loginUser(email, password);
      // Generate a JWT token or any other logic after successful login
      // const token = generateToken(user);
      res.json({ user /*, token */ }); // Send back the user and token
  } catch (error) {
      if (error instanceof Error) {
          // Now TypeScript knows that error is an Error object and has a message property
          res.status(400).json({ message: error.message });
      } else {
          // Handle cases where the error is not an instance of Error (rare)
          res.status(500).json({ message: "An unknown error occurred" });
      }
  }
});


UserRouter.route('/User/:id').get( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await getUserById(id));
})

UserRouter.route('/User/:id').delete( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await deleteUser(id));
})

UserRouter.route('/User/:id').put( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await updateUser(req.body, id));
})

export default UserRouter;