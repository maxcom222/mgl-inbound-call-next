import { useContext } from 'react';
import { initializeYupForm } from './vendor/yup';
import i18n, { I18nState, I18nContext } from './vendor/i18n';

export const useYupForm = initializeYupForm({ i18n });

export function useI18n(): I18nState {
  return useContext(I18nContext);
}
