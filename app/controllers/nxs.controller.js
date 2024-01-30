const NXBService = require("../services/nxb.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.maNxb) {
    return next(new ApiError(400, "maNxb can not be empty"));
  } else if (!req.body?.tenNxb) {
    return next(new ApiError(400, "tenNxb can not be empty"));
  } else if (!req.body?.diaChi) {
    return next(new ApiError(400, "diaChi can not be empty"));
  }
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send({
      message: "Nxb created successfully",
      document: document,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred creating the Nxb"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nxbService = new NXBService(MongoDB.client);
    const { tenNxb } = req.query;
    if (tenNxb) {
      documents = await nxbService.findByTenNxb(tenNxb);
    } else {
      documents = await nxbService.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving the Nxb")
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Nxb not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving Nxb with id = ${req.params.id}`)
    );
  }
};

exports.findOneMaNxb = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const { maNxb } = req.query;
    const document = await nxbService.findByMaNxb(maNxb);
    if (!document) {
      return next(new ApiError(404, "Nxb not found"));
    }
    return res.send(document[0]);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving Nxb with id = ${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = nxbService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Nxb not found"));
    }
    return res.send({
      message: "Nxb updated successfully",
      document: document,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Could not update Nxb with id = ${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const document = await nxbService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Nxb not found"));
    }
    return res.send({ message: "Nxb was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete Nxb with id = ${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const nxbService = new NXBService(MongoDB.client);
    const deleteCount = await nxbService.deleteAll();
    return res.send({
      documents: `${deleteCount} Nxbs were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while remove all Nxbs"));
  }
};
