const strict_range = /\[(.*),(.*)\]/
const halfopen_right_range = /\[(.*),(.*)\)/
const halfopen_left_range = /\((.*),(.*)\]/
const qualifiers = ["M", "RC", "BUILD-SNAPSHOT", "RELEASE"]

const compare = (a, b) => {
  let result
  const versionA = a.split(".")
  const versionB = b.split(".")
  const parseQualifier = version => {
    const qual = (version || "").replace(/\d+/g, "")
    return qualifiers.indexOf(qual) != -1 ? qual : "RELEASE"
  }
  for (let i = 0; i < 3; i++) {
    result = parseInt(versionA[i], 10) - parseInt(versionB[i], 10)
    if (result !== 0) {
      return result
    }
  }
  const aqual = parseQualifier(versionA[3])
  const bqual = parseQualifier(versionB[3])
  result = qualifiers.indexOf(aqual) - qualifiers.indexOf(bqual)
  if (result != 0) {
    return result
  }
  return versionA[3].localeCompare(versionB[3])
}

const CompareVersion = (version, range) => {
  const strict_match = range.match(strict_range)
  if (strict_match) {
    return (
      compare(strict_match[1], version) <= 0 &&
      compare(strict_match[2], version) >= 0
    )
  }
  const hor_match = range.match(halfopen_right_range)
  if (hor_match) {
    return (
      compare(hor_match[1], version) <= 0 && compare(hor_match[2], version) > 0
    )
  }
  const hol_match = range.match(halfopen_left_range)
  if (hol_match) {
    return (
      compare(hol_match[1], version) < 0 && compare(hol_match[2], version) >= 0
    )
  }
  return compare(range, version) <= 0
}

export default CompareVersion
