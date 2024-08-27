import { ResourcePage } from 'src/types';
import Request, { setHeaders, setMethod, setURL } from '../request';
import { Dashboard } from './types';
import { API_ROOT } from 'src/constants';

// Returns the list of all the dashboards available
export const getDashboards = (serviceType: string) =>
  Request<ResourcePage<Dashboard>>(
    setURL(`${API_ROOT}/monitor/services/${serviceType}/dashboards`),
    setMethod('GET'),
    setHeaders({
      Authorization: 'Bearer vagrant',
    })
  );

export const getDashboardById = (dashboardId: number) =>
  Request<Dashboard>(
    setURL(`${API_ROOT}/monitor/dashboards/${encodeURIComponent(dashboardId)}`),
    setMethod('GET'),
    setHeaders({
      Authorization: 'Bearer vagrant',
    })
  );
