import { ProjectEnvironmentConfig } from './project';
import { QueueOptions } from 'bull';

export type ConfigEnvironmentType = {
  /**
   * =============================
   * SERVER SHARED ENVIRONMENT
   * =============================
   */
  environment: string;

  /**
   * =============================
   * SERVER PROJECT ENVIRONMENT
   * =============================
   * NOTE: Add more project according project setup
   */
  appointment: ProjectEnvironmentConfig;
};
