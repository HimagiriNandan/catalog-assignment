function modInverse(a, mod) {
    let m0 = mod, x0 = 0, x1 = 1;
    if (mod === 1) return 0;
    while (a > 1) {
      let q = Math.floor(a / mod);
      [a, mod] = [mod, a % mod];
      [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0 ? x1 + m0 : x1;
  }
  
  function lagrangeInterpolation(points, prime) {
    let result = 0;
    for (let i = 0; i < points.length; i++) {
      let [xi, yi] = points[i];
      let term = yi;
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        let [xj, _] = points[j];
        let num = (0 - xj + prime) % prime;
        let den = (xi - xj + prime) % prime;
        term = (term * num) % prime;
        term = (term * modInverse(den, prime)) % prime;
      }
      result = (result + term + prime) % prime;
    }
    return result;
  }
  
  function combinations(arr, k) {
    const res = [];
    const helper = (start, combo) => {
      if (combo.length === k) {
        res.push([...combo]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        combo.push(arr[i]);
        helper(i + 1, combo);
        combo.pop();
      }
    };
    helper(0, []);
    return res;
  }
  
  function parsePoints(input) {
    const result = [];
    const keys = input["keys"];
    for (const key in input) {
      if (key === "keys") continue;
      const x = parseInt(key);
      const base = parseInt(input[key].base);
      const rawValue = input[key].value;
      try {
        const y = parseInt(rawValue, base);
        if (isNaN(y)) throw "Invalid";
        result.push([x, y]);
      } catch (e) {
        console.error(`Failed to parse (${key}): ${rawValue} in base ${base}`);
      }
    }
    return {
      k: keys.k,
      points: result
    };
  }
  
  function findSecret(inputJson, prime = 9999991) {
    const { k, points } = parsePoints(inputJson);
    const combos = combinations(points, k);
    const secretMap = new Map();
    const comboMap = new Map();
  
    for (let combo of combos) {
      try {
        let secret = lagrangeInterpolation(combo, prime);
        const key = secret.toString();
        secretMap.set(key, (secretMap.get(key) || 0) + 1);
        if (!comboMap.has(key)) comboMap.set(key, []);
        comboMap.get(key).push(combo);
      } catch {}
    }
  
    let finalSecret = null;
    let maxCount = -1;
    for (let [s, count] of secretMap.entries()) {
      if (count > maxCount) {
        maxCount = count;
        finalSecret = parseInt(s);
      }
    }
  
    const validCombos = comboMap.get(finalSecret.toString()) || [];
    const usedPoints = new Set();
    for (let combo of validCombos) {
      for (let [x, y] of combo) {
        usedPoints.add(`${x},${y}`);
      }
    }
  
    const wrongValues = [];
    for (let [x, y] of points) {
      if (!usedPoints.has(`${x},${y}`)) {
        wrongValues.push([x, y]);
      }
    }
    console.log("wrong values: ");
    wrongValues.forEach(([x, y]) => console.log(`(${x}: ${y})`));
    
    console.log("final secret: ");
    console.log(finalSecret);
  
    return finalSecret;
  }
  
  const inputJson = {
    "keys": {
        "n": 10,
        "k": 7
      },
      "1": {
        "base": "6",
        "value": "13444211440455345511"
      },
      "2": {
        "base": "15",
        "value": "aed7015a346d63"
      },
      "3": {
        "base": "15",
        "value": "6aeeb69631c227c"
      },
      "4": {
        "base": "16",
        "value": "e1b5e05623d881f"
      },
      "5": {
        "base": "8",
        "value": "316034514573652620673"
      },
      "6": {
        "base": "3",
        "value": "2122212201122002221120200210011020220200"
      },
      "7": {
        "base": "3",
        "value": "20120221122211000100210021102001201112121"
      },
      "8": {
        "base": "6",
        "value": "20220554335330240002224253"
      },
      "9": {
        "base": "12",
        "value": "45153788322a1255483"
      },
      "10": {
        "base": "7",
        "value": "1101613130313526312514143"
      }
    };
  
  findSecret(inputJson);
  