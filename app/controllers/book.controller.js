const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const NxbService = require("../services/published.service");

exports.create = async (req, res, next) => {
  if (!req.body?.maSach) {
    return next(new ApiError(400, "maSach can not be empty"));
  } else if (!req.body?.tenSach) {
    return next(new ApiError(400, "tenSach can not be empty"));
  } else if (!req.body?.donGia) {
    return next(new ApiError(400, "donGia can not be empty"));
  } else if (!req.body?.soQuyen) {
    return next(new ApiError(400, "soQuyen can not be empty"));
  } else if (!req.body?.namXuatBan) {
    return next(new ApiError(400, "namXuatBan can not be empty"));
  } else if (!req.body?.maNxb) {
    return next(new ApiError(400, "MaNxb can not be empty"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    return res.send({
      message: "Book created successfully",
      document: document,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred creating the book"));
  }
};

exports.findAll = async (req, res, next) => {
  let books = [];
  try {
    const bookService = new BookService(MongoDB.client);
    const nxbService = new NxbService(MongoDB.client);

    const { tenSach } = req.query;
    if (tenSach) {
      books = await bookService.findByTenSach(tenSach);
    } else {
      books = await bookService.find({});
    }
    const results = await Promise.all(
      books.map(async (book) => {
        let nxb = await nxbService.findById(book.maNxb);
        return { ...book, nxb };
      })
    );
    return res.send(results);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving the book")
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id = ${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const document = bookService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({
      message: "Book updated successfully",
      document: document,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Could not update book with id = ${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id = ${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deleteCount = await bookService.deleteAll();
    return res.send({
      documents: `${deleteCount} books were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while remove all books"));
  }
};
