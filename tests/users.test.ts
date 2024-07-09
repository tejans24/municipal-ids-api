import { registerUser, RegisterUserResponse } from "../src/users";
import { MunicipalIDService } from "../src/services/municipalIDService";
import { UserService } from "../src/services/userService";
import {
  PROOF_OF_ID_TYPE,
  RESIDENCY_VERIFICATION_STATUS,
  User,
} from "../src/services/types";

// jest.mock("../src/services/municipalIDService");
// jest.mock("../src/services/userService");

describe("registerUser", () => {
  // let municipalIDService: MunicipalIDService;
  let userService: UserService;
  let user: User;

  beforeEach(() => {
    // municipalIDService = new MunicipalIDService();
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

    // Clear mocks before each test
    jest.clearAllMocks();
  });

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