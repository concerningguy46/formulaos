const Spreadsheet = require('../models/Spreadsheet');

const normalizeCellPayload = (cells = {}) => {
  return Object.entries(cells).reduce((accumulator, [cellId, cell]) => {
    if (!cellId) {
      return accumulator;
    }

    accumulator[cellId.toUpperCase()] = {
      rawValue: String(cell?.rawValue ?? ''),
      computedValue: String(cell?.computedValue ?? ''),
      dependencies: Array.isArray(cell?.dependencies)
        ? cell.dependencies.map((dependency) => String(dependency).toUpperCase())
        : [],
      dependents: Array.isArray(cell?.dependents)
        ? cell.dependents.map((dependent) => String(dependent).toUpperCase())
        : [],
      error: String(cell?.error ?? ''),
    };

    return accumulator;
  }, {});
};

const normalizeSavedFormulas = (savedFormulas = []) => {
  if (!Array.isArray(savedFormulas)) {
    return [];
  }

  return savedFormulas
    .map((formula) => ({
      name: String(formula?.name ?? '').trim().toUpperCase(),
      expression: String(
        formula?.expression ?? formula?.syntax ?? formula?.template ?? ''
      ).trim(),
      description: String(formula?.description ?? '').trim(),
    }))
    .filter((formula) => formula.name && formula.expression);
};

const serializeSpreadsheet = (spreadsheet) => {
  const plainSpreadsheet = spreadsheet.toObject({ flattenMaps: true });

  return {
    ...plainSpreadsheet,
    cells: plainSpreadsheet.cells || {},
    savedFormulas: plainSpreadsheet.savedFormulas || [],
  };
};

exports.deepSaveSpreadsheet = async (req, res, next) => {
  try {
    const { sheetId, name, cells = {}, savedFormulas = [] } = req.body;

    const payload = {
      userId: req.user._id,
      name: name || 'Untitled Spreadsheet',
      cells: normalizeCellPayload(cells),
      savedFormulas: normalizeSavedFormulas(savedFormulas),
      lastSavedAt: new Date(),
    };

    let spreadsheet;

    if (sheetId) {
      spreadsheet = await Spreadsheet.findOneAndUpdate(
        { _id: sheetId, userId: req.user._id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!spreadsheet) {
        return res.status(404).json({
          success: false,
          message: 'Spreadsheet not found',
        });
      }
    } else {
      spreadsheet = await Spreadsheet.create(payload);
    }

    return res.status(sheetId ? 200 : 201).json({
      success: true,
      data: serializeSpreadsheet(spreadsheet),
    });
  } catch (error) {
    return next(error);
  }
};

exports.getSpreadsheet = async (req, res, next) => {
  try {
    const spreadsheet = await Spreadsheet.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!spreadsheet) {
      return res.status(404).json({
        success: false,
        message: 'Spreadsheet not found',
      });
    }

    return res.json({
      success: true,
      data: serializeSpreadsheet(spreadsheet),
    });
  } catch (error) {
    return next(error);
  }
};

exports.listSpreadsheets = async (req, res, next) => {
  try {
    const spreadsheets = await Spreadsheet.find({ userId: req.user._id })
      .select('name lastSavedAt createdAt updatedAt')
      .sort({ lastSavedAt: -1 });

    return res.json({
      success: true,
      data: spreadsheets,
    });
  } catch (error) {
    return next(error);
  }
};
