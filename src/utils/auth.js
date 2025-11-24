import Cookies from "js-cookie";

const TokenKey = "Admin-Token";
const SchoolInfoKey = "School-Info";
const CollegeInfoKey = "College-Info";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getSchoolInfo() {
  const schoolInfo = Cookies.get(SchoolInfoKey);
  return schoolInfo ? JSON.parse(schoolInfo) : null;
}

export function setSchoolInfo(schoolInfo) {
  return Cookies.set(SchoolInfoKey, JSON.stringify(schoolInfo));
}

export function removeSchoolInfo() {
  return Cookies.remove(SchoolInfoKey);
}

export function getCollegeInfo() {
  const collegeInfo = Cookies.get(CollegeInfoKey);
  return collegeInfo ? JSON.parse(collegeInfo) : null;
}

export function setCollegeInfo(collegeInfo) {
  return Cookies.set(CollegeInfoKey, JSON.stringify(collegeInfo));
}

export function removeCollegeInfo() {
  return Cookies.remove(CollegeInfoKey);
}
