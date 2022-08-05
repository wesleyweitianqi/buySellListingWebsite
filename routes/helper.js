const queryText = (options) =>{
  queryParams = [];
  let queryString = `SELECT * FROM listings `;
  if (Object.keys(options).length > 0) {
    if (options.minimum_price) {
      queryParams.push(`${options.minimum_price}`);
      queryString += `WHERE price > $${queryParams.length} `;
    }
    if (options.maximum_price) {
      queryParams.push(`${options.maximum_price}`);
      if (!options.minimum_price) {
        queryString += `WHERE price < $${queryParams.length} `;
      } else {
        queryString += `AND price < $${queryParams.length} `;
      }
    }
    if (options.brand) {
      queryParams.push(`${options.brand}`);
      if (!options.minimum_price && !options.maximum_price) {
        queryString += `WHERE brand = $${queryParams.length} `;
      } else {
        queryString += `AND brand = $${queryParams.length} `;
      }
    }
    if (options.model) {
      queryParams.push(`%${options.model}%`);
      if (!options.minimum_price && !options.maximum_price && !options.brand) {
        queryString += `WHERE model LIKE $${queryParams.length} `;
      } else {
        queryString += `AND model LIKE $${queryParams.length} `;
      }
    }
    if (options.year) {
      queryParams.push(`${options.year}`);
      if (!options.minimum_price && !options.maximum_price && !options.brand && !options.model) {
        queryString += `WHERE year = $${queryParams.length} `;
      } else {
        queryString += `AND year = $${queryParams.length} `;
      }
    }
  }


  queryString += `
  ORDER BY price;
  `;
  return [queryString, queryParams];

}

module.exports = queryText;
