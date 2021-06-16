"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const Project_1 = require("./Project");
exports.userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    pwdHash: String,
    salt: String,
    projects: { type: [Project_1.projectSchema], default: [] },
    isAuthEmail: { type: Boolean, default: false },
    authEmailToken: { type: String }
}, {
    timestamps: { currentTime: () => Date.now() }
});
// .pre<IUser>('save', async function(next) {
//     const hash = await bcrypt.hash(this.pwdHash, 10);
//     this.pwdHash = hash;
//     next();
// })
exports.default = mongoose_1.model('User', exports.userSchema);
// export class User implements IUser {
//     public id: number;
//     public name: string;
//     public email: string;
//     public role: UserRoles;
//     public pwdHash: string;
//     constructor(
//         nameOrUser?: string | IUser,
//         email?: string,
//         role?: UserRoles,
//         pwdHash?: string,
//         id?: number,
//     ) {
//         if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
//             this.name = nameOrUser || '';
//             this.email = email || '';
//             this.role = role || UserRoles.Standard;
//             this.pwdHash = pwdHash || '';
//             this.id = id || -1;
//         } else {
//             this.name = nameOrUser.name;
//             this.email = nameOrUser.email;
//             this.role = nameOrUser.role;
//             this.pwdHash = nameOrUser.pwdHash;
//             this.id = nameOrUser.id;
//         }
//     }
// }
