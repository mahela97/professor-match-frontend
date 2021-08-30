const Joi = require("joi");
const {loginLecturer, saveUser, updateLectureDetails} = require("../services/lecturerService");
module.exports = {
  registerUser: async (req, res) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(25).required(),
      lastName: Joi.string(),
      type: Joi.string().default("lecturer")
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(401).send({message: validation.error.message});
      return;
    }
    const data = validation.value;
    try {
      const result = await saveUser(data);
      result.password = undefined;
      res.status(201).send({success: 1, result});
    } catch (error) {
      res.status(error.code || 409).send({message: error.message});
    }

  },
  loginLecturer: async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(25).required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(401).send({message: validation.error.message});
      return;
    }
    const body = validation.value;
    try {

      const {user, token} = await loginLecturer(body);

      return res.status(200).json({
        success: 1,
        message: "login Sucess",
        token, user
      });

    } catch (error) {
      res.status(error.code || 401).send({message: error.message});
    }
  },
  editLecturer: async (req, res) => {
    const schema = Joi.object({
      type: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      aboutMe: Joi.string().required(),
      inPerson: Joi.boolean().required(),
      zoom: Joi.boolean().required(),
      education: Joi.array().items({
        level: Joi.string().allow(""), focus: Joi.string().allow(""),
        school: Joi.string().allow("")
      }),
      recruitingDepartment: Joi.array().items({
        department: Joi.string(), topics: Joi.array()
      }),
      socialMedia: Joi.array().items({platform:Joi.string().allow("")}),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.status(401).send({message: validation.error.message});
      return;
    }
    const id = req.params.id;
    const body = validation.value;
    try {
      await updateLectureDetails(id, body);
    } catch (error) {
      res.status(error.code || 401).send({message: error.message});
    }
  }
}