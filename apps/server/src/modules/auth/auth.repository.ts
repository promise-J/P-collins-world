import { UserRepository }
from "../users/user.repository";

export class AuthRepository {

  constructor(
    private readonly users =
      new UserRepository()
  ) {}

  findByEmail(email:string){
    return this.users.findByEmail(email);
  }

  createUser(data:any){
    return this.users.create(data);
  }

  updateRefreshToken(
    id:string,
    token:string
  ){
    return this.users.updateRefreshToken(
      id,
      token
    );
  }
  async findByFirebaseId(firebaseId: string) {
    return this.users.findOne({ firebaseId });
  }
  
  async updateFirebaseId(userId: string, firebaseId: string) {
    return this.users.findByIdAndUpdate(
      userId,
      { firebaseId }
    );
  }
}