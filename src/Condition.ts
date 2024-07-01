import { deepEqual } from "node:assert";
import { inspect } from "./Helpers";

function deepEqualTry(actual: unknown, expected: unknown) {
  try {
    deepEqual(actual, expected);
    return true;
  } catch {
    return false;
  }
}

class ConditionChecker {
  static hasOperator(msg: string, operator: string) {
    return msg.includes(operator);
  }

  static solveComparison(part: string, operator: string): boolean {
    const parts = part.split(operator);
    let pass = true;

    if (operator === "==") {
      pass = deepEqualTry(parts[0].trim(), parts[1].trim());
    } else if (operator === "!=") {
      pass = !deepEqualTry(parts[0].trim(), parts[1].trim());
    } else {
      const [num1, num2] = parts.map((x) =>
        isNaN(Number(x)) ? x.trim() : Number(x.trim()),
      );
      switch (operator) {
        case ">":
          pass = num1 > num2;
          break;
        case "<":
          pass = num1 < num2;
          break;
        case ">=":
          pass = num1 >= num2;
          break;
        case "<=":
          pass = num1 <= num2;
          break;
      }
    }
    return pass;
  }

  static solveAnd(part: string): string {
    const conditions = part.split("&&");
    const finalConditions: string[] = [];

    for (const condition of conditions) {
      const trimmedCondition = condition.trim();
      if (trimmedCondition === "") {
        finalConditions.push("");
        continue;
      }

      const hasBracket = trimmedCondition.includes(")") ? ")" : "";
      const cleanCondition = trimmedCondition.split(")")[0];
      let result = "";

      if (this.hasOperator(cleanCondition, "||")) {
        result = this.solveOr(cleanCondition) + hasBracket;
      } else {
        const operators = ["==", "!=", ">", "<", ">=", "<="];
        let operatorFound = false;

        for (const operator of operators) {
          if (this.hasOperator(cleanCondition, operator)) {
            result =
              this.solveComparison(cleanCondition, operator) + hasBracket;
            operatorFound = true;
            break;
          }
        }

        if (!operatorFound) {
          finalConditions.push(trimmedCondition);
          continue;
        }
      }
      finalConditions.push(result);
    }

    return finalConditions.join("&&");
  }

  static solveOr(part: string): string {
    const conditions = part.split("||");
    const finalConditions: string[] = [];

    for (const condition of conditions) {
      const trimmedCondition = condition.trim();
      if (trimmedCondition === "") {
        finalConditions.push("");
        continue;
      }

      const hasBracket = trimmedCondition.includes(")") ? ")" : "";
      const cleanCondition = trimmedCondition.split(")")[0];
      let result = "";

      const operators = ["==", "!=", ">", "<", ">=", "<="];
      let operatorFound = false;

      for (const operator of operators) {
        if (this.hasOperator(cleanCondition, operator)) {
          result = this.solveComparison(cleanCondition, operator) + hasBracket;
          operatorFound = true;
          break;
        }
      }

      if (!operatorFound) {
        finalConditions.push(trimmedCondition);
        continue;
      }

      finalConditions.push(result);
    }

    return finalConditions.join("||");
  }

  static solve(msg: string): string {
    const parts = msg.split("(");
    const finalConditions: string[] = [];

    for (const part of parts) {
      if (part.trim() === "") {
        finalConditions.push("");
        continue;
      }
      const solvedAnd = this.solveAnd(part);
      finalConditions.push(solvedAnd);
    }

    let result = finalConditions.join("(");
    const openBrackets = result.split("(").length;
    const closeBrackets = result.split(")").length;

    if (openBrackets !== closeBrackets) {
      result += ")".repeat(openBrackets - closeBrackets);
    }

    return result;
  }

  static checkCondition(code: string): boolean {
    try {
      return eval(
        ConditionChecker.solve(typeof code === "string" ? inspect(code) : code),
      );
    } catch {
      return false;
    }
  }
}

export { ConditionChecker };
