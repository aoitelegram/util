import { deepEqual } from "node:assert";
import { inspect } from "./Helpers";

/**
 * Tries to check if two values are deeply equal.
 *
 * @param actual - The actual value to check.
 * @param expected - The expected value to check against.
 * @returns `true` if the values are deeply equal, otherwise `false`.
 */
function deepEqualTry(actual: unknown, expected: unknown) {
  try {
    deepEqual(actual, expected);
    return true;
  } catch {
    return false;
  }
}

class ConditionChecker {
  /**
   * Checks if a message contains a specified operator.
   *
   * @param msg - The message to check.
   * @param operator - The operator to look for.
   * @returns `true` if the operator is found in the message, otherwise `false`.
   */
  static hasOperator(msg: string, operator: string) {
    return msg.includes(operator);
  }

  /**
   * Solves a comparison expression based on the given operator.
   *
   * @param part - The expression part to solve.
   * @param operator - The comparison operator to use.
   * @returns The result of the comparison.
   */
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

  /**
   * Solves logical AND expressions within a part.
   *
   * @param part - The expression part containing logical AND.
   * @returns The solved AND expression.
   */
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

  /**
   * Solves logical OR expressions within a part.
   *
   * @param part - The expression part containing logical OR.
   * @returns The solved OR expression.
   */
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

  /**
   * Solves a given message by evaluating logical AND and OR expressions.
   *
   * @param msg - The message containing the expressions to solve.
   * @returns The solved expression.
   */
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

  /**
   * Evaluates a condition code by solving it and then using `eval`.
   *
   * @param code - The condition code to evaluate.
   * @returns `true` if the condition is satisfied, otherwise `false`.
   */
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
