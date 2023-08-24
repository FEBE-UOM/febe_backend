import mongoose from 'mongoose'
import { RoomPool } from '../models/db/room-pool.db.model'

const roomPoolSchema = new mongoose.Schema(
  {
    activeUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
  },
  {
    timestamps: true,
  }
)

roomPoolSchema.virtual('roomId').get(function () {
  return this._id.toHexString()
})

const RoomPools = mongoose.model<RoomPool>('room_pools', roomPoolSchema)
export { RoomPools }
