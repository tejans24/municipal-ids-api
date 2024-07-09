import {
  registerUser,
  RegisterUserResponse,
  getUser,
  verifyUser,
} from "../src/api";
import { MunicipalIDService } from "../src/services/municipalIDService";
import { UserService } from "../src/services/userService";
import { PROOF_OF_ID_TYPE, User } from "../src/services/types";

describe("registerUser", () => {
  let userService: UserService;
  let user: User;

  beforeEach(() => {
    userService = new UserService();
    user = new User({
      firstName: "John",
      lastName: "Doe",
      email: "hello@mail.com",
      phone: "123-456-7890",
      address: {
        street: "123 Main St",
        city: "Baltimore City",
        state: "MD",
        zip: "12345",
      },
      proofsOfId: [
        {
          type: PROOF_OF_ID_TYPE.DRIVERS_LICENSE,
          url: "https://example.com/drivers_license.jpg",
        },
        {
          type: PROOF_OF_ID_TYPE.PASSPORT,
          url: "https://example.com/passport.png",
        },
      ],
    });
    userService.addUser(user);
    // Clear mocks before each test
    jest.clearAllMocks();
  });
  describe("registerUser", () => {
    test("should register user and issue municipal ID", async () => {
      jest
        .spyOn(MunicipalIDService.prototype, "issueMunicipalId")
        .mockReturnValue(`Municipal Id issued to ${user.fullName()}`);

      const response = await registerUser(user);

      expect(response).toEqual({
        message: "User registered and city residency verified.",
        id: user.id,
        cityResidencyStatus: user.residencyVerificationStatus,
        services: user.services,
      });
    });

    test("should handle errors during user registration", async () => {
      jest
        .spyOn(MunicipalIDService.prototype, "issueMunicipalId")
        .mockImplementation(() => {
          throw new Error("User does not meet the criteria for a Municipal ID");
        });

      const response = await registerUser(user);

      expect(response).toEqual({
        error: "User does not meet the criteria for a Municipal ID",
      });
    });
  });

  describe("getUser", () => {
    test("should verify user successfully", async () => {
      const response = await getUser(user.id);
      expect(response).toEqual(user);
    });

    test("should return error if user is not found", async () => {
      const response = await getUser("nonexistent");
      expect(response).toEqual({
        error: "User not found",
      });
    });

    test("should handle errors during user verification", async () => {
      jest
        .spyOn(MunicipalIDService.prototype, "getUser")
        .mockImplementation(() => {
          throw new Error("Internal server error");
        });

      const response = await getUser(user.id);
      expect(response).toEqual({
        error: "Internal server error",
      });
    });
  });

  describe("verifyUser", () => {
    test("should verify user successfully", async () => {
      const response = await verifyUser(user.id);
      expect(response).toEqual({
        id: user.id,
        fullName: user.fullName(),
        residencyVerificationStatus: user.residencyVerificationStatus,
        services: user.services,
      });
    });

    test("should return error if user is not found", async () => {
      const response = await verifyUser("nonexistent");
      expect(response).toEqual({
        error: "User not found",
      });
    });

    test("should handle errors during user verification", async () => {
      jest
        .spyOn(MunicipalIDService.prototype, "verifyUser")
        .mockImplementation(() => {
          throw new Error("Internal server error");
        });

      const response = await verifyUser(user.id);
      expect(response).toEqual({
        error: "Internal server error",
      });
    });
  });
});
