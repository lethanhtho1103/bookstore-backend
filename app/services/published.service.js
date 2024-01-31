const { ObjectId } = require("mongodb");

class NxbService {
  constructor(client) {
    this.Nxb = client.db().collection("nxbs");
  }

  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractNxbData(payload) {
    const nxb = {
      _id: payload.maNxb,
      tenNxb: payload.tenNxb,
      diaChi: payload.diaChi,
    };
    // Remove undefined fields
    Object.keys(nxb).forEach(
      (key) => nxb[key] === undefined && delete nxb[key]
    );
    return nxb;
  }

  async create(payload) {
    const nxb = this.extractNxbData(payload);
    const result = await this.Nxb.findOneAndUpdate(
      nxb,
      { $set: nxb },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.Nxb.find(filter);
    return await cursor.toArray();
  }

  async findByTenNxb(tenNxb) {
    return await this.find({
      tenNxb: { $regex: new RegExp(tenNxb), $options: "i" },
    });
  }

  async findByMaNxb(maNxb) {
    return await this.find({
      maNxb: { $regex: new RegExp(maNxb), $options: "i" },
    });
  }

  async findById(id) {
    return await this.Nxb.findOne({
      // _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
      _id: id,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractNxbData(payload);
    const result = await this.Nxb.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Nxb.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Nxb.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NxbService;
