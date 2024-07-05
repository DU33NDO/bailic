import User, { IUser } from "../models/User";

class AuthService {
  async createUser(username: string, userPhoto: string): Promise<IUser> {
    console.log(
      `Creating user with username: ${username}, userPhoto: ${userPhoto}`
    );
    const user = new User({ username, userPhoto });
    return await user.save();

  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUsernameById(_id: string): Promise<string | null> {
    const user = await User.findById(_id);
    return user ? user.username : null;
  }

  async updateUserClickedBy(
    username: string,
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { username },
      { new: true }
    );
  }
}

export default new AuthService();
