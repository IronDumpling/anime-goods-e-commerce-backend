// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Validate paper input for Assignment 2
// Note: This is different from Assignment 1 as it handles authors as objects
const validatePaperInput = (paper) => {
  // TODO: Implement paper validation
  //
  // Required fields:
  // - title: non-empty string
  // - publishedIn: non-empty string
  // - year: integer > 1900
  // - authors: non-empty array of author objects
  //   where each author must have:
  //   - name: required, non-empty string
  //   - email: optional string
  //   - affiliation: optional string
  //
  // Return array of error messages, for example:
  // [
  //   "Title is required",
  //   "Published venue is required",
  //   "Valid year after 1900 is required",
  //   "At least one author is required"
  // ]
  const errors = [];

  if (!paper.title || paper.title.trim() === "") {
    errors.push("Title is required");
  } else if (typeof paper.title !== "string") {
    errors.push("Title should be string");
  }

  if (!paper.publishedIn || paper.publishedIn.trim() === "") {
    errors.push("Published venue is required");
  } else if (typeof paper.publishedIn !== "string") {
    errors.push("Published venue should be string");
  }

  if (!paper.year) {
    errors.push("Published year is required");
  } else if (!Number.isInteger(paper.year)) {
    errors.push("Year should be integer");
  } else if (paper.year <= 1900) {
    errors.push("Valid year after 1900 is required");
  }

  if (!Array.isArray(paper.authors) || paper.authors.length === 0) {
    errors.push("At least one author is required");
  } else {
    paper.authors.forEach((author) => {
      const author_error = validateAuthorInput(author);
      for (var i = 0; i < author_error.length; i++){
        if (!errors.includes(author_error[i])){
          errors.push(author_error[i]);
        }
      }
    });
  }
  return errors;
};

// Validate author input
const validateAuthorInput = (author) => {
  // TODO: Implement author validation
  //
  // Required fields:
  // - name: non-empty string
  //
  // Optional fields:
  // - email: string
  // - affiliation: string
  //
  // Return array of error messages, for example:
  // [
  //   "Name is required"
  // ]
  const errors = [];
  if (!author.name) {
    errors.push("Name is required");
  } else if (typeof author.name !== "string") {
    errors.push("Name must be a string");
  } else if (author.name.trim() === "") {
    errors.push("Name must be non-empty");
  }

  if (author.email && typeof author.email !== "string") {
    errors.push("Email must be a string");
  }

  if (author.affiliation && typeof author.affiliation !== "string") {
    errors.push("Affiliation must be a string");
  }
  return errors;
};

// Validate query parameters for papers
const validatePaperQueryParams = (req, res, next) => {
  // TODO: Implement query parameter validation for papers
  //
  // Validate:
  // - year: optional, must be integer > 1900 if provided
  //   - Parse string to integer
  //   - Update req.query.year with the parsed value
  // - publishedIn: optional, string
  //   - No parsing needed
  // - author: optional, string
  //   - No parsing needed
  // - limit: optional, must be positive integer <= 100 if provided
  //   - Parse string to integer
  //   - Default to 10 if not provided
  //   - Update req.query.limit with the parsed value
  // - offset: optional, must be non-negative integer if provided
  //   - Parse string to integer
  //   - Default to 0 if not provided
  //   - Update req.query.offset with the parsed value
  //
  // If invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // If valid, call next()
  const { year, publishedIn, author, limit, offset } = req.query;
  const validation_error = {
    "error": "Validation Error",
    "message": "Invalid query parameter format"
  }
  if (year !== undefined) {
    const convert_year = parseInt(year, 10);
    if (isNaN(convert_year) || convert_year <= 1900 || String(convert_year) !== year) {
      return res.status(400).json(validation_error);
    } else {
      req.query.year = convert_year;
    }
  }

  if (publishedIn !== undefined && typeof publishedIn !== "string") {
    return res.status(400).json(validation_error);
  }

  if (author !== undefined && typeof author !== "string") {
    return res.status(400).json(validation_error);
  }

  if (limit !== undefined) {
    const convert_limit = parseInt(limit, 10);
    if (isNaN(convert_limit) || convert_limit <= 0 || convert_limit > 100 || convert_limit !== Number(limit)) {
      return res.status(400).json(validation_error);
    }
    req.query.limit = convert_limit;
  } else {
    req.query.limit = 10;
  }

  if (offset !== undefined) {
    const convert_offset = parseInt(offset, 10);
    if (isNaN(convert_offset) || convert_offset < 0 || convert_offset !== Number(offset)) {
      return res.status(400).json(validation_error);
    }
    req.query.offset = convert_offset;
  } else {
    req.query.offset = 0;
  }

  next();
};

// Validate query parameters for authors
const validateAuthorQueryParams = (req, res, next) => {
  // TODO: Implement query parameter validation for authors
  //
  // Validate:
  // - name: optional, string
  // - affiliation: optional, string
  // - limit: optional, must be positive integer <= 100 if provided
  // - offset: optional, must be non-negative integer if provided
  //
  // If invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid query parameter format"
  // }
  //
  // If valid, call next()
  const { name, affiliation, limit, offset } = req.query;
  const validation_error = {
    "error": "Validation Error",
    "message": "Invalid query parameter format"
  }

  if (name && typeof name !== "string" || affiliation && typeof affiliation !== "string") {
    return res.status(400).json(validation_error);
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 0 || limitNum > 100) {
      return res.status(400).json(validation_error);
    }
  }

  if (offset !== undefined) {
    const offsetNum = parseInt(offset, 10);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json(validation_error);
    }
  }
  next();
};

// Validate resource ID parameter
// Used for both paper and author endpoints
const validateResourceId = (req, res, next) => {
  // TODO: Implement ID validation
  //
  // If ID is invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid ID format"
  // }
  //
  // If valid, call next()
  const { id } = req.params;
  const convert_id = Number(id);

  if (!Number.isInteger(convert_id) || convert_id < 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid ID format",
    });
  } else {
    next();
  }
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

module.exports = {
  requestLogger,
  validatePaperInput,
  validateAuthorInput,
  validatePaperQueryParams,
  validateAuthorQueryParams,
  validateResourceId,
  errorHandler,
};
