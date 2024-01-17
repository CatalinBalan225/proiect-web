import db from "../dbConfig";
import User, { UserCreationAttributes } from "../entities/Users";
import Request, { RequestCreationAttributes } from "../entities/Requests";
import RequestFilterDto from "./models/requestFilterDto";
import { Like } from "./operators";


async function getRequest() {
    return await Request.findAll({ include: ["Requests"] })
  }
  async function getRequestById(id: number) {
    return await Request.findByPk(id, { include: ["Requests"] })
  }
  async function createRequest(user: RequestCreationAttributes) {
    return await Request.create(user, { include: [{ model: User, as: "Request" }] });
  
  }

  async function getUser() {
    return await User.findAll();
  }

  
async function getRequestByUserId(Id: number) {

    try {
      return await Request.findAll({ where: { Id: Id } });
    } catch (error) {
      console.error('Error in gettingId:', error);
      throw new Error('Error fetching request by User ID');
    }
  }

  async function getUserByName(name: string) {
    try {
      
      return await User.findAll({ where: { Name: name } });
  
    } catch (error) {
      console.error('Error in request(:', error);
      throw new Error('Error fetching User by request');
    }
  };

  async function getFilteredRequests(RequestFilter: RequestFilterDto) {

    if (!RequestFilter.take)
      RequestFilter.take = 10;
  
    if (!RequestFilter.skip)
      RequestFilter.skip = 0;
  
    let whereClause: any = {};
    if (RequestFilter.status)
      whereClause.RequestId = { [Like]: `%${RequestFilter.status}%` };
  
  
    return await Request.findAndCountAll(
      {
        distinct: true,
        where: whereClause,
        limit: RequestFilter.take,
        offset: RequestFilter.skip * RequestFilter.take,
      });
  
  }
  
  async function deleteRequests(id: number) {
    let deleteElem = await Request.findByPk(id);
  
    if (!deleteElem) {
      console.log("This element does not exist, so it cannot be deleted");
      return;
    }
    return await deleteElem.destroy();
  }


  async function updateRequest(request: RequestCreationAttributes, id: number) {
    const findRequest = await getRequestById(request.Id);
  
    if (!findRequest) {
      console.log("This request does not exist");
      return;
    }
  
    const t = await db.transaction()
    try {
      await findRequest.update(request);
  
      // deleted
      const existProfessor = await User.findAll({
        where: {
          Id: request.Professor_id,
        },
      });
  
      if (existProfessor.length > 0) {
        let ProfessorIds = existProfessor.map(a => a.dataValues.Id);
        let ProffessorIdsDeleted = ProfessorIds.filter(id => !request.Users.find(add => add.Id === id)?.Id)
        if (ProffessorIdsDeleted.length > 0)
          await Request.destroy({
            where: {
              Id: ProffessorIdsDeleted,
            },
          })
      }

        // inserted 
        const insertedA = request.Users.filter(a => a.Id === 0)
        if (insertedA.length > 0)
          await User.bulkCreate(insertedA)
    
        // updated
        const updatedA = request.Users.filter(a => a.Id !== 0);
        if (updatedA.length > 0) {
          for (let item of updatedA) {
            const findA = await User.findByPk(item.Id);
            await findA?.update(item);
          }
        }
    
        await t.commit();
    
      } catch (e) {
        await t.rollback();
        throw e;
      }
    }
  
  
  
  export {
    getRequestById,
    getRequest,
    createRequest,
    getFilteredRequests,
    deleteRequests,
    getUserByName,
    getRequestByUserId,
    getUser,
  
    updateRequest
  }