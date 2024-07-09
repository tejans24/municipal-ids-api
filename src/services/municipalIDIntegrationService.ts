/**
 * This file contains the MunicipalIDIntegrationService class which handles integration with city services.
 */

import {
  SUPPORTED_CITY_SERVICES,
  RESIDENCY_VERIFICATION_STATUS,
  User,
  UserSubscribedService,
} from "./types";
import { UserService } from "./userService";

export class MunicipalIDIntegrationService {
  DEFAULT_CITY_SERVICES = [
    SUPPORTED_CITY_SERVICES.LIBRARY,
    SUPPORTED_CITY_SERVICES.WATER,
    SUPPORTED_CITY_SERVICES.TRANSIT,
  ];

  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async connectCityResidentDefaultServices(
    userId: string,
  ): Promise<SUPPORTED_CITY_SERVICES[]> {
    if (this.userService.getUserById(userId)?.isVerifiedCityResident()) {
      return this.connectServices(userId, this.DEFAULT_CITY_SERVICES);
    } else {
      throw new Error("User does not meet the criteria for a Municipal ID");
    }
  }

  public async connectOnlyLibraryService(
    userId: string,
  ): Promise<SUPPORTED_CITY_SERVICES[]> {
    if (this.userService.getUserById(userId)?.isVerifiedStateResident()) {
      return this.connectServices(userId, [SUPPORTED_CITY_SERVICES.LIBRARY]);
    } else {
      throw new Error("User does not meet the criteria for a Library service");
    }
  }

  public async connectServices(
    userId: string,
    services: SUPPORTED_CITY_SERVICES[],
  ): Promise<SUPPORTED_CITY_SERVICES[]> {
    const user = this.userService.getUserById(userId);
    let addedServices: UserSubscribedService[] = [];

    for (const service of services) {
      const mockResponse = { data: { id: this.generateMockServiceId() } };

      if (user && this.isEligibleForService(user, service)) {
        addedServices.push({
          type: service,
          associatedId: mockResponse.data.id,
        });
      }
    }

    this.userService.updateUser(userId, {
      services: addedServices,
    });

    return services;
  }

  private generateMockServiceId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // TODO: This can be more permission level based check
  private isEligibleForService(
    user: User,
    service: SUPPORTED_CITY_SERVICES,
  ): boolean {
    return (
      user.residencyVerificationStatus ===
      RESIDENCY_VERIFICATION_STATUS.CITY_RESIDENCY_VERIFIED
    );
  }
}
