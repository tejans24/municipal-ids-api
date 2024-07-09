import { UserService } from "../src/services/userService";
import { PROOF_OF_ID_TYPE, User } from "../src/services/types";

describe("UserService", () => {
  let userService: UserService;
  let user: User;

  beforeEach(() => {
    userService = new UserService();
    user = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "410-456-7890",
      address: {
        street: "123 Main St",
        city: "Baltimore City",
        state: "MD",
        zip: "21203",
      },
      proofsOfId: [
        {
          type: PROOF_OF_ID_TYPE.DRIVERS_LICENSE,
          url: "http://example.com/dl.jpg",
        },
        { type: PROOF_OF_ID_TYPE.PASSPORT, url: "http://example.com/pp.jpg" },
      ],
    });

    UserService.users = [];
  });

  test("should add a user", () => {
    userService.addUser(user);
    const users = userService.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0]).toEqual(user);
  });

  test("should not add a user with the same ID", () => {
    userService.addUser(user);
    userService.addUser(user);
    const users = userService.getUsers();
    expect(users).toHaveLength(1);
  });

  test("should get a user by ID", () => {
    userService.addUser(user);
    const foundUser = userService.getUserById(user.id);
    expect(foundUser).toEqual(user);
  });

  test("should update a user by ID", () => {
    userService.addUser(user);
    userService.updateUser(user.id, { lastName: "Smith" });
    const updatedUser = userService.getUserById(user.id);
    expect(updatedUser?.lastName).toBe("Smith");
  });

  test("should not update a non-existent user", () => {
    userService.addUser(user);
    userService.updateUser("random", { lastName: "Smith" });
    const users = userService.getUsers();
    expect(users[0].lastName).toBe("Doe");
  });

  test("should delete a user by ID", () => {
    userService.addUser(user);
    userService.deleteUser(user.id);
    const users = userService.getUsers();
    expect(users).toHaveLength(0);
  });

  test("should return undefined for non-existent user", () => {
    const foundUser = userService.getUserById("nonexistent");
    expect(foundUser).toBeUndefined();
  });
});
