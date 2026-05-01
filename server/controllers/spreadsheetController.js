const Sheet = require('../models/Sheet')

const DEFAULT_WORKBOOK = [
  {
    name: 'Sheet1',
    color: '',
    status: 1,
    order: 0,
    celldata: [],
    row: 50,
    column: 26,
  },
]

const normalizeWorkbookData = data => {
  if (Array.isArray(data) && data.length) return data
  return DEFAULT_WORKBOOK
}

const serializeSheet = sheet => {
  if (!sheet) return null

  const plain = typeof sheet.toObject === 'function'
    ? sheet.toObject({ flattenMaps: true })
    : sheet

  return {
    ...plain,
    fileId: String(plain._id),
    fileName: plain.name,
    data: plain.data || DEFAULT_WORKBOOK,
  }
}

exports.deepSaveSpreadsheet = async (req, res, next) => {
  try {
    const { sheetId, name, data } = req.body
    const payload = {
      userId: req.user._id,
      name: String(name || 'Untitled File').trim() || 'Untitled File',
      data: normalizeWorkbookData(data),
      lastSavedAt: new Date(),
    }

    let sheet

    if (sheetId) {
      sheet = await Sheet.findOneAndUpdate(
        { _id: sheetId, userId: req.user._id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      )

      if (!sheet) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        })
      }
    } else {
      sheet = await Sheet.create(payload)
    }

    return res.status(sheetId ? 200 : 201).json({
      success: true,
      data: serializeSheet(sheet),
    })
  } catch (error) {
    return next(error)
  }
}

exports.getSpreadsheet = async (req, res, next) => {
  try {
    const sheet = await Sheet.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      })
    }

    return res.json({
      success: true,
      data: serializeSheet(sheet),
    })
  } catch (error) {
    return next(error)
  }
}

exports.listSpreadsheets = async (req, res, next) => {
  try {
    const sheets = await Sheet.find({ userId: req.user._id })
      .select('name lastSavedAt createdAt updatedAt')
      .sort({ lastSavedAt: -1 })

    return res.json({
      success: true,
      data: sheets.map(sheet => serializeSheet(sheet)),
    })
  } catch (error) {
    return next(error)
  }
}

exports.deleteSpreadsheet = async (req, res, next) => {
  try {
    const sheet = await Sheet.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      })
    }

    return res.json({
      success: true,
      message: 'File deleted',
    })
  } catch (error) {
    return next(error)
  }
}
