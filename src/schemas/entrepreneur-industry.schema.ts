import mongoose from 'mongoose'
import { EntrepreneurIndustry as EntrepreneurIndustryModel } from '../models/db/entrepreneur_industry.model'

const entrepreneurIndustry = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

const EntrepreneurIndustry = mongoose.model<EntrepreneurIndustryModel>(
  'entrepreneur_industry',
  entrepreneurIndustry
)

export { EntrepreneurIndustry }
