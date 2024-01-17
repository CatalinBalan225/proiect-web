import express from 'express';
import {createRequest, getRequestById, getRequest, deleteRequests, updateRequest} from "../dataAccess/requestDA"

import userFilterDto from '../dataAccess/models/userFilterDto';
import requestFilterDto from '../dataAccess/models/requestFilterDto';

let RequestRouter = express.Router();
  
RequestRouter.route('/Request').post( async (req, res) => {
  return res.json(await createRequest(req.body));
})

RequestRouter.route('/Request').get( async (req, res) => {  
  var queryParams = new requestFilterDto(req.query) 
  return res.json(await getRequest());
})

RequestRouter.route('/Request/:id').get( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await getRequestById(id));
})

RequestRouter.route('/Request/:id').delete( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await deleteRequests(id));
})

RequestRouter.route('/Request/:id').put( async (req, res) => {
  let id = parseInt(req.params.id) 
  return res.json(await updateRequest(req.body, id));
})

export default RequestRouter;