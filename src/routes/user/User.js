const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 20
    },
    // ...
    status: {
      type: Number,
      default: 1, // 0 禁用 | 1 启用
      max: 10
    },
    isDelete: {
      type: Blooen,
      default:false
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)

module.exports = User