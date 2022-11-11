/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customersSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(customersSuccess, customers, customerSuccessAway) {
  customersSuccess = sortByScore(customersSuccess);
  customers = sortByScore(customers);

  const css = countNumbersOfCustomersEachCSHas(customersSuccess, customers, customerSuccessAway);
  
  return getCsIdWithMoreCustomers(css);
}

function sortByScore(array) {
  array.sort((a, b) => { return a.score - b.score })
  return array;
}

function countNumbersOfCustomersEachCSHas(customersSuccess, customers, customerSuccessAway) {
  let previousNumberOfCostumers = 0;
  
  return customersSuccess.reduce((cs, currentCS) => {
    if(customerSuccessAway.includes(currentCS.id)) return cs;

    const numberOfCcostumers = countNumberOfCustomers(currentCS, customers);
    const newCs = createCs(currentCS.id, currentCS.score, (numberOfCcostumers - previousNumberOfCostumers));

    previousNumberOfCostumers = numberOfCcostumers;
    return [...cs, newCs];
  }, []);
}

function getCsIdWithMoreCustomers(customersSuccess) {
  const cs = customersSuccess.reduce((previousCs, currentCs) => {
    if (currentCs.numberOfCustomers === previousCs.numberOfCustomers){
      previousCs.id = 0;
      return previousCs;
    }
    else if (previousCs.numberOfCustomers < currentCs.numberOfCustomers) {
      previousCs = currentCs;
    }
    return previousCs;
      
  }, {id: 0, numberOfCustomers: 0});

  return cs.id;
}

function countNumberOfCustomers(customerSuccess, customers) {
  return customers.reduce((count, currentCustomer) => {
    if (currentCustomer.score <= customerSuccess.score) {
      return count + 1;
    }
    return count;
  }, 0);
}

function createCs(id, score, number){
  return { id: id, score: score, numberOfCustomers: number }
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = [
    { id: 1, score: 30 }, 
    { id: 2, score: 10 }, 
    { id: 3, score: 20 }, 
    { id: 4, score: 60 },
  ];
  const customers = [
    { id: 1, score: 60 },
    { id: 2, score: 28 },
    { id: 3, score: 10 },
    { id: 4, score: 29 },
    { id: 5, score: 5 },
  ];
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});