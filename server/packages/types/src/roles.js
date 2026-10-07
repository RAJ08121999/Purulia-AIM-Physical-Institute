"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.ContentStatus = exports.ForceType = exports.AttendanceStatus = exports.ApplicationStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["TRAINER"] = "TRAINER";
    UserRole["CONTENT_MANAGER"] = "CONTENT_MANAGER";
    UserRole["STUDENT"] = "STUDENT";
    UserRole["APPLICANT"] = "APPLICANT";
    UserRole["VISITOR"] = "VISITOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ApplicationStatus["APPROVED"] = "APPROVED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["WAITLISTED"] = "WAITLISTED";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["LEAVE"] = "LEAVE";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var ForceType;
(function (ForceType) {
    ForceType["ARMY"] = "ARMY";
    ForceType["NAVY"] = "NAVY";
    ForceType["AIR_FORCE"] = "AIR_FORCE";
    ForceType["POLICE"] = "POLICE";
    ForceType["RPF"] = "RPF";
    ForceType["CAPF"] = "CAPF";
    ForceType["SSC_GD"] = "SSC_GD";
    ForceType["OTHER"] = "OTHER";
})(ForceType || (exports.ForceType = ForceType = {}));
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["SUBMITTED"] = "SUBMITTED";
    ContentStatus["APPROVED"] = "APPROVED";
    ContentStatus["REJECTED"] = "REJECTED";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["GENERAL"] = "GENERAL";
    NotificationType["BATCH"] = "BATCH";
    NotificationType["PERSONAL"] = "PERSONAL";
    NotificationType["TRAINING"] = "TRAINING";
    NotificationType["RECRUITMENT"] = "RECRUITMENT";
    NotificationType["RESULT"] = "RESULT";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=roles.js.map