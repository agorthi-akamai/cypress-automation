import { useRef } from 'react';

import {
  useMutatePreferences,
  usePreferences,
} from 'src/queries/profile/preferences';

import { DASHBOARD_ID, TIME_DURATION, WIDGETS } from './constants';

import type { AclpConfig, AclpWidget } from '@linode/api-v4';

interface AclpPreferenceObject {
  isLoading: boolean;
  preferences: AclpConfig;
  updateGlobalFilterPreference: (data: AclpConfig) => void;
  updateWidgetPreference: (label: string, data: Partial<AclpWidget>) => void;
}

export const useAclpPreference = (): AclpPreferenceObject => {
  const { data: preferences, isLoading } = usePreferences();

  const { mutateAsync: updateFunction } = useMutatePreferences();

  const preferenceRef = useRef(preferences?.aclpPreference ?? {});

  /**
   *
   * @param data AclpConfig data to be updated in preferences
   */
  const updateGlobalFilterPreference = (data: AclpConfig) => {
    let currentPreferences = { ...preferenceRef.current };
    const keys = Object.keys(data);

    if (keys.includes(DASHBOARD_ID)) {
      currentPreferences = {
        ...data,
        [TIME_DURATION]: currentPreferences[TIME_DURATION],
        [WIDGETS]: {},
      };
    } else {
      currentPreferences = {
        ...currentPreferences,
        ...data,
      };
    }
    preferenceRef.current = currentPreferences;
    updateFunction({ aclpPreference: currentPreferences });
  };

  /**
   *
   * @param label label of the widget that should be updated
   * @param data AclpWidget data for the label that is to be updated in preference
   */
  const updateWidgetPreference = (label: string, data: Partial<AclpWidget>) => {
    const updatedPreferences = { ...preferenceRef.current };

    if (!updatedPreferences.widgets) {
      updatedPreferences.widgets = {};
    }

    updatedPreferences.widgets[label] = {
      ...updatedPreferences.widgets[label],
      label,
      ...data,
    };

    preferenceRef.current = {
      ...preferenceRef.current,
      widgets: { ...updatedPreferences.widgets },
    };
    updateFunction({ aclpPreference: updatedPreferences });
  };

  return {
    isLoading,
    preferences: { ...(preferences?.aclpPreference ?? {}) },
    updateGlobalFilterPreference,
    updateWidgetPreference,
  };
};
