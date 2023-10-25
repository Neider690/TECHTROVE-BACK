const { Router } = require("express");
const { getUsers } = require("../controllers/Users/getUsers.js")
const { getUser } = require("../controllers/Users/getUserById.js")
const signUp = require("../controllers/Users/singUp.js")
const deleteUser = require("../controllers/Users/deleteUsers.js")
const restoreUser = require("../controllers/Users/restoreUser.js")
const putUser = require("../controllers/Users/putUsers.js")
const fs = require("fs-extra");


const userRouter = Router();

userRouter.get("/", async (req, res) =>{
    try {
        const users = await getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json(error.message)   
    }
})

userRouter.get("/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        
        const user = await getUser(id)
        //if(!user){
        //    res.status(404).json({error: `Usuario no encontrado con este id: ${id}`})
        //} else{
            res.status(200).json(user)
        //}

    } catch (error) {
        res.status(404).json(error.message)   
    }
})


userRouter.post("/signUp", async (req, res) => {
    try {
      console.log(req.body);
      const { clientId, name, email, photo } = req.body;
      const response = await signUp(clientId, name, email, photo);
    
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
      res.status(404).json({ error: error.message });
    }
  });

  // BORRADO LOGICO
  userRouter.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await deleteUser(id);
  
      res.status(200).json({ message: "The user has been deleted" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  });
  
  // RESTAURAR
  userRouter.put("/restore/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await restoreUser(id);
  
      res.status(200).json({ message: "The user has been restored" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  });

  //ACTULIAR USUARIO 
  // FALTA PROBAR
  userRouter.put("/update/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      const fileUrl = data.photo ?? "";
  
      const filePath = req.files ? req.files.image.tempFilePath : "";
  
      const user = await putUser(id, data, fileUrl, filePath);
  
      if (filePath) {
        await fs.unlink(filePath);
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  });
  
  userRouter.post("/respond", async (req, res) => {
    try {
      const { questionId, response } = req.body;
      await respondToQuestions(questionId, response); //FALTA LA FUNCION respondToQuestions SI HAY TIEMPO SE IMPLEMENTA
      res.status(200).json({ message: "Question successfully answered" });
    } catch (error) {
      console.error(error.message);
      res.status(404).json({ error: "Error answering the question" });
    }
  });

module.exports = userRouter;