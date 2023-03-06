import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { validateEntrepreneurIndustry } from '../helpers/validation.helper'
import { EntrepreneurIndustry as EntrepreneurIndustryModel } from '../models/db/entrepreneur_industry.model'
import { EntrepreneurIndustry } from '../schemas/entrepreneur-industry.schema'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const industries = await EntrepreneurIndustry.find()
    return res.json(industries)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const industry = await EntrepreneurIndustry.findById(id)
    if (!industry) {
      return res.status(404).json({ message: 'industry with id not found' })
    }

    return res.json(industry)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.post('/', async (req, res) => {
  try {
    const body = req.body as EntrepreneurIndustryModel
    const { error } = validateEntrepreneurIndustry(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const existingindustry = await EntrepreneurIndustry.findOne({
      name: body.name,
    })
    if (existingindustry) {
      return res
        .status(400)
        .send({ message: 'industry with this name already found' })
    }

    const newindustry = new EntrepreneurIndustry({ name: body.name })
    await newindustry.save()
    return res.json(newindustry)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const body = req.body as EntrepreneurIndustryModel
    const { error } = validateEntrepreneurIndustry(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const industry = await EntrepreneurIndustry.findById(id)
    if (!industry) {
      return res.status(404).send({ message: 'industry with the id not found' })
    }

    industry.name = body.name
    await industry.save()

    return res.json(industry)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const industry = await EntrepreneurIndustry.findById(id)
    if (!industry) {
      return res.status(404).send({ message: 'industry with the id not found' })
    }

    await industry.delete()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as entrepreneurIndustryRouter }
