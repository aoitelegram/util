/**
 * Retrieves a property value from an object. If no property is specified, returns the object itself.
 *
 * @param object - The object from which to retrieve the property.
 * @param property - The property to retrieve. If undefined, the entire object is returned.
 * @param parse - Optional. If true, the result is parsed using the `inspect` function.
 * @returns The property value if a property is specified; otherwise, the entire object.
 */
function getObjectKey<T extends Record<string, any>>(
  object: T,
  property?: undefined,
): T;
function getObjectKey<T extends Record<string, any>>(
  object: T,
  property: string,
  parse?: boolean,
): string;
function getObjectKey<T extends Record<string, any>>(
  object: T,
  property?: string,
  parse: boolean = true,
) {
  if (!property) return object;
  try {
    const resultProperty = property.startsWith("[")
      ? eval(`object${property}`)
      : eval(`object.${property}`);
    return parse ? inspect(resultProperty) : resultProperty;
  } catch (err) {
    return inspect(undefined);
  }
}

/**
 * Converts an inspected string back to its original value.
 *
 * @param str - The inspected string to convert.
 * @returns The original value.
 */
function unInspect(str: string): any {
  const trimmedStr = str.trim();

  if (trimmedStr.startsWith("{") && trimmedStr.endsWith("}")) {
    return parseObject(trimmedStr);
  } else if (trimmedStr.startsWith("[") && trimmedStr.endsWith("]")) {
    return parseArray(trimmedStr);
  } else {
    return parseValue(trimmedStr);
  }
}

/**
 * Parses a string representation of an object back to an object.
 *
 * @param str - The string representation of the object.
 * @returns The parsed object.
 */
function parseObject(str: string): any {
  const obj: { [key: string]: any } = {};
  let key = "";
  let value = "";
  let isParsingKey = true;
  let inString = false;
  let currentStringDelimiter = "";
  let bracketCount = 0;

  for (let i = 1; i < str.length - 1; i++) {
    const char = str[i];

    if (char === '"' || char === "'") {
      if (inString && currentStringDelimiter === char) {
        inString = false;
      } else if (!inString) {
        inString = true;
        currentStringDelimiter = char;
      }
    }

    if (inString) {
      if (isParsingKey) {
        key += char;
      } else {
        value += char;
      }
    } else {
      if (char === "{" || char === "[") {
        bracketCount++;
      } else if (char === "}" || char === "]") {
        bracketCount--;
      }

      if (bracketCount === 0 && char === ":" && isParsingKey) {
        isParsingKey = false;
      } else if (bracketCount === 0 && char === "," && !isParsingKey) {
        obj[parseKey(key)] = unInspect(value.trim());
        key = "";
        value = "";
        isParsingKey = true;
      } else {
        if (isParsingKey) {
          key += char;
        } else {
          value += char;
        }
      }
    }
  }

  if (key !== "" && value !== "") {
    obj[parseKey(key)] = unInspect(value.trim());
  }

  return obj;
}

/**
 * Parses a string representation of an array back to an array.
 *
 * @param str - The string representation of the array.
 * @returns The parsed array.
 */
function parseArray(str: string): any[] {
  const arr: any[] = [];
  let value = "";
  let inString = false;
  let currentStringDelimiter = "";
  let bracketCount = 0;

  for (let i = 1; i < str.length - 1; i++) {
    const char = str[i];

    if (char === '"' || char === "'") {
      if (inString && currentStringDelimiter === char) {
        inString = false;
      } else if (!inString) {
        inString = true;
        currentStringDelimiter = char;
      }
    }

    if (inString) {
      value += char;
    } else {
      if (char === "{" || char === "[") {
        bracketCount++;
      } else if (char === "}" || char === "]") {
        bracketCount--;
      }

      if (bracketCount === 0 && char === "," && !inString) {
        arr.push(unInspect(value.trim()));
        value = "";
      } else {
        value += char;
      }
    }
  }

  if (value.trim() !== "") {
    arr.push(unInspect(value.trim()));
  }

  return arr;
}

/**
 * Parses a string representation of a primitive value back to its original type.
 *
 * @param str - The string representation of the value.
 * @returns The parsed value.
 */
function parseValue(str: string): any {
  if (str === "undefined") return undefined;
  if (str === "null") return null;
  if (str === "true") return true;
  if (str === "false") return false;
  if (!isNaN(Number(str)) && str !== "") return Number(str);
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    return str.slice(1, -1);
  }
  return str;
}

/**
 * Parses a string key and removes surrounding quotes if present.
 *
 * @param str - The string key to parse.
 * @returns The parsed key.
 */
function parseKey(str: string): string {
  return str.trim().replace(/^["']|["']$/g, "");
}

/**
 * Converts an object or value into its string representation.
 *
 * @param obj - The object or value to inspect.
 * @returns The string representation of the object or value.
 */
function inspect(obj: any): string {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return "[" + obj.map(inspect).join(", ") + "]";
    } else {
      const entries = Object.entries(obj).map(
        ([key, value]) => `"${key}": ${inspect(value)}`,
      );
      return "{ " + entries.join(", ") + " }";
    }
  } else {
    return String(obj);
  }
}

/**
 * Unescapes special sequences in a string to their original characters.
 *
 * @param code - The string containing escaped sequences.
 * @returns The unescaped string.
 */
function unescapeCode(code: string): string {
  return code
    .replace(/@at/gi, "@")
    .replace(/@left/gi, "[")
    .replace(/@right/gi, "]")
    .replace(/@semi/gi, ";")
    .replace(/@colon/gi, ":")
    .replace(/@equal/gi, "=")
    .replace(/@or/gi, "||")
    .replace(/@and/gi, "&&")
    .replace(/@higher/gi, ">")
    .replace(/@lower/gi, "<")
    .replace(/@left_parent/gi, ")")
    .replace(/@right_parent/gi, "(")
    .replace(/@dollar/gi, "$");
}

/**
 * Escapes special characters in a string with specific sequences.
 *
 * @param code - The string containing characters to escape.
 * @returns The escaped string.
 */
function escapeCode(code: string): string {
  return code
    .replace(/@/g, "@at")
    .replace(/\]/g, "@right")
    .replace(/\[/g, "@left")
    .replace(/;/g, "@semi")
    .replace(/:/g, "@colon")
    .replace(/=/g, "@equal")
    .replace(/\|\|/g, "@or")
    .replace(/&&/g, "@and")
    .replace(/>/g, "@higher")
    .replace(/</g, "@lower")
    .replace(/\$/g, "@dollar");
}

export { getObjectKey, inspect, unInspect, escapeCode, unescapeCode };
