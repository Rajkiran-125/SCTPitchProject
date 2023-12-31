export interface Breadcrumb{
  label: string;
  url: string;
}

export interface hawkerPersonalDetails {
  contactId: string,
  userId: number,
  userType: number,
  userSubType: number,
  personalEmail: string,
  salutation: string,
  firstName: string,
  middleName: string,
  lastName: string,
  mobileNumber: number,
  alternateMobileNumber: number,
  emergencyContactNumber: number,
  emergencyContactName: string,
  relation: string,
  landlineNumber: number,
  whatsAppNumber: number,
  authorisingWhatsApp: boolean,
  gender: string,
  dob: any,
  religion: string,
  maritalStatus: string,
  dateOfMarriage: any,
  motherTongue: string,
  languages: string,
  facebookId: string,
  twitterHandle: string,
  linkedIn: string,
  skype: string,
  instagram: string,
  countryId: number,
  stateId: number,
  cityId: number,
  pinCodeId: number,
  currentAddress: string,
  permanentAddress: string,
  communicationAddress: string,
  caste: string,
  isCasteCertificateSubmitted: boolean,
  medicalHistory: number,
  medicalHistoryIfOther: string,
  isAadharCardUploaded: boolean,
  isPanCardUploaded: boolean,
  ageProof: number,
  passport: string,
  rationCard: string,
  drivingLicense: string,
  isSignatureUploaded: boolean,
  timeZone: string,
  nationality: number,
  accountNumber: number,
  ifsc: string,
  bankName: string,
  isPhotographUploaded: boolean,
  isHealthInsuranceCheck: boolean,
  bloodGroup: string,
  addressProofType: string,
  covidVaccinationStatus: boolean,
  createdBy: number,
  createdOn: any,
  modifiedBy: number,
  modifiedOn: any,
  isDeleted: boolean,
  deletedBy: number,
  deletedOn: any,
  publicIp: string,
  privateIp: string,
  browserName: string,
  browserVersion: string
}
export interface hawkerAcademicDetails {
  userId: number,
  contactId: string,
  educationQual: number,
  sschscDegreeCert: string,
  postGradCert: string,
  otrQualCert: string,
  createdBy: number,
  createdOn: any,
  modifiedBy: number,
  modifiedOn: any,
  isDeleted: boolean,
  deletedBy: number,
  deletedOn: any,
  publicIp: string,
  privateIp: string,
  browserName: string,
  browserVersion: string
}
export interface hawkerProfessionalDetails {
  userId: number,
  contactId: string,
  officialEmail: string,
  isPhysicallyChallenged: string,
  isReferenceCheckDone: boolean,
  isPoliceVerificationDone: boolean,
  anyOngoingCases: boolean,
  accountNumber: number,
  organizationName: string,
  designationId: number,
  employeeId: number,
  employeeType: string,
  employeeStatus: string,
  reportingTo: string,
  department: string,
  doj: any,
  isResumeUploaded: boolean,
  isOfferLetterUploaded: boolean,
  isAptLtrCnsltAgmtUploaded: boolean,
  rlvgLtrResgAcceptanceLtr: string,
  operationLocation: number,
  dateOfJoining: any,
  dateOfLeaving: any,
  dateOfConfirmation: any,
  band: string,
  ctc: number,
  salarySlips: string,
  form16: string,
  refCheckFormFilled: string,
  serviceArea: string,
  industryType: string,
  createdBy: number,
  createdOn: any,
  modifiedBy: number,
  modifiedOn: any,
  isDeleted: boolean,
  deletedBy: number,
  deletedOn: any,
  publicIp: string,
  privateIp: string,
  browserName: string,
  browserVersion: string
}
export interface hawkerOtherDetails {
  userId: number,
  contactId: string,
  medTestInitiationDate: any,
  medTestStatus: string,
  medTestResultDate: any,
  isMedTestReportUploaded: false,
  verificationInitiationDate: any,
  policeVerificationStatus: string,
  isPoliceClearanceAttached: false,
  undertakingIfApplicable: string,
  pfuanDetailsIfApplicable: string,
  createdBy: number,
  createdOn: any,
  modifiedBy: number,
  modifiedOn: any,
  isDeleted: false,
  deletedBy: number,
  deletedOn: any,
  publicIp: string,
  privateIp: string,
  browserName: string,
  browserVersion: string
}
export interface addSkills {
  flag: string,
  SKILLNAME: string,
  CREATEDBY: number,
  SKILLDESC: string,
  PROCESSID: string,
  PUBLICIP: string,
  IP: string,
  BROWSERNAME: string,
  BROWSERVERSION: string
}
export interface updateSkills {
  flag: string,
  ID: string,
  SKILLNAME: string,
  MODIFIEDBY: number, 
  SKILLDESC: string,
  PROCESSID: string,
  PUBLICIP: string,
  IP: string,
  BROWSERNAME: string,
  BROWSERVERSION: string
}