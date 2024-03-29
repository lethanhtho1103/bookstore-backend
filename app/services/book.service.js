const { ObjectId } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
  }

  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractBookData(payload) {
    const book = {
      _id: payload.maSach,
      tenSach: payload.tenSach,
      donGia: payload.donGia,
      soQuyen: payload.soQuyen,
      namXuatBan: payload.namXuatBan,
      tacGia: payload.tacGia,
      // maNxb: ObjectId.isValid(payload.maNxb)
      //   ? new ObjectId(payload.maNxb)
      //   : null,
      maNxb: payload.maNxb,
    };
    // Remove undefined fields
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      book,
      { $set: book },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByTenSach(tenSach) {
    return await this.find({
      tenSach: { $regex: new RegExp(tenSach), $options: "i" },
    });
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
