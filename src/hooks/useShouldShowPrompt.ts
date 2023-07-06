import { useState } from 'react';
import moment from 'moment';

const getInstallPromptLastSeenAt = (promptName: any): any => localStorage.getItem(promptName);

const setInstallPromptSeenToday = (promptName: any): any => {
  const today = moment().toISOString();
  localStorage.setItem(promptName, today);
};

function getUserShouldBePromptedToInstall(promptName: string, daysToWaitBeforePromptingAgain: number): boolean {
  const lastPrompt = moment(getInstallPromptLastSeenAt(promptName));
  const daysSinceLastPrompt = moment().diff(lastPrompt, 'days');
  return isNaN(daysSinceLastPrompt) || daysSinceLastPrompt > daysToWaitBeforePromptingAgain;
}

const useShouldShowPrompt = (promptName: string, daysToWaitBeforePromptingAgain = 30): [boolean, () => void] => {
  const [userShouldBePromptedToInstall, setUserShouldBePromptedToInstall] = useState(
    getUserShouldBePromptedToInstall(promptName, daysToWaitBeforePromptingAgain)
  );

  const handleUserSeeingInstallPrompt = () => {
    setUserShouldBePromptedToInstall(false);
    setInstallPromptSeenToday(promptName);
  };

  return [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};
export default useShouldShowPrompt;