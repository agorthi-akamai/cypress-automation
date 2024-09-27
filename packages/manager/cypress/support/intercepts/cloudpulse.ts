/**
 * Intercepts request to metrics requests for a cloud pulse.
 *
 * @returns Cypress chainable.
 */

import { apiMatcher } from 'support/util/intercepts';

import type {
  CloudPulseMetricsResponse,
  Dashboard,
  MetricDefinitions,
} from '@linode/api-v4';

/**
 * Intercepts HTTP GET requests for metric definitions.
 *
 * This function mocks the API response for requests to the endpoint
 * `dashboardMetricsData`.
 *
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */

export const mockCloudPulseGetMetricDefinitions = (
  metricDefinitions: MetricDefinitions,
  service_type: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`/monitor/services/${service_type}/metric-definitions`),
    metricDefinitions
  );
};

/**
 * Intercepts HTTP GET requests for metric definitions.
 *
 * This function mocks the API response for requests to the endpoint
 * `dashboardMetricsData`.
 *
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */

export const mockCloudPulseServices = (
  service_type: string
): Cypress.Chainable<null> => {
  return cy.intercept('GET', apiMatcher('/monitor/services'), {
    data: [{ service_type }],
  });
};
/**
 * Intercepts HTTP GET requests for dashboard definitions.
 *
 * This function mocks the API response for requests to the endpoint
 * `dashboardDefinitions`.
 *
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */

export const mockCloudPulseGetDashboards = (
  dashboard: Dashboard,
  service_type: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`/monitor/services/${service_type}/dashboards`),
    { data: [dashboard] }
  );
};

/**
 * Intercepts POST requests to the metrics endpoint with a custom mock response.
 *
 * This function allows you to specify a mock response for POST requests
 *
 * @param {any} mockResponse - The mock response to return for the intercepted request.
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */
export const mockCloudPulseCreateMetrics = (
  mockResponse: CloudPulseMetricsResponse,
  service_type: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    `**/monitor/services/${service_type}/metrics`,
    mockResponse
  );
};
/**
 * Mocks the API response for fetching a dashboard.
 *
 * This function uses Cypress's `cy.intercept` to intercept GET requests to a specific API endpoint
 * and return a mock response. This is useful for testing how your application handles various
 * responses without making actual network requests.
 *
 * @param {Dashboard} dashboard - The mock response data to return for the dashboard request.
 * @param {number} id - The ID of the dashboard to mock the response for.
 * @returns {Cypress.Chainable<null>} - Returns a Cypress chainable object, allowing for command chaining in tests.
 */

export const mockCloudPulseDashboardServicesResponse = (
  dashboard: Dashboard,
  id: number
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`/monitor/dashboards/${id}`),
    dashboard
  );
};

/**
 * Mocks the API response for generating a JWT token for a specific service.
 *
 * This function sets up an interception for POST requests to the endpoint that generates
 * JWT tokens for a particular service type. By returning a mock JWT token, you can test
 * how your application handles authentication and authorization without making actual network
 * requests to the backend service.
 *
 * @param {string} service_type - The type of service for which to mock the JWT token request.
 * @returns {Cypress.Chainable<null>} - Returns a Cypress chainable object, enabling command chaining in tests.
 */
const JWSToken = {
  token: 'eyJhbGciOiAiZGlyIiwgImVuYyI6ICJBMTI4Q0JDLUhTMjU2IiwgImtpZCI6ID',
};
export const mockCloudPulseJWSToken = (
  service_type: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    apiMatcher(`/monitor/services/${service_type}/token`),
    JWSToken
  );
};
