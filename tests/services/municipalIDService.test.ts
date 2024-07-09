import { MunicipalIDService } from "../../src/services/municipalIDService";
import {
  User,
  RESIDENCY_VERIFICATION_STATUS,
  PROOF_OF_ID_TYPE,
} from "../../src/services/types";
import { VerificationService } from "../../src/services/verificationService";
import { UserService } from "../../src/services/userService";
import { MunicipalIDIntegrationService } from "../../src/services/municipalIDIntegrationService";

describe("MunicipalIDService", () => {
  let municipalIDService: MunicipalIDService;
  let user: User;

  beforeEach(() => {
    municipalIDService = new MunicipalIDService();

    user = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
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
          url: "http://example.com/dl.jpg",
        },
        { type: PROOF_OF_ID_TYPE.PASSPORT, url: "http://example.com/pp.jpg" },
      ],
    });

    // Clear static users array before each test
    (UserService as any).users = [];
  });

  test("should return not verified message if user is not verified", () => {
    jest
    .spyOn(VerificationService.prototype, "verifyProofsOfId")
    .mockReturnValue({
      status: RESIDENCY_VERIFICATION_STATUS.NOT_VERIFIED,
    });

    const message = municipalIDService.issueMunicipalId(user);
    expect(message).toBe(
      "User John Doe is not a verified resident of Baltimore City."
    );
  });

  test("should issue municipal ID for city resident", () => {
    jest
      .spyOn(VerificationService.prototype, "verifyProofsOfId")
      .mockReturnValue({
        status: RESIDENCY_VERIFICATION_STATUS.CITY_RESIDENCY_VERIFIED,
      });

    const connectCityResidentDefaultServicesSpy = jest.spyOn(
      MunicipalIDIntegrationService.prototype,
      "connectCityResidentDefaultServices"
    );

    const message = municipalIDService.issueMunicipalId(user);

    expect(connectCityResidentDefaultServicesSpy).toHaveBeenCalledWith(user.id);
    expect(message).toBe("Municipal Id issued to John Doe.");
  });

  test("should issue municipal ID for state resident", () => {
    jest
      .spyOn(VerificationService.prototype, "verifyProofsOfId")
      .mockReturnValue({
        status: RESIDENCY_VERIFICATION_STATUS.STATE_RESIDENCY_VERIFIED,
      });

    const connectOnlyLibraryServiceSpy = jest.spyOn(
      MunicipalIDIntegrationService.prototype,
      "connectOnlyLibraryService"
    );

    const message = municipalIDService.issueMunicipalId(user);

    expect(connectOnlyLibraryServiceSpy).toHaveBeenCalledWith(user.id);
    expect(message).toBe(
      "Municipal Id issued just for library services to John Doe."
    );
  });

  test("should return rejected message if user is rejected", () => {
    jest
      .spyOn(VerificationService.prototype, "verifyProofsOfId")
      .mockReturnValue({
        status: RESIDENCY_VERIFICATION_STATUS.REJECTED,
        rejectionReason: "Invalid documents",
      });

    const message = municipalIDService.issueMunicipalId(user);

    expect(user.residencyVerificationRejectionReason).toBe("Invalid documents");
    expect(message).toBe(
      "User does not meet the criteria for a Municipal Id nor library services."
    );
  });
});