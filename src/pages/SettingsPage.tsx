import { Link } from "react-router";
import { HomeIcon } from "../components/icons/home-icon";
import { SettingsFriendsGoals } from "../components/settings/settings-friends-goals";
import { SettingsNotifies } from "../components/settings/settings-notifies";
import { SettingsUserInfo } from "../components/settings/settings-user-info/settings-user-info";
import { SettingsUserName } from "../components/settings/settings-user-name/settings-user-name";

export function SettingsPage() {
  return (
    <section className="relative pb-10">
      <Link to="/" className="absolute top-3 right-3">
        <HomeIcon />
      </Link>
      <SettingsUserInfo />
      <SettingsUserName />
      <SettingsNotifies />
      <SettingsFriendsGoals />
    </section>
  );
}
